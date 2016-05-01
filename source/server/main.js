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
  const uuid = require('node-uuid');
  const chalk = require('chalk');
  const ddos = require("ddos-express");
  const passport = require('passport');
  const passportHttp = require('passport-http');
  const passportLocal = require('passport-local');
  const passportGoogle = require('passport-google');
  const passportFacebook = require('passport-facebook');
  const passportTwitter = require('passport-twitter');

  const cvcUtils = require('./cvc-utils');
  const cvcDataset = require('./cvc-dataset');
  const cvcDatabase = require('./cvc-database');
  const cvcAuthentication = require('./cvc-authentication');
  const cvcEndpoint = require('./cvc-endpoint');


  const config = require(process.argv[2] || '../../config/dev.json');
  const numCPUs = os.cpus().length;
  const numClusters = config.server.clusters === 0 ? numCPUs : config.server.clusters;

  function exitHandler(options, err) {
    if (options.cleanup) {
      // TODO: cleanup
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

  function verifyCredentials(username, password, done) {
    var user = null;
    var error = null; // new Error('message')
    
    // TODO: verify username/password, use node crypto.pbkdf2
    user = {userid:'test_user'};

    done(error, user);
  }

  // Setup variables
  var app = express();
  var logger = log4js.getLogger('base');
  var server = https.createServer({
    cert: fs.readFileSync(config.server.https.cert),
    key: fs.readFileSync(config.server.https.key)
  }, app);

  
  // Setup Logger
  log4js.configure(config.log4js.config);
  logger.setLevel(config.log4js.level);


  cvcUtils.init(config, logger);
  cvcDataset.init(config, logger);
  cvcDatabase.init(config, logger);
  cvcAuthentication.init(config, logger);
  cvcEndpoint.init(config, logger);


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

      cvcDatabase.getDatamodels().Person.findOne({userid:profile.id}, function(err, savedProfile) {
        if (err !== null) {
          logger.warn(err);
          done(err, profile);
        } else if (savedProfile === null) {
          var system = cvcDatabase.createSystemObject();

          var settings = {
            recieveEmailNotifications: true
          };

          var person = {
            name: profile.displayName
            // TODO: fill in more information
          };
          var newPerson = new cvcDatabase.getDatamodels().Person({userid:profile.id, person:person, system:system});
          newPerson.save(function(err) {
            if (err) {
              logger.error(err);
              done(err, profile);
            } else {
              logger.info('New Person: ' + person.name);
              done(null, profile);
            }
          });
        } else {
          done(null, profile);
        }
      });
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
    res.json(cvcAuthentication.listEnabledMethods());
  });

  app.get('/auth/logout', function(req, res) {
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
    res.json(cvcDataset.getDatasets().translations[req.params.locale] || {});
  });

  app.get('/public/schools/:filter', function(req, res) {
    // TODO: fetch all schools that contain 'filter'
  });

  app.get('/public/skills/:filter', function(req, res) {
    // TODO: fetch all skills that contain 'filter'
  });

  app.get('/public/countries', function(req, res) {
    res.json(cvcDataset.getDatasets().countries);
  });

  app.get('/public/countries/:filter', function(req, res) {
    res.json(cvcDataset.filterDataset(req.params.filter, cvcDataset.getDatasets().countries, function(value, filter) {
      return value.indexOf(filter) === 0;
    }));
  });

  app.get('/public/cities/:country/:filter', function(req, res) {
    // TODO: fetch all cities that contain 'filter' and are in 'country'
  });

  app.get('/private/person', cvcAuthentication.ensureAuthenticated, function(req, res) {
    cvcDatabase.getDatamodels().Person.findOne({userid:req.user.id}, function(err, savedProfile) {
      if (err !== null) {
        logger.error(err);
        res.sendStatus(404);
      } else if (savedProfile === null) {
        logger.error('No data for person: ' + req.user.id);
        res.sendStatus(400);
      } else {
        logger.debug('Fetched Person: ' + savedProfile.person.name);
        cvcDatabase.hideSecretProfileData(savedProfile);
        res.json(savedProfile);
      }
    });
  });

  app.post('/private/person', cvcAuthentication.ensureAuthenticated, function(req, res) {
    var newProfile = req.body;
    cvcDatabase.getDatamodels().Person.findOne({userid:req.user.id}, function(err, savedProfile) {
      if (err !== null) {
        logger.warn(err);
        res.sendStatus(400);
      } else {
        // TODO: validate that the fetched data has person data and not company

        cvcDatabase.mergeProfileData(savedProfile, newProfile);
        savedProfile.save(function(err) {
          if (err !== null) {
            logger.warn('Failed to update profile: ' + req.user.id + ", error: " + err);
            res.sendStatus(400);
          } else {
            logger.info('Updated profile: ' + req.user.id);
            res.sendStatus(200);
          }
        });
      }
    });
  });

  process.stdin.resume();
  process.on('exit', exitHandler.bind(null, {cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

  logger.info('Number of clusters: ' + numClusters);
  logger.info('Starting directory: ' + __dirname);
  logger.info('Serving static files: ' + config.server.staticFiles);

  server.listen(config.server.port, function() {
    logger.info('Started application on port: ' + config.server.port);
  });
}());