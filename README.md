remote-proxy
============

Remote Control proxy for CloudTV

## Install via git

    cd /var/www/html
    git clone https://github.com/active-video/remote-proxy.git
    cd cloudtv-remote-proxy
    npm install

### Run as a service

    cd /var/www/html/cloudtv-remote-proxy/
    nohup node index.js -p 9083 &
    
    
## Install via npm
    
    
    cd /var/www/html
    mkdir cloudtv-remote-proxy
    cd cloudtv-remote-proxy
    npm install cloudtv-remote-proxy
    

### Run as a service

    cd /var/www/html/cloudtv-remote-proxy/node_modules/cloudtv-remote-proxy
    nohup node index.js -p 9083 &

## Options

-  p: Port to use, default is 80


## Include in your app

```<script src="http://ip-address:port/socket.io/socket.io.js"></script>```
