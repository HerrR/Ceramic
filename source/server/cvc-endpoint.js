/**
 * REST endpoints
 *
 * @author Lukas Heise
 */

 /* jshint node:true */
 /* jshint esversion: 6 */
 /* jshint esnext: true */

(function () {
  "use strict";

    const ddos = require("ddos-express");
    const express = require('express');
    const bodyParser = require('body-parser');
    const compression = require('compression');

    const cvcDataset = require('./cvc-dataset');
    const cvcDatabase = require('./cvc-database');
    const cvcAuthentication = require('./cvc-authentication');

    const app = express();

    var config;
    var logger;

    function initExpress() {
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json({limit: config.server.dataSizeLimit}));
        app.use(compression());
        app.use(express.static(__dirname + config.server.staticFiles)); // TODO: user path.joint(a,b)
        app.use(ddos({
            // TODO: Configuration options
        }));
    }

    function initEndpoints() {
        app.get('/public/loginstrategies', function(req, res) {
            res.json(cvcAuthentication.listEnabledStrategies());
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
    }

    module.exports = {
        init: function(_config, _logger, _cvcDataset, _cvcDatabase) {
            config = _config;
            logger = _logger;

            cvcDataset.init(config, logger);
            cvcDatabase.init(config, logger);

            initExpress();
            cvcAuthentication.init(config, logger, app, cvcDatabase);

            initEndpoints();
        },

        getApp: function() {
            return app;
        }
    };
})();