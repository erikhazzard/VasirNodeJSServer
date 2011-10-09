var zeromq = require("zeromq");

// pull = upstream = receive only
var socket = zeromq.createSocket('pull');
socket.connect("tcp://127.0.0.1:500");
console.log("connected!");

socket.on('message', function(data) {
  console.log("received data: " + data.toString('utf8'));
});
