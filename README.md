remote-proxy
============

Remote Control proxy for CloudTV

## Run as a service

    cd /var/www/html/cloudtv-remote-proxy/node_modules/cloudtv-remote-proxy;
    nohup node index.js -p 9083 &

## Options

-  p: Port to use, default is 80


## Include in your app

```<script src="http://ip-address:port/socket.io/socket.io.js"></script>```
