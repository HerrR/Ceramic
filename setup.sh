#!/bin/sh
mkdir -p ./temp/database/
openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out local.crt -keyout local.key
npm install
cp mongo-express.js ./node_modules/mongo-express/config.js
gulp developer
