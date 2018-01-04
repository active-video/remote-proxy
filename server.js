'use strict';

var args    = require('optimist').argv,
    port    = isNaN(parseInt(args.p, 10)) ? 80 : args.p,
    contentPort = port+ 1,
    url     = require('url'),
    util    = require('util'),
    fs      = require('fs'),
    KEYS    = require('./public/keycodes.json');

console.log('Starting Remote Proxy', args);

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    'transports': ["polling"],
    'polling duration': 10
});
var middleware = require('socketio-wildcard')();

io.use(middleware);

io.on('connection', function (socket) {
    var request = url.parse(socket.client.request.url, true),
        clientid = request.query.clientid,
        role = request.query.role || 'app',
        roleOther = role === 'app' ? 'remote' : 'app',
        roomId = clientid + '-' + role,
        roomIdOther = clientid + '-' + roleOther;

    socket.join(roomId);

    console.log("connection: clientid=%s, role=%s, roomId=%s, roomIdOther=%s", clientid, role, roomId, roomIdOther);

    //on messages, broadcast them in the other direction
    socket.on('message', function(data){
        console.log("Sending from ", clientid, " to ", roomIdOther, data);
        socket.broadcast.to(roomIdOther).emit('message', data);
    });

    //Test
    /*setInterval(function(){
        io.to(clientid + '-app').emit('message', {
            type: 'key',
            keyCode: 39
        });
        io.to(clientid + '-remote').emit('message', 'Hello to remote: ' + clientid + ', ' + (new Date()));
    }, 5000)
    */
});


/******* HTTP INTERFACES *****/

/**
 * KEY - send keycodes to an app
 */
app.all('/key', function (req, res) {

    //http://10.230.104.2:16666/key?clientid=Roku-3100X_13C2A0061398&key=ok&rand=1420087837241-5144
    var keyCode = req.query.keyCode
    var key = req.query.key;
    var clientid = req.query.clientid;
    var roomId = clientid + '-app';

    //Handle bad request
    if(!clientid){
        res.writeHeader('400');
        res.end('Bad request, missing query param clientid');
        return;
    }

    var message = { type: 'key' };
    if (key) {
        message.keyCode = KEYS[key];
    } else if (keyCode) {
        message.keyCode = keyCode
    }

    //console.log('Sending to ' + roomId, message);
    console.log('Sending message to ' + roomId, message);
    io.to(roomId).emit('message', message);

    res.writeHeader(200);
    res.end('Sent to ' + roomId + JSON.stringify(message));
});


//Start Listening
http.listen(port, function () {
    console.log('listening on *:' + port);
});






















// **************** STATIC ROUTES ******************** //


//Serve up the client script, but inject host/port/etc
app.get('/client', function (req, res) {
    var headers = util._extend({}, req.headers || {}),
        host = req.headers.host;


    fs.readFile(__dirname+'/public/client.js', 'utf-8', function (err, data) {
        if (err){
            res.sendFile(__dirname+'/public/client.js');
            return;
        };


        var d = data;
        data = data.replace(/\%HOST\%/g, 'http://' + host)
            .replace(/\%PORT\%/g, port)
            .replace(/\%ROLE\%/g, 'app');

        res.writeHeader('200', {
            'content-type' : 'application/javascript',
            'cache-control': 'max-age=1'
        });
        res.end(data);
    });
});

//Serve up the client script, but inject host/port/etc
app.get('/remote', function (req, res) {
    var headers = util._extend({}, req.headers || {}),
        host = process.env.HOSTNAME || req.headers.host;


    fs.readFile(__dirname+'/public/client.js', 'utf-8', function (err, data) {
        if (err){
            res.sendFile(__dirname+'/public/client.js');
            return;
        };


        var d = data;
        data = data.replace(/\%HOST\%/g, 'http://' + host)
            .replace(/\%PORT\%/g, port)
            .replace(/\%ROLE\%/g, 'remote');

        res.writeHeader('200', {
            'content-type' : 'application/javascript'
        });
        res.end(data);
    });
});

module.exports = app;
