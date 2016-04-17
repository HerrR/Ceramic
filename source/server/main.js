/**
 * Ceramic - Main Server Startup
 */

 /*jshint node:true */

(function () {
  "use strict";

  function readJsonFileSync(filepath, defaultValue, doCrash) {
    try {
      return JSON.parse(fs.readFileSync(filepath));
    } catch (err) {
      logger.error('Failed to load: ' + filepath);
      if (doCrash) {
        throw err;
      }
    }
    return defaultValue;
  }

  function exitHandler(options, err) {
    if (options.cleanup) {
      console.log(chalk.blue('Shutting Down...'));
    }

    if (err) {
      console.log(chalk.red(err.stack));
      logger.error(err.stack);
    }

    if (options.exit) {
      process.exit();
    }
  }

  function hideSecretProfileData(profileData) {
    profileData.system.note = '';

    if (profileData.system.person) {
      profileData.company = undefined;
    } else {
      profileData.person = undefined;
    }

    return profileData;
  }

  function createNewProfile(userid) {
    // TODO: return default values object
    return {};
  }

  const config = require(process.argv[2] || '../../config/dev.json');
  
  const fs = require('fs');
  const http = require('http');
  const https = require('https');
  const log4js = require('log4js');
  const express = require('express');
  const bodyParser = require('body-parser');
  const passport = require('passport');
  const compression = require('compression');
  const mongoose = require('mongoose');
  const uuid = require('node-uuid');
  const watch = require('node-watch');
  const chalk = require('chalk');
  const ddos = require("ddos-express");
  const queryParser = require('query-string-parser');
  // TODO: node-cache

  var datasets = {
    translations: readJsonFileSync(config.server.datasets.folder + config.server.datasets.translations,{},true)
  };

  var datamodels = {
    profile: undefined
  };


  // Setup variables
  var app = express();
  var logger = log4js.getLogger('base');
  var database = mongoose.connection;

  
  // Setup Logger
  log4js.configure(config.log4js.config);
  logger.setLevel(config.log4js.level);


  // Setup Database
  database.on('error', logger.error);
  database.once('open', function() {
    logger.info('Connected to MongoDB');

    datamodels.profile = mongoose.model('Profile', new mongoose.Schema({
      userid: String,
      system: {
        created: Date,
        locked: Date,
        deleted: Date,
        updated: Date,
        note: String,
        visible: mongoose.Schema.Types.Boolean,
        person: mongoose.Schema.Types.Boolean
      },
      person: {
        name: String,
        dateOfBirth: Date
      },
      company: {
        name: String
      }
    }));


  });


  // Setup Express
  // TODO: SSL
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({limit: config.server.dataSizeLimit}));
  app.use(compression());
  app.use(express.static(__dirname + config.server.staticFiles));
  app.use(ddos({
    // TODO: Configuration options
  }));


  watch(config.server.datasets.watch, function(filename) {
    logger.info('Watch triggered on file: ' + filename);

    if (filename.indexOf(config.server.datasets.translations) > -1) {
      logger.info('Reloading Translations');
      datasets.translations = readJsonFileSync(config.server.datasets.folder + config.server.datasets.translations, datasets.translations, false);
    }
  });

  // TODO: app.post('/rest/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

  app.get('/rest/translations/:locale', function(req, res) {
    res.send(datasets.translations[req.params.locale]);
  });

  app.get('/rest/status', function(req, res) {
    res.send({
      // TODO: get version + other info
    });
  });

  app.get('/rest/profile/:userid', function(req, res) {
    // TODO: check if the userid is valid

    datamodels.profile.findOne({userid:req.params.userid}, function(err, profileData) {
      if (err !== null) {
        logger.warn(err);
        res.send({error: 'error.get_profile'});
      } else if (profileData === null) {
        var newProfile = new datamodels.profile(createNewProfile(req.params.userid));
        // TODO: save
        res.send(newProfile);
      } else {
        res.send(hideSecretProfileData(profileData));
      }
    });
  });

  app.post('/rest/profile/:userid', function(req, res) {
    // TODO: check if the userid is valid

    res.send({
      // TODO: save/update profile to database
    });
  });

  process.stdin.resume();
  process.on('exit', exitHandler.bind(null,{cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

  logger.info('Starting directory: ' + __dirname);
  logger.info('Serving static files: ' + config.server.staticFiles);
  logger.info('Started application on port: ' + config.server.port);

  try {
    mongoose.connect(config.server.database.url);
  } catch (err) {
    logger.error('Failed to connect to database: ' + config.server.database.url);
    throw err;
  }

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