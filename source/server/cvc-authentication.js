/* jshint node:true */
/* jshint esversion: 6 */

/**
 * @module {Ceramic}
 * @parent main
 *
 * Authentication
 *
 * @author Lukas Heise
 */

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const passportHttp = require('passport-http');
const passportLocal = require('passport-local');
const passportGoogle = require('passport-google');
const passportFacebook = require('passport-facebook');
const passportTwitter = require('passport-twitter');
const passportLinkedIn = require('passport-linkedin');

(function () {
    "use strict";

    var config;
    var logger;

    var cvcDatabase;

    function getEmailFromFacebookProfile(profile) {
        var email = '';
        if (!profile.emails || !profile.emails[0].value) {
            logger.error('No e-mail found', {id:profile.id, displayName:profile.displayName});
        } else {
            email = profile.emails[0].value;
        }

        return email;
    }

    // More info: https://developers.facebook.com/docs/graph-api/reference/user
    function createPersonFromFacebookProfile(profile) {
        var system = cvcDatabase.createSystemObject(config.authentication.facebook.name);

        var settings = {
            recieveEmailNotifications: true,
            searchable: true
        };

        var email = getEmailFromFacebookProfile(profile); // TODO: we have one "register" e-mail and one "visible" e-mail, ...?

        var person = {
            basic: {
                name: profile.displayName,
                profilePicture: (profile.photos ? profile.photos[0].value : config.server.defaultProfilePicture),
                email: email,
                dateOfBirth: profile.birthday // TODO: this is a fixed string MM/DD/YYYY

                // profile.about or profile.bio
                // profile.cover = cover photo
                // profile.education = list<EducationExperience> https://developers.facebook.com/docs/graph-api/reference/education-experience/
                // profile.hometown = https://developers.facebook.com/docs/graph-api/reference/page/
                // profile.location = https://developers.facebook.com/docs/graph-api/reference/page/
                // profile.languages = list<Experience> https://developers.facebook.com/docs/graph-api/reference/experience/
                // work = list<WorkExperience> https://developers.facebook.com/docs/graph-api/reference/work-experience/

                // TODO: fill in more information
            }
        };

        var newProfile = {
            userid: getIdFromProfile(config.authentication.facebook.name,profile),
            email: email,

            person: person,
            system: system
        };

        return newProfile;
    }

    function createCompanyFromFacebookProfile(profile) {
        var system = cvcDatabase.createSystemObject(config.authentication.facebook.name);

        // TODO: fetch general info

        var email = getEmailFromFacebookProfile(profile);

        var newProfile = {
            userid: getIdFromProfile(config.authentication.facebook.name,profile),
            email: email,
            system: system
        };

        return newProfile;
    }

    function createPersonFromProfile(provider, profile) {
        if (provider === config.authentication.facebook.name) {
            return createPersonFromFacebookProfile(profile);
        }

        // TODO: implement for other providers

        return null;
    }

    function createCompanyFromProfile(provider, profile) {
        if (provider === config.authentication.facebook.name) {
            return createCompanyFromFacebookProfile(profile);
        }

        // TODO: implement for other providers

        return null;
    }

    /**
     * Fetches the e-mail from the profile.
     * The "profile" object has the structure that the "provicer" returns.
     */
    /*function getEmailFromProfile(provider, profile) {
        var result = null;

        if (provider === config.authentication.facebook.name) {
            result = profile.emails ? profile.emails[0].value : profile.email;
        }

        // TODO: implement for other providers

        if (result === undefined || result === null) {
            // TODO: error
        }

        return result;
    }*/

    /**
     * Concatinates provider name and id, ex: FACEBOOK_123456767
     */
    function createIdFromProviderAndId(provider, id) {
        return provider.toUpperCase() + '_' + id.toString();
    }

    /**
     * Fetches the Id from the profile to uniquely identify the user.
     * The "profile" object has the structure that the "provicer" returns.
     */
    function getIdFromProfile(provider, profile) {
        var result = null;

        if (provider.toUpperCase() === config.authentication.facebook.name.toUpperCase()) {
            result = profile.id;
        }

        // TODO: implement for other providers

        if (result === undefined || result === null) {
            // TODO: error
        }

        return createIdFromProviderAndId(provider,result);
    }

    /**
     * Login the user if profile exists or create a profile and then login the user.
     */
    function loginOrCreateProfile(provider, accessToken, refreshToken, profile, done) {
        var errorObject = null;

        // TODO: picture: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg'

        // TODO: store the raw 'profile' object as is in the database

        var searchCriteria = {userid:getIdFromProfile(provider, profile)};
        logger.info('Searching for:', searchCriteria);

        cvcDatabase.getDatamodels().Person.findOne(searchCriteria, function(err, savedProfile) {
            if (err !== null) {
                logger.warn(err);
                errorObject = err;
            } else if (savedProfile === null) {
                var newProfile = createPersonFromProfile(provider, profile);
                var newPerson = new cvcDatabase.getDatamodels().Person(newProfile);
                newPerson.save(function(err) {
                    if (err) {
                        logger.error(err);
                        errorObject = err;
                    } else {
                        logger.info('New Person: ' + getIdFromProfile(provider, profile));
                    }
                });
            }
        });

        cvcDatabase.getDatamodels().Company.findOne(searchCriteria, function(err, savedProfile) {
            if (err !== null) {
                logger.warn(err);
                errorObject = err;
            } else if (savedProfile === null) {
                var newProfile = createCompanyFromProfile(provider, profile);
                var newCompany = new cvcDatabase.getDatamodels().Company(newProfile);
                newCompany.save(function(err) {
                    if (err) {
                        logger.error(err);
                        errorObject = err;
                    } else {
                        logger.info('New Company: ' + getIdFromProfile(provider, profile));
                    }
                });
            }
        });

        done(errorObject, profile);
    }

    function verifyCredentials(userid, password, done) {
        var profile = null;
        var error = null; // new Error('message')

        // TODO: verify userid/password, use node crypto.pbkdf2
        profile = {id:'10153728991941374'};

        done(error, profile);
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
            passport.use(new passportGoogle.Strategy({
                clientID: process.env.GOOGLE_APP_ID || config.authentication.google.clientID,
                clientSecret: process.env.GOOGLE_APP_SECRET || config.authentication.clientSecret,
                returnURL: config.authentication.google.callbackURL,
                profileFields: config.authentication.google.profileFields
            }, function(accessToken, refreshToken, profile, done) {
                loginOrCreateProfile(config.authentication.google.name, accessToken, refreshToken, profile, done);
            }));
        }
    }

    function initTwitterAuthentication() {
        if (config.authentication.twitter.enabled) {
            logger.info('Init Twitter Authentication');
            passport.use(new passportTwitter.Strategy({
                consumerKey: process.env.TWITTER_APP_ID || config.authentication.twitter.consumerKey,
                clientSecret: process.env.TWITTER_APP_SECRET || config.authentication.twitter.clientSecret,
                callbackURL: config.authentication.twitter.callbackURL,
                profileFields: config.authentication.twitter.profileFields
            }, function(accessToken, refreshToken, profile, done) {
                loginOrCreateProfile(config.authentication.twitter.name, accessToken, refreshToken, profile, done);
            }));
        }
    }

    function initLinkedInAuthentication() {
        if (config.authentication.linkedin.enabled) {
            logger.info('Init LinkedIn Authentication');
            passport.use(new passportLinkedIn.Strategy({
                clientID: process.env.LINKEDIN_APP_ID || config.authentication.linkedin.clientID,
                clientSecret: process.env.LINKEDIN_APP_SECRET || config.authentication.linkedin.clientSecret,
                callbackURL: config.authentication.linkedin.callbackURL,
                profileFields: config.authentication.linkedin.profileFields
            }, function(accessToken, refreshToken, profile, done) {
                loginOrCreateProfile(config.authentication.linkedin.name, accessToken, refreshToken, profile, done);
            }));
        }
    }

    function initFacebookAuthentication() {
        if (config.authentication.facebook.enabled) {
            logger.info('Init Facebook Authentication');
            passport.use(new passportFacebook.Strategy({
                clientID: process.env.FACEBOOK_APP_ID || config.authentication.facebook.clientID,
                clientSecret: process.env.FACEBOOK_APP_SECRET || config.authentication.facebook.clientSecret,
                callbackURL: config.authentication.facebook.callbackURL,
                profileFields: config.authentication.facebook.profileFields
            }, function(accessToken, refreshToken, profile, done) {
                loginOrCreateProfile(config.authentication.facebook.name, accessToken, refreshToken, profile, done);
            }));
        }
    }

    /*function initAuthentication(strategyConfig, mainConfig) {
        if (mainConfig.enabled) {
            passport.use(new passportLinkedIn.Strategy(strategyConfig, function(accessToken, refreshToken, profile, done) {
                loginOrCreateProfile(mainConfig.name, accessToken, refreshToken, profile, done);
            }));
        }
    }*/

    function initPassportAuthentications() {
        // TODO: use general init authentication function

        initLocalAuthentication();
        initHttpAuthentication();
        initFacebookAuthentication();
        initGoogleAuthentication();
        initTwitterAuthentication();
        initLinkedInAuthentication();
    }

    function initApp(app) {
        app.use(cookieParser());
        app.use(expressSession({
            secret: process.env.SESSION_KEY || config.server.sessionSecretKey,
            resave: false,
            saveUninitialized: false
        }));

        //app.use('/private', passport.authenticate('local', {session: false}));
        app.use(passport.initialize());
        app.use(passport.session());

        var methods = [
            { post: true, enabled: config.authentication.local.enabled, name: 'local', type:'local', callback: null },
            { post: true, enabled: config.authentication.http.enabled, name: 'http', type:'basic', callback: null },
            { post: true, enabled: config.authentication.google.enabled, name: 'google', type:'google', callback: function(req, res) { res.redirect('/'); } },
            { post: false, enabled: config.authentication.facebook.enabled, name: 'facebook', type:'facebook', callback: function(req, res) { res.redirect('/'); } },
            { post: true, enabled: config.authentication.twitter.enabled, name: 'twitter', type:'twitter', callback: function(req, res) { res.redirect('/'); } },
            { post: true, enabled: config.authentication.linkedin.enabled, name: 'linkedin', type:'linkedin', callback: function(req, res) { res.redirect('/'); } }
        ];

        for (var i = 0; i < methods.length; ++i) {
            var method = methods[i];

            if (method.enabled) {
                if (method.post) {
                    app.post('/public/' + method.name + '/login', passport.authenticate(method.type, { successRedirect: '/', failureRedirect: '/loginfailed' }));
                } else {
                    app.get('/auth/' + method.name + '/login', passport.authenticate(method.type, { successRedirect: '/', failureRedirect: '/loginfailed' }));
                }
                if (method.callback !== null) {
                    app.get('/auth/' + method.name + '/callback', passport.authenticate(method.type, { failureRedirect: '/' }), method.callback);
                }
            }
        }

        app.get('/auth/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    }

    function initPassport() {
        passport.serializeUser(function(user, done) {
            done(null, createIdFromProviderAndId(user.provider,user.id));
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

        close: function() {
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

            if (config.authentication.linkedin.enabled) {
                list.push('linkedin');
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