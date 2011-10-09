var zeromq = require("zeromq");

// pull = upstream = receive only
var pull_socket = zeromq.createSocket('pull');
pull_socket.connect("tcp://127.0.0.1:5000");
console.log("connected!");

pull_socket.on('message', function(data) {
  console.log("received data: " + data.toString('utf8'));
});

// push = downsteam = send only
var socket = zeromq.createSocket('push');
socket.bind("tcp://127.0.0.1:1234", function(err) {
    if (err) throw err;
    console.log("bound!");
    setInterval(function() {
        socket.send(
            new Date().toString());
    }, 500);
});
