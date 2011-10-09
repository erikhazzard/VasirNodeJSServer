//Global vars
var app = require('http').createServer(handler), 
    io = require('socket.io').listen(app), 
    fs = require('fs')

var zeromq = require("zeromq");

//List on port 1337
app.listen(1337);

//Generic handler func
function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

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
}

//---------------------------------------
//Socket function
//---------------------------------------
//Setup ZMQ socket
var zmq_socket = zeromq.createSocket('pull');
zmq_socket.connect("tcp://127.0.0.1:5001");

io.sockets.on('connection', function (socket) {
    socket.on('set_name', function (name) {
        socket.set('name', name, function () {
            socket.emit('ready');
        });
    });

    socket.on('msg', function () {
        socket.get('name', function (err, name) {
            console.log('Chat message by ', name);
        });
    });

    //----------------------------------------------------------------------------
    //ZeroMQ setup
    //----------------------------------------------------------------------------
    zmq_socket.on('message', function(data) {
        socket.send(data);
    });
});
