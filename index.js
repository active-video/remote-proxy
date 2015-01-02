/**
 * Simply ensures that server.js runs forever
 */

"use strict";

var forever    = require('forever-monitor'),
    args       = require('optimist').argv,
    script     = 'server.js',
    tries      = 10,
    scriptArgs = [],
    prop,
    argString;

if(args){
    for(prop in args){
        if(prop.match(/^[a-z0-9]*$/i)){
            argString = '-' + prop;
            if(args[prop] !== true){
                argString += ' ' + args[prop];
            }
            scriptArgs.push(argString);
        }
    }
}

console.log('index.js - starting up ' + script);

var child = new (forever.Monitor)(script, {
    max: tries,//10 retries
    silent: false,
    args: scriptArgs
});

child.on('exit', function () {
    console.log(script + ' has exited after ' + tries + ' restarts');
});

child.start();