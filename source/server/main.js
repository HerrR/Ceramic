/**
 * Ceramic - Main Server Startup
 */

 /*jshint node:true */

(function () {
  "use strict";

  function readJsonFileSync(filepath) {
    return JSON.parse(fs.readFileSync(filepath));
  }

  function exitHandler(options, err) {
    if (options.cleanup) {
      console.log('Shutting Down...');
    }

    if (err) {
      console.log(err.stack);
      logger.error(err.stack);
    }

    if (options.exit) {
      process.exit();
    }
  }

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
    translations: readJsonFileSync(config.server.datasets.folder + config.server.datasets.translations)
  };

  // TODO: node-cache, query-string-parser


  log4js.configure(config.log4js.config);


  // Setup variables
  var app = express();
  var logger = log4js.getLogger('base');
  var database = mongoose.connection;

  
  // Setup Logger
  logger.setLevel(config.log4js.level);


  // Setup Database
  database.on('error', logger.error);
  database.once('open', function() {
    logger.info('Connected to MongoDB');

    // TODO: var Cat = mongoose.model('Cat', { name: String });
  });


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
    // TODO: try catch errors here
    if (filename.indexOf(config.server.datasets.translations) > -1) {
      logger.info('Reloading Translations');
      datasets.translations = readJsonFileSync(config.server.datasets.folder + config.server.datasets.translations);
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

  process.stdin.resume();
  process.on('exit', exitHandler.bind(null,{cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

  logger.info('Starting directory: ' + __dirname);
  logger.info('Serving static files: ' + config.server.static_files);
  logger.info('Started application on port: ' + config.server.port);

  mongoose.connect(config.server.database.url);
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