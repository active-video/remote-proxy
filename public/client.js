/**
 * Client interface for 2-way communication
 * with CloudTV WebRemote
 * To use, you must edit your programs.xml, and
 * add this script to your "scripts" attribute,
 * remember, if you need more than 1 script, just
 * separate them by spaces
 */

(function(){

    //Not supported on i-frames
    if(window.location !== window.parent.location){
        return;
    }

    var host = '%HOST%',
        PORT = '%PORT%',
        isActive = true;

    //Keep Track of focus/blur so that we don't respond when we aren't the active window
    window.addEventListener('focus', function () {
        isActive = true;
    });

    window.addEventListener('blur', function () {
        isActive = false;
    });

    var simulateKeyPress = function(keyCode, el){
        var eventObj = document.createEventObject ?
            document.createEventObject() : document.createEvent("Events");

        if(eventObj.initEvent){
            eventObj.initEvent("keydown", true, true);
        }

        eventObj.keyCode = keyCode;
        eventObj.which = keyCode;

        var target = el || document.activeElement;
        target.dispatchEvent ? target.dispatchEvent(eventObj) : target.fireEvent("onkeydown", eventObj);
    };

    var onMessage = window.__onMessage = function(message){
        //Only act on messages if we are the top window
        console.log("socket.onMessage", isActive, message);
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
        console.log('SOCKET - loadSocketIo()');

        var CLIENTID = navigator.avClient ? navigator.avClient.id : 'shared';
        var socketScriptUrl = '%HOST%/socket.io/socket.io.js';

        console.log("SOCKET - loading: ", socketScriptUrl);

        var s = document.createElement('script');
        s.setAttribute("type","text/javascript")
        s.setAttribute('src', socketScriptUrl);
        s.onload = startSocket;
        document.getElementsByTagName("head")[0].appendChild(s);
    }

    var startSocket = function(){
        console.log("SOCKET - startSocket()")
        if(typeof(io) === 'undefined'){
            setTimeout(startSocket, 30);
            console.log("io=" + typeof(io));
        }else{
            //global
            console.log("SOCKET - Creating");
            __socket = io("%HOST%?role=%ROLE%&clientid=" + (navigator.avClient ? navigator.avClient.id : "shared"));
            __socket.on("message", window.__onMessage);
        }
    }

    document.addEventListener('DOMContentLoaded', loadSocketIo);
})()