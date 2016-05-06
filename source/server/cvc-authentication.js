/**
 * Authentication
 *
 * @author Lukas Heise
 */

 /* jshint node:true */
 /* jshint esversion: 6 */
 /* jshint esnext: true */

(function () {
  "use strict";

    const cookieParser = require('cookie-parser');
    const expressSession = require('express-session');
    const passport = require('passport');
    const passportHttp = require('passport-http');
    const passportLocal = require('passport-local');
    const passportGoogle = require('passport-google');
    const passportFacebook = require('passport-facebook');
    const passportTwitter = require('passport-twitter');

    var config;
    var logger;

    var cvcDatabase;

    function verifyCredentials(username, password, done) {
        var user = null;
        var error = null; // new Error('message')

        // TODO: verify username/password, use node crypto.pbkdf2
        user = {userid:'test_user'};

        done(error, user);
    }

    function initLocalAuthentication() {
        if (config.authentication.local.enabled) {
            logger.info('Init Local Authentication');
            passport.use(new passportLocal.Strategy(verifyCredentials));
        }
    }

    function initHttpAuthentication() {
        if (config.authentication.http.enabled) {
            logger.info('Init Http Authentication');
            passport.use(new passportHttp.BasicStrategy(verifyCredentials));
        }
    }

    function initGoogleAuthentication() {
        if (config.authentication.google.enabled) {
            logger.info('Init Google Authentication');
            // TODO: configure passport
        }
    }

    function initTwitterAuthentication() {
        if (config.authentication.twitter.enabled) {
            logger.info('Init Twitter Authentication');
            // TODO: configure passport
        }
    }

    function initFacebookAuthentication() {
        if (config.authentication.facebook.enabled) {
            logger.info('Init Facebook Authentication');

            passport.use(new passportFacebook.Strategy({
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: config.authentication.facebook.callbackURL
            }, function(accessToken, refreshToken, profile, done) {
                // TODO: use profile properties: provider, id, displayName, name, emails, etc..

                // TODO: check if user email is already registered, if yes then deny registration
                // $or:[{userid:profile.id}, {email:profile.email}]

                cvcDatabase.getDatamodels().Person.findOne({userid:profile.id}, function(err, savedProfile) {
                    if (err !== null) {
                        logger.warn(err);
                        done(err, profile);
                    } else if (savedProfile === null) {
                        var system = cvcDatabase.createSystemObject(config.authentication.facebook.name);

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
    }

    function initPassportAuthentications() {
        initLocalAuthentication();
        initHttpAuthentication();
        initFacebookAuthentication();
        initGoogleAuthentication();
        initTwitterAuthentication();
    }

    function initApp(app) {
        app.use(cookieParser());
        app.use(expressSession({
            secret: process.env.SESSION_KEY || config.server.sessionSecretKey,
            resave: false,
            saveUninitialized: false
        }));

        app.use('/api', passport.authenticate('basic', {session: false}));
        app.use(passport.initialize());
        app.use(passport.session());

        if (config.authentication.local.enabled) {
            app.post('/auth/local/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/loginfailed' }));
        }

        // TODO: http

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

        app.get('/auth/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    }

    function initPassport() {
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(userid, done) {
            done(null, {id: userid});
        });
    }

    module.exports = {
        init: function(_config, _logger, _app, _cvcDatabase) {
            config = _config;
            logger = _logger;
            cvcDatabase = _cvcDatabase;

            initApp(_app);
            initPassport();
            initPassportAuthentications();
        },

        listEnabledStrategies: function() {
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

            return list;
        },

        ensureAuthenticated: function(req, res, next) {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.sendStatus(403);
            }
        }

    };
})();