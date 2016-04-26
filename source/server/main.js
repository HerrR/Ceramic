/**
 * Ceramic - Main Server Startup
 */

 /* jshint node:true */
 /* jshint esversion: 6 */

 /**
  * Environment Variables
  * =====================
  * SESSION_KEY = express sesstion
  * FACEBOOK_APP_ID = facebook app id
  * FACEBOOK_APP_SECRET = facebook secret id
  * DB_USERNAME = mongodb user
  * DB_PASSWORD = mongodb password
  */

(function () {
  "use strict";

  const os = require('os');
  const fs = require('fs');
  const path = require('path');
  const http = require('http');
  const https = require('https');
  const log4js = require('log4js');
  const express = require('express');
  const cluster = require('cluster');
  //const bcrypt = require('bcrypt');
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

  const PERSON_SCHEMA_VERSION = 1;

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
    return readJsonFileSync(config.server.datasets.folder + filename, defaultValue, doCrash);  // TODO: user path.joint(a,b)
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

  function sendEmail(recipient, subject, text, html) {
    var mailOptions = {
      from: config.server.email.from,
      to: recipient,
      subject: subject,
      text: text,
      html: html
    };

    emailTransporter.sendMail(mailOptions, function(error, info) {
      if (error){
        return logger.error(error);
      }

      logger.info('Message sent: ' + info.response);
    });
  }

  function hideSecretProfileData(profileData) {
    if (profileData) {
      //profileData.system = undefined;
      //profileData.userid = undefined;

      // TODO
    }

    return profileData;
  }

  function prepareToUpdateProfile(newProfileData, oldProfileData) {
    // TODO
    return newProfileData;
  }

  function validateProfile(profile) {
    // TODO: clamp texts like name etc..
    return profile;
  }

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.sendStatus(403);
    }
  }

  function verifyCredentials(username, password, done) {
    var user = null;
    var error = null; // new Error('message')
    
    // TODO: verify username/password, use node crypto.pbkdf2
    user = {userid:'test_user'};

    done(error, user);
  }

  function filterDataset(filter, dataset, compareFunc) {
    var filtered = [];
    var filterText = filter.toLowerCase();

    for (var key in dataset) {
      if (dataset.hasOwnProperty(key)) {
        var value = dataset[key];
        if (compareFunc(value.toLowerCase(),filterText)) {
          var jsonText = '{"' + key + '":"' + value + '"}';
          filtered.push(JSON.parse(jsonText));
        }
      }
    }

    return filtered;
  }

  var datasets = {
    translations: readDataset(config.server.datasets.translations,{},true),
    countries: readDataset(config.server.datasets.countries,{},true)
  };

  var datamodels = {
    person: undefined,
    company: undefined,
    admin: undefined,
    message: undefined,
    receipt: undefined
  };


  // Setup variables
  var emailTransporter = nodemailer.createTransport(config.server.email.transporter);
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

    datamodels.person = mongoose.model('Person', new mongoose.Schema({
      userid: String,
      updateVersion: mongoose.Schema.Types.Number,
      system: {
        created: Date,
        locked: Date,
        deleted: Date,
        updated: Date,
        note: String,
        visible: mongoose.Schema.Types.Boolean,
        schemaVersion: mongoose.Schema.Types.Number
      },
      settings: {
        recieveEmailNotifications: mongoose.Schema.Types.Boolean
      },
      person: {
        name: String,
        description: String,
        dateOfBirth: Date,
        searchable: mongoose.Schema.Types.Boolean,
        skills: [{
          type: String,
          level: mongoose.Schema.Types.Number
        }],
        experience: {
          company: String,
          industry: String,
          fromDate: Date,
          toDate: Date,
          responsibilities: [{
            type: String,
            amount: mongoose.Schema.Types.Number
          }]
        }
      }
    }));

    datamodels.company = mongoose.model('Company', new mongoose.Schema({
      userid: String,
      updateVersion: mongoose.Schema.Types.Number,
      system: {
        created: Date,
        locked: Date,
        deleted: Date,
        updated: Date,
        note: String,
        visible: mongoose.Schema.Types.Boolean,
        userType: String,
        schemaVersion: mongoose.Schema.Types.Number
      },
      company: {
        name: String,
        description: String,
        industry: String,
        searchCriteria: {
          skills: [{
            type: String,
            minLevel: mongoose.Schema.Types.Number
          }],
          responsibilities: [{
            type: String,
            minAmount: mongoose.Schema.Types.Number
          }]
        }
      }
    }));

    datamodels.admin = mongoose.model('Admin', new mongoose.Schema({
      userid: String,
      level: mongoose.Schema.Types.Number
    }));

    datamodels.message = mongoose.model('Message', new mongoose.Schema({
      fromUserid: String,
      toUserid: String,
      created: Date,
      wasRead: mongoose.Schema.Types.Boolean,
      wasRemoved: mongoose.Schema.Types.Boolean,
      wasReplied: mongoose.Schema.Types.Boolean,
      wasNotified: mongoose.Schema.Types.Boolean,
      wasReported: mongoose.Schema.Types.Boolean,
      subject: String,
      message: String
    }));

    datamodels.receipt = mongoose.model('Receipt', new mongoose.Schema({
      userid: String,
      paymentDate: Date,
      amount: mongoose.Schema.Types.Number,
      currency: String,
      method: String,
      purchase: String,
      transaction: String
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
  app.use(express.static(__dirname + config.server.staticFiles)); // TODO: user path.joint(a,b)
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

      var system = {
        created: new Date(),
        locked: undefined,
        deleted: undefined,
        updated: new Date(),
        note: '',
        visible: true,
        schemaVersion: PERSON_SCHEMA_VERSION
      };

      var settings = {
        recieveEmailNotifications: true
      };

      var person = {
        name: profile.displayName
      };

      var newPerson = new datamodels.person({userid:profile.id, person:person, system:system});
      newPerson.save(function(err) {
        if (err) {
          logger.error(err);
        } else {
          logger.info('New User: ' + person.name);
        }
      });

      done(null, profile);
    }));
  }

  if (config.authentication.google.enabled) {
    // TODO: configure passport
  }

  if (config.authentication.twitter.enabled) {
    // TODO: configure passport
  }

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(userid, done) {
    done(null, {id: userid});
  });

  if (config.authentication.local.enabled) {
    app.post('/auth/local/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/loginfailed' }));
  }

  if (config.authentication.local.enabled) {
    app.post('/auth/google/login', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/loginfailed' }));
  }

  if (config.authentication.facebook.enabled) {
    app.get('/auth/facebook/login', passport.authenticate('facebook', {scope:['email']}));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
      res.redirect('/');
    });
  }

  if (config.authentication.twitter.enabled) {
    app.post('/public/twitter/login', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/loginfailed' }));
  }

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

  watch(config.server.datasets.watch, function(filename) {
    logger.info('Watch triggered on file: ' + filename);

    if (filename.indexOf(config.server.datasets.translations) > -1) {
      logger.info('Reloading Translations');
      datasets.translations = readDataset(config.server.datasets.translations, datasets.translations, false);
    }

    if (filename.indexOf(config.server.datasets.countries) > -1) {
      logger.info('Reloading Countries');
      datasets.countries = readDataset(config.server.datasets.countries, datasets.countries, false);
    }

    // TODO: reload more datasets
  });

  app.get('/public/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  /*app.post('/public/user/register', function(req, res) {
    // TODO: register user
    // https://www.npmjs.com/package/bcrypt
  });

  app.get('/public/user/reset', function(req, res) {
    // TODO: email reset password
  });

  app.get('/public/user/update', function(req, res) {
    // TODO: update password, email
  });*/

  app.get('/public/translations/:locale', function(req, res) {
    res.json(datasets.translations[req.params.locale] || {});
  });

  app.get('/public/schools/:filter', function(req, res) {
    // TODO: fetch all schools that contain 'filter'
  });

  app.get('/public/skills/:filter', function(req, res) {
    // TODO: fetch all skills that contain 'filter'
  });

  app.get('/public/countries', function(req, res) {
    res.json(datasets.countries);
  });

  app.get('/public/countries/:filter', function(req, res) {
    res.json(filterDataset(req.params.filter, datasets.countries, function(value, filter) {
      return value.indexOf(filter) === 0;
    }));
  });

  app.get('/public/cities/:country/:filter', function(req, res) {
    // TODO: fetch all cities that contain 'filter' and are in 'country'
  });

  app.get('/private/person', ensureAuthenticated, function(req, res) {
    datamodels.person.findOne({userid:req.user.id}, function(err, data) {
      if (err !== null) {
        logger.warn(err);
        res.json({error: 'error.get_profile'});
      } else {
        res.json(hideSecretProfileData(data));
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
  process.on('exit', exitHandler.bind(null, {cleanup:true}));
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