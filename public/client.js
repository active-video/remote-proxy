//Client.js for apps

(function(){

    //Not supported on i-frames
    if(window.location !== window.parent.location){
        return;
    }

    var host = '%HOST%';
    var PORT = '%PORT%';

    var isActive = true;

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

    var CLIENTID = navigator.avClient ? navigator.avClient.id : 'shared';
    document.write('<scr' + 'ipt src="%HOST%/socket.io/socket.io.js"></scr' + 'ipt>');
    document.write('<scr' +'ipt> var __socket = io("%HOST%?role=%ROLE%&clientid=" + (navigator.avClient ? navigator.avClient.id : "shared")); __socket.on("message", window.__onMessage);</scr' + 'ipt>');



})()