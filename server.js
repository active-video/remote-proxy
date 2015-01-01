"use strict";

var args    = require('optimist').argv,
    port    = isNaN(parseInt(args.p, 10)) ? 80 : args.p,
    contentPort = port+ 1,
    url     = require('url'),
    content = require('serve-static');


console.log("Starting Remote Proxy", args);

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {
    var request = url.parse(socket.client.request.url, true),
        clientid = request.query.clientid,
        role = request.query.role || 'app',
        roomId = clientid + '-' + role;

    socket.join(roomId);

    setInterval(function(){
        io.to(clientid + '-app').emit('message', 'Hello to app: ' + clientid + ", " + (new Date()));
        io.to(clientid + '-remote').emit('message', 'Hello to remote: ' + clientid + ", " + (new Date()));
    }, 1000)
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});