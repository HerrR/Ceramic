/**
 * Ceramic - Main Server Startup
 */

 /*jshint node:true */

(function () {
  "use strict";

  var config = require(process.argv[2] || '../../config/dev.json');
  var log4js = require('log4js');
  var express = require('express');
  var bodyParser = require('body-parser');
  // TODO: compression
  // TODO: mongoose
  // TODO: cache (redis)
  // TODO: node-uuid

  // TODO: do not accept posts larger than ??? bytes
  // TODO: setup logger
  var logger = log4js.getLogger('base');
  logger.setLevel('INFO'); // TODO: fetch level from config

  var app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  logger.info('Serving static files: ' + config.server.static_files);
  app.use(express.static(__dirname + config.server.static_files));

  app.get('/rest/status', function(req, res) {
    res.send({message: 'Ceramic v.0.1.1'});
    // TODO: get version + other info
  });

  // TODO: add methods here

  // TODO: supply content folder data

  // TODO: load config file, if nothing then load 'default.json'

  app.listen(config.server.port);
  logger.info('Started application on port: ' + config.server.port);
  logger.info('Starting directory: ' + __dirname);
}());

/*
  // HTTPS

  var fs = require('fs');
  var http = require('http');
  var https = require('https');
  var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
  var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

  var credentials = {key: privateKey, cert: certificate};
  var express = require('express');
  var app = express();

  // your express configuration here

  var httpServer = http.createServer(app);
  var httpsServer = https.createServer(credentials, app);

  httpServer.listen(80);
  httpsServer.listen(443);
*/