/* jshint node:true */
/* jshint esversion: 6 */

/**
 * @module {Ceramic}
 * @parent main
 *
 * REST endpoints
 *
 * @author Lukas Heise
 */

(function () {
    "use strict";

    const path = require('path');
    const ddos = require("ddos-express");
    const multer  = require('multer');
    const express = require('express');
    const bodyParser = require('body-parser');
    const compression = require('compression');

    const cvcDataset = require('./cvc-dataset');
    const cvcDatabase = require('./cvc-database');
    const cvcAuthentication = require('./cvc-authentication');

    const app = express();
    const upload;

    var config;
    var logger;

    function initUploads() {
        var uploadSettings = config.server.uploads.settings;
        
        uploadSettings.fileFilter = function(req, file, cb) {
            /*
              // The function should call `cb` with a boolean 
              // to indicate if the file should be accepted 
             
              // To reject this file pass `false`, like so: 
              cb(null, false)
             
              // To accept the file pass `true`, like so: 
              cb(null, true)
             
              // You can always pass an error if something goes wrong: 
              cb(new Error('I don\'t have a clue!'))
            */
            cb(null, true);
        };

        upload = multer(uploadSettings).any();
    }

    function initExpress() {
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json({limit: config.server.dataSizeLimit}));
        app.use(compression());
        app.use(express.static(path.join(__dirname,config.server.staticFiles)));
        app.use(ddos({
            // TODO: Configuration options
        }));
        app.use(function(err, req, res, next) {
            logger.error(err.stack);
            res.status(500).send('');
            next(err);
        });
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

        // TODO: private/company

        app.post('/private/upload', cvcAuthentication.ensureAuthenticated, function(req, res) {
            upload(req, res, function(err) {
                if (err) {
                    // TODO: handle error
                } else {
                    // TODO: ok
                }
            });

            // TODO
            //console.log('file.length = ' + req.file.length, req.file);
            //console.log('body = ', req.body);

            /*
            fieldname   Field name specified in the form    
            originalname    Name of the file on the user's computer 
            encoding    Encoding type of the file   
            mimetype    Mime type of the file   
            size    Size of the file in bytes   
            destination The folder to which the file has been saved DiskStorage
            filename    The name of the file within the destination DiskStorage
            path    The full path to the uploaded file  DiskStorage
            buffer  A Buffer of the entire file MemoryStorage
            */

            /*
            https://www.npmjs.com/package/multer

            var storage = multer.diskStorage({
              destination: function (req, file, cb) {
                cb(null, '/tmp/my-uploads')
              },
              filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now())
              }
            })
             
            var upload = multer({ storage: storage })
            */
        });

        app.get('/private/download', cvcAuthentication.ensureAuthenticated, function(req, res) {
            // TODO: check that this user is allowed to download the file
            // TODO: res.sendFile('test.png');
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
                            logger.info('Updated profile: ' + req.user.id + ' (' + savedProfile.system.updateVersion + ')');
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

            cvcDatabase.init(config, logger);

            initExpress();

            cvcDataset.init(config, logger, app);
            cvcAuthentication.init(config, logger, app, cvcDatabase);

            initUploads();
            initEndpoints();
        },

        close: function() {
            cvcAuthentication.close();
            cvcDatabase.close();
            cvcDataset.close();
        },

        getApp: function() {
            return app;
        }
    };
})();