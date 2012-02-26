//Global vars
var io = require('socket.io').listen(1337);
var redis = require('redis');
var client = redis.createClient();

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
//Socket IO / Redis
//============================================================================
io.sockets.on('connection', function (socket) {
    //Subscribe to the game_state:world channel
    var subscribe = redis.createClient();
    subscribe.subscribe('game_state:world');

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
