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
    const cvcUtils = require('./cvc-utils');

    const app = express();
    
    var upload;
    var config;
    var logger;

    function initUploads() {
        var uploadProperties = config.server.uploads.properties;
        
        uploadProperties.fileFilter = function(req, file, cb) {
            // TODO: check if "req.user.id" has storage to upload the file


            // TODO: filter file formats

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

        upload = multer(uploadProperties);
    }

    function findAttachment(attachments, id) {
        for (var index = 0; index < attachments.length; ++index) {
            if (attachments[index].id === id) {
                return attachments[index];
            }
        }

        return undefined;
    }

    function sendAttachment(config, req, res, library) {
        var attachment = findAttachment(library, req.params.id);

        if (attachment !== undefined) {
            res.download(path.join(__dirname, config.server.uploads.src, req.params.id), attachment.name);
        } else {
            res.sendStatus(400);
        }
    }


    function checkFindPerson(err, profile, req, res, successCallback, notFoundCallback) {
        if (err !== null) {
            logger.error(err);
            res.sendStatus(404);
        } else if (profile === null) {
            logger.error('No data for person: ' + req.user.id);
            if (notFoundCallback) {
                notFoundCallback(req, res);
            } else {
                res.sendStatus(400);
            }
        } else {
            successCallback(profile);
        }
    }

    function hasStorageCapacity(attachments, capacity) {
        var total = 0;
        for (var index = 0; index < attachments.length; ++index) {
            total += attachments[index].size;
        }

        return (total <= capacity);
    }

    function initExpress() {
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json({limit: config.server.dataSizeLimit}));
        app.use(compression());
        app.use(express.static(path.join(__dirname,config.server.staticFiles)));
        app.use(ddos({
            rules: [{
                regexp: "^/public.*",
                flags: "i",
                maxWeight: 4,
                queueSize: 4
            }]
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

        app.get('/public/storage_size', function(req, res) {
            res.json({size: config.server.uploads.initialStorage});
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

        app.post('/private/upload', cvcAuthentication.ensureAuthenticated, upload.single('file'), function(req, res) {
            logger.info('Uploaded: name=' + req.file.originalname + ' size=' + req.file.size);

            if (req.file) {
                var attachment = {
                    id: req.file.filename,
                    name: req.file.originalname,
                    mimetype: req.file.mimetype,
                    checksum: '',
                    link: 'private/download/' + req.file.filename,
                    size: req.file.size,
                    added: new Date(),
                    validContent: false
                };

                cvcDatabase.getDatamodels().Person.findOne({userid:req.user.id}, function(err, profile) {
                    checkFindPerson(err, profile, req, res, function(savedProfile) {
                        if (hasStorageCapacity(savedProfile.person.library, config.server.uploads.initialStorage + attachment.size)) {
                            savedProfile.person.library.push(attachment);
                            savedProfile.save(function (err) {
                                if (err !== null) {
                                    logger.warn('Failed toto add attachment to profile: ' + req.user.id + ', attachment=' + attachment.id + ', error: ' + err);
                                    res.sendStatus(400);
                                } else {
                                    logger.info('Added attachment to profile: ' + req.user.id + ', attachment=' + attachment.id);
                                    res.json(attachment);
                                }
                            });
                        } else {
                            res.json({error: 'error.library.fullStorage'});
                        }
                    });
                });
            } else {
                logger.warn(err);
                res.sendStatus(400);
            }
        });

        app.get('/private/download/:id', cvcAuthentication.ensureAuthenticated, function(req, res) {
            cvcDatabase.getDatamodels().Person.findOne({userid:req.user.id}, function(err, profile) {
                checkFindPerson(err, profile, req, res, function(savedProfile) {
                    sendAttachment(config, req, res, savedProfile.person.library);
                }, function(req, res) {
                    var query = {
                        'authorizedUsers.userid': req.user.id,
                        'authorizedUsers.toDate': {$lte: new Date()},
                        'person.library.id': req.params.id,
                        'person.library.maliciousContent': false,
                        'person.library.validContent': true,
                        'person.library.scanned': {$ne: null}
                    };

                    cvcDatabase.getDatamodels().Person.findOne(query, function(err, profile) {
                        checkFindPerson(err, profile, req, res, function(savedProfile) {
                            sendAttachment(config, req, res, savedProfile.person.library);
                        });
                    });
                });
            });
        });

        app.get('/private/person', cvcAuthentication.ensureAuthenticated, function(req, res) {
            cvcDatabase.getDatamodels().Person.findOne({userid:req.user.id}, function(err, profile) {
                checkFindPerson(err, profile, req, res, function(savedProfile) {
                    logger.debug('Fetched Person: ' + savedProfile.person.name);
                    cvcDatabase.hideSecretProfileData(savedProfile);
                    res.json(savedProfile);
                });
            });
        });

        app.post('/private/person', cvcAuthentication.ensureAuthenticated, function(req, res) {
            var newProfile = req.body;
            cvcDatabase.getDatamodels().Person.findOne({userid:req.user.id}, function(err, profile) {
                checkFindPerson(err, profile, req, res, function(savedProfile) {
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
                });
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