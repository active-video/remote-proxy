#!/bin/bash

#Make sure this is executable, or chmod 777

cd /var/www/html/cloudtv-remote-proxy/node_modules/cloudtv-remote-proxy;
nohup node index.js -p 9083 &