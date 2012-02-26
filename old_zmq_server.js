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
