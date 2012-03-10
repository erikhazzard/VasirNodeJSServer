//Global vars
var winston = require('winston'),
    cluster = require('cluster'),
    num_cpus = require('os').cpus().length;

//Set SocketIO Log level (TODO: Use winston)

//Configure winston

//----------------------------------------------------------------------------
//
//Socket setup
//
//----------------------------------------------------------------------------
//---------------------------------------
//Socket object config
//---------------------------------------
var VASIR_ENGINE = {
    'clients': {}
};

//============================================================================
//Cluster setup
//============================================================================
if(cluster.isMaster){
    winston.log(
        'info',
        'Starting server with ' + num_cpus + ' CPUs'
    );

    //Fork workers
    for(i=num_cpus-1; i>=0; i--){
        cluster.fork();
    }

    //Keep everything alive
    cluster.on('death', function(worker){
        winston.log(
            'error',
            'Worker ' + worker.pid + ' died'
        );

    });
}else{
    //Worker threads
    //============================================================================
    //Socket IO / Redis
    //  Communication between node / client to get client the latest
    //  game state
    //TODO: Could use ZeroMQ here instead of in pythonland
    //============================================================================
    var redis = require('redis'),
        client = redis.createClient(),
        io = require('socket.io').listen(3000);

    io.set('log level', 1);
    io.enable('browser client gzip');  
    io.enable('browser client minification');

    io.sockets.on('connection', function (socket) {
        //Subscribe to the game_state:world channel
        var subscribe = redis.createClient();
        subscribe.subscribe('engine:game_state');

        //When a message is published to the game_state:world channel,
        //  emit a socket event which will get pushed to the client
        //  with socket.io
        subscribe.on('message', function(channel, msg){
            socket.emit('game_state:update', msg);
            //console.log('emitted', msg);
        });

        //When the client disconnects, close the subscription
        socket.on('disconnect', function(){
            subscribe.quit();
        });

        //Lisen to other event
        socket.on('my other event', function (data) {
            //console.log('from client', data);
        });
    });
}
