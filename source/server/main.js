/**
 * Ceramic - Main Server Startup
 */

 /*jshint node:true */

(function () {
  "use strict";

  var fs = require('fs');
  var http = require('http');
  var https = require('https');
  var config = require(process.argv[2] || '../../config/dev.json');
  var log4js = require('log4js');
  var express = require('express');
  var bodyParser = require('body-parser');
  var passport = require('passport');
  var compression = require('compression');
  var mongoose = require('mongoose');
  var uuid = require('node-uuid');
  var watch = require('node-watch');
  var datasets = {
    translations: require(config.server.datasets.folder + config.server.datasets.translations)
  };


  log4js.configure(config.log4js.config);


  // Setup variables
  var app = express();
  var logger = log4js.getLogger('base');

  
  // Setup Logger
  logger.setLevel(config.log4js.level);


  // Connect to database
  // TODO: mongoose.connect('mongodb://localhost/test');
  // TODO: var Cat = mongoose.model('Cat', { name: String });


  // Setup Express
  // TODO: do not accept posts larger than ??? bytes
  // TODO: SSL
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(compression());
  app.use(express.static(__dirname + config.server.static_files));


  // Setup watch
  watch(config.server.datasets.watch, function(filename) {
    logger.info('Watch triggered on file: ' + filename);
    if (filename.indexOf(config.server.datasets.translations) > -1) {
      logger.info('Reloading Translations');
      datasets.translations = require(config.server.datasets.folder + config.server.datasets.translations);
    }
  });


  //app.post('/rest/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

  app.get('/rest/translations/:locale', function(req, res) {
    res.send(datasets.translations[req.params.locale]);
  });

  app.get('/rest/status', function(req, res) {
    res.send({
      // TODO: get version + other info
    });
  });

  app.get('/rest/profile/:userid', function(req, res) {
    res.send({
      // TODO: get profile from database
    });
  });

  app.post('/rest/profile/:userid', function(req, res) {
    res.send({
      // TODO: save/update profile to database
    });
  });


  logger.info('Starting directory: ' + __dirname);
  logger.info('Serving static files: ' + config.server.static_files);
  logger.info('Started application on port: ' + config.server.port);
  app.listen(config.server.port);
}());

/*
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