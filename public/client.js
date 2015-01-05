/**
 * Client interface for 2-way communication
 * with CloudTV WebRemote
 * To use, you must edit your programs.xml, and
 * add this script to your 'scripts' attribute,
 * remember, if you need more than 1 script, just
 * separate them by spaces
 */

(function(){

    if(location.href === 'about:blank'){
        return;
    }

    //Not supported on i-frames
    if(window.location !== window.parent.location){
        return;
    }

    var host = '%HOST%',
        PORT = '%PORT%',
        isActive = false;

    //global
    __socket = null;
    s = null;//script tag

    //lifecycle functions
    var reopenSocket = function () {
        isActive = true;

        //restart if we have a socket and it's not in a connected state
        if(__socket !== null && __socket.disconnected && __socket.io.readyState !== 'opening'){
            //console.log('SOCKET - Reconnecting ' + location.href);
            __socket.connect();
            //create the socket if it wasn't created yet
        }else if(!__socket){
            startSocket();
        }
    }

    var closeSocket = function (evt) {
        isActive = false;
        s.onload = undefined;

        if(__socket){
            //console.log('SOCKET - Disconnecting ' + location.href);
            if(evt.type === 'close'){
                __socket.destroy();
            }else{
                __socket.disconnect();
            }

        }
    }

    //Keep Track of focus/blur so that we don't respond when we aren't the active window
    window.addEventListener('focus', reopenSocket);
    window.addEventListener('blur', closeSocket);
    window.addEventListener('close', closeSocket);

    var simulateKeyPress = function(keyCode, el){
        var eventObj = document.createEventObject ?
            document.createEventObject() : document.createEvent('Events');

        if(eventObj.initEvent){
            eventObj.initEvent('keydown', true, true);
        }

        eventObj.keyCode = keyCode;
        eventObj.which = keyCode;

        var target = el || document.activeElement;
        target.dispatchEvent ? target.dispatchEvent(eventObj) : target.fireEvent('onkeydown', eventObj);
    };

    var onMessage = window.__onMessage = function(message){
        //Only act on messages if we are the top window
        //console.log('SOCKET.onMessage', isActive, message, location.href);
        if(!isActive){
            return;
        }

        switch(message.type){

            case 'key':
                simulateKeyPress(message.keyCode);
                break;


            default:

                break;
        }
    };



    var loadSocketIo = function(){
        //console.log('SOCKET - loadSocketIo() ' + location.href);

        var CLIENTID = navigator.avClient ? navigator.avClient.id : 'shared';
        var socketScriptUrl = '%HOST%/socket.io/socket.io.js';

        console.log('SOCKET - load WebRemote: ' +  socketScriptUrl + ' on page ' + location.href);

        s = document.createElement('script');
        s.setAttribute('type','text/javascript')
        s.setAttribute('src', socketScriptUrl);
        s.onload = startSocket;
        document.getElementsByTagName('head')[0].appendChild(s);
    }

    var startSocket = function(){
        if(__socket){
            return;
        }

        if(typeof(io) === 'undefined'){
            setTimeout(startSocket, 30);
        }else{
            //global
            //console.log('SOCKET - Creating, ' + location.href);
            __socket = io('%HOST%?role=%ROLE%&clientid=' + (navigator.avClient ? navigator.avClient.id : 'shared'));
            __socket.on('message', window.__onMessage);
        }
    }

    if(document.readyState === 'complete'){
        loadSocketIo();
    }else{
        document.addEventListener('DOMContentLoaded', loadSocketIo);
    }

})()