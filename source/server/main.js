/**
 * Ceramic - Main Server Startup
 */

 /* jshint node:true */
 /* jshint esversion: 6 */

(function () {
  "use strict";

  const os = require('os');
  const fs = require('fs');
  const http = require('http');
  const https = require('https');
  const log4js = require('log4js');
  const express = require('express');
  const cluster = require('cluster');
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');
  const expressSession = require('express-session');
  const compression = require('compression');
  const mongoose = require('mongoose');
  const uuid = require('node-uuid');
  const watch = require('node-watch');
  const chalk = require('chalk');
  const ddos = require("ddos-express");
  const passport = require('passport');
  const passportHttp = require('passport-http');
  const passportLocal = require('passport-local');
  const passportGoogle = require('passport-google');
  const passportFacebook = require('passport-facebook');
  const passportTwitter = require('passport-twitter');
  const nodemailer = require('nodemailer');

  const config = require(process.argv[2] || '../../config/dev.json');
  const numCPUs = os.cpus().length;
  const numClusters = config.server.clusters === 0 ? numCPUs : config.server.clusters;

  const CONSTANTS = {
    USER_TYPES: {
      COMPANY: 'COMPANY',
      PERSON: 'PERSON'
    }
  };

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

  function readDataset(filename, defaultValue, doCrash) {
    return readJsonFileSync(config.server.datasets.folder + filename, defaultValue, doCrash);
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

  function prepareToUpdateProfile(newProfileData, oldProfileData) {
    // TODO
    return newProfileData;
  }

  function createNewProfile(userid, isPerson) {
    // TODO: return default values object
    return {};
  }

  function validateProfile(profile) {
    // TODO: clamp texts like name etc..
    return profile;
  }

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.send(403);
    }
  }

  function verifyCredentials(username, password, done) {
    var user = null;
    var error = null; // new Error('message')
    
    // TODO: verify username/password, use node crypto.pbkdf2
    user = {userid:'test_user'};

    done(error, user);
  }

  var datasets = {
    translations: readDataset(config.server.datasets.translations,{},true)
  };

  var datamodels = {
    profile: undefined
  };


  // Setup variables
  var app = express();
  var logger = log4js.getLogger('base');
  var database = mongoose.connection;
  var server = https.createServer({
    cert: fs.readFileSync(config.server.https.cert),
    key: fs.readFileSync(config.server.https.key)
  }, app);

  
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
        userType: String,
        schemaVersion: mongoose.Schema.Types.Number,
        updateVersion: mongoose.Schema.Types.Number
      },
      person: {
        name: String,
        dateOfBirth: Date,
        searchable: mongoose.Schema.Types.Boolean
      },
      company: {
        name: String
      }
    }));
  });


  // Setup Express
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({limit: config.server.dataSizeLimit}));
  app.use(cookieParser());
  app.use(expressSession({
    secret: process.env.SESSION_KEY || config.server.sessionSecretKey,
    resave: false,
    saveUninitialized: false
  }));
  app.use('/api', passport.authenticate('basic', {session: false}));
  app.use(compression());
  app.use(express.static(__dirname + config.server.staticFiles));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(ddos({
    // TODO: Configuration options
  }));


  if (config.authentication.local.enabled) {
    passport.use(new passportLocal.Strategy(verifyCredentials));
  }

  if (config.authentication.http.enabled) {
    passport.use(new passportHttp.BasicStrategy(verifyCredentials));
  }

  if (config.authentication.facebook.enabled) {
    passport.use(new passportFacebook.Strategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: config.authentication.facebook.callbackURL
    }, function(accessToken, refreshToken, profile, done) {
      // TODO: use profile properties: provider, id, displayName, name, emails, etc..
    }));
  }

  if (config.authentication.google.enabled) {
    // TODO: configure passport
  }

  if (config.authentication.twitter.enabled) {
    // TODO: configure passport
  }

  passport.serializeUser(function(user, done) {
    done(null, user.userid);
  });

  passport.deserializeUser(function(userid, done) {
    done(null, {userid: userid});
  });


  watch(config.server.datasets.watch, function(filename) {
    logger.info('Watch triggered on file: ' + filename);

    if (filename.indexOf(config.server.datasets.translations) > -1) {
      logger.info('Reloading Translations');
      datasets.translations = readDataset(config.server.datasets.translations, datasets.translations, false);
    }

    // TODO: reload more datasets
  });

  if (config.authentication.local.enabled) {
    app.post('/public/login/local', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/loginfailed' }));
  }

  if (config.authentication.local.enabled) {
    app.post('/public/login/google', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/loginfailed' }));
  }

  // TODO: add more passport strategies

  app.get('/public/loginstrategies', function(req, res) {
    var list = [];

    if (config.authentication.local.enabled) {
      list.push('local');
    }

    if (config.authentication.http.enabled) {
      list.push('http');
    }

    if (config.authentication.facebook.enabled) {
      list.push('facebook');
    }

    if (config.authentication.google.enabled) {
      list.push('google');
    }

    if (config.authentication.twitter.enabled) {
      list.push('twitter');
    }

    res.json(list);
  });

  app.get('/public/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/public/translations/:locale', function(req, res) {
    res.json(datasets.translations[req.params.locale]);
  });

  // TODO: app.get more datasets

  app.get('/public/status', function(req, res) {
    res.json({
      // TODO: get version + other info
    });
  });

  app.get('/private/profile', ensureAuthenticated, function(req, res) {
    // TODO: userid (req.user)

    datamodels.profile.findOne({userid:req.params.userid}, function(err, profileData) {
      if (err !== null) {
        logger.warn(err);
        res.json({error: 'error.get_profile'});
      } else if (profileData === null) {
        var isPerson = true; // TODO: determine if this is a person or company
        var newProfile = new datamodels.profile(createNewProfile(req.params.userid, isPerson));
        // TODO: save into db
        res.json(hideSecretProfileData(newProfile));
      } else {
        res.json(hideSecretProfileData(profileData));
      }
    });
  });

  app.post('/private/profile', ensureAuthenticated, function(req, res) {
    // TODO: userid (req.user)
    // TODO: fetch hidden information and update visible information

    res.json({
      // TODO: save/update profile to database
    });
  });

  process.stdin.resume();
  process.on('exit', exitHandler.bind(null,{cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

  logger.info('Number of clusters: ' + numClusters);
  logger.info('Starting directory: ' + __dirname);
  logger.info('Serving static files: ' + config.server.staticFiles);

  try {
    var dbUser = process.env.DB_USERNAME || config.server.database.username;
    var dbPass = process.env.DB_PASSWORD || config.server.database.password;
    var dbUrl = config.server.database.url;
    dbUrl = dbUrl.replace('{username}',dbUser).replace('{passwrd}',dbPass);
    mongoose.connect(dbUrl);
  } catch (err) {
    logger.error('Failed to connect to database: ' + config.server.database.url);
    throw err;
  }

  server.listen(config.server.port, function() {
    logger.info('Started application on port: ' + config.server.port);
  });
}());