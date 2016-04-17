#!/bin/sh
mkdir -p ./temp/database/
npm install
cp mongo-express.js ./node_modules/mongo-express/config.js
gulp developer