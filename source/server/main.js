/**
 * Ceramic - Main Server Startup
 */

 /*jshint node:true */

(function () {
  "use strict";

  var express = require('express');
  var bodyParser = require('body-parser');
  // TODO: compression
  // TODO: mongoose
  // TODO: cache (redis)
  // TODO: node-uuid

  // TODO: do not accept posts larger than ??? bytes

  var app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get('/status', function(req, res) {
    res.send({message: 'Ceramic v.0.1.0'});
    // TODO: get version + other info
  });

  // TODO: add methods here

  // TODO: supply content folder data

  // TODO: load config file, if nothing then load 'default.json'
  var port = process.argv[2] || 9050;

  app.listen(port);
  console.log('Started application on port: ' + port);
}());