/* jshint node:true */
/* jshint esversion: 6 */

/**
 * @module {Ceramic}
 * @parent main
 *
 * Datasets
 *
 * @author Lukas Heise
 */

const path = require('path');
const redis = require("redis");
const watch = require('node-watch');
const bluebird = require('bluebird');
const loadashObject = require('lodash/fp/object');

const cvcUtils = require('./cvc-utils');

(function () {
    "use strict";

    const MAX_FILTER_ELEMENTS = 10;

    var config;
    var logger;
    //var datasets;

    var cacheClient;

    /*function readDataset(filename, defaultValue, doCrash) {
        return cvcUtils.readJsonFileSync(path.join(config.server.datasets.folder,filename), defaultValue, doCrash);
    }

    // TODO: this code should not be here, a service should update and fill the cache
    function watchDatasets(filename) {
        if (config.server.datasets.watchEnabled) {
            logger.info('Watch triggered on file: ' + filename);

            if (filename.indexOf(config.server.datasets.translations) > -1) {
                logger.info('Reloading Translations');
                datasets.translations = readDataset(config.server.datasets.translations, datasets.translations, false);
            }
        }
    }

    function filterDataset(filter, dataset, compareFunc) {
        const filterText = filter.toLowerCase();

        var filtered = [];
        if (dataset) {
            for (var key in dataset) {
                if (dataset.hasOwnProperty(key)) {
                    var value = dataset[key];
                    if (compareFunc(value.toLowerCase(),filterText)) {
                        var jsonText = '{"' + key + '":"' + value + '"}';
                        filtered.push(JSON.parse(jsonText));

                        if (filtered.length() === MAX_FILTER_ELEMENTS) {
                            return filtered;
                        }
                    }
                }
            }
        }

        return filtered;
    }*/

    function handleMessage(channel, message) {
        logger.info('Redis Message: channel=' + channel + ' message=' + message);
        if (channel === 'update') {
            // TODO: listen for datasets that are to be loaded full
        }
    }

    function initEndPoints(app) {
        app.get('/dataset/keys/:name', function(req, res) {
            cacheClient.getAsync(req.params.name).then(function(data) {
                res.json(loadashObject.keys(JSON.parse(data)));
            }).error(function(err) {
                logger.error(err);
            });
        });

        app.get('/dataset/:name', function(req, res) {
            cacheClient.getAsync(req.params.name).then(function(data) {
                res.json(JSON.parse(data));
            }).error(function(err) {
                logger.error(err);
            });
        });

        app.get('/dataset/:name/:param0', function(req, res) {
            cacheClient.getAsync(req.params.name).then(function(data) {
                res.json(JSON.parse(data)[req.params.param0] || {});
            }).error(function(err) {
                logger.error(err);
            });
        });

        app.get('/dataset/:name/:param0/:param1', function(req, res) {
            cacheClient.getAsync(req.params.name).then(function(data) {
                res.json(JSON.parse(data)[req.params.param0][req.params.param1] || {});
            }).error(function(err) {
                logger.error(err);
            });
        });

        app.get('/dataset/:name/:param0/:param1/:param2', function(req, res) {
            cacheClient.getAsync(req.params.name).then(function(data) {
                res.json(JSON.parse(data)[req.params.param0][req.params.param1][req.params.param2] || {});
            }).error(function(err) {
                logger.error(err);
            });
        });

        /*
        app.get('/public/countries/:locale/:filter', function(req, res) {
            //res.json(filterDataset(req.params.filter, datasets.countries, function(value, filter) {
            //    return value.indexOf(filter) === 0;
            //}));
            res.json({});
        });

        app.get('/public/cities/:country/:locale/:filter', function(req, res) {
            // TODO: fetch all cities that contain 'filter' and are in 'country'
            res.json({});
        });*/
    }

    function initCache() {
        cacheClient = redis.createClient(config.redis);

        cacheClient.on('error', function (err) {
            logger.error('Redis Error: ' + err);
        });

        cacheClient.on('ready', function() {
            logger.info('Redis is ready');
        });

        cacheClient.on('connect', function() {
            logger.info('Connected to Redis');
        });

        cacheClient.on('reconnecting', function(delay, attempt) {
            logger.info('Reconnected to Redis: delay=' + delay + ' attempt=' + attempt);
        });

        cacheClient.on('end', function() {
            logger.info('Redis End');
        });

        cacheClient.on('warning', function(warn) {
            logger.warn('Redis Warning: ' + warn);
        });

        cacheClient.on('subscribe', function(channel, count) {
            logger.info('Redis Subscribe: channel=' + channel + ' count=' + count);
        });

        cacheClient.on('message', function(channel, message) {
            handleMessage(channel, message);
        });

        //cacheClient.subscribe('update');

        bluebird.promisifyAll(redis.RedisClient.prototype);
        bluebird.promisifyAll(redis.Multi.prototype);
    }

    module.exports = {
        init: function(_config, _logger, _app) {
            config = _config;
            logger = _logger;

            cvcUtils.init(config, logger);

            initCache();
            //initDatasets();
            initEndPoints(_app);
        },

        close: function() {
            cacheClient.quit();
        },

        isCountry: function(country) {
            // TODO
            return true;
        },

        isCity: function(country, city) {
            // TODO
            return true;
        },

        isSkillLevel: function(level) {
            // TODO
            return true;
        },

        isIndustry: function(industry) {
            // TODO
            return true;
        },

        isRole: function(role) {
            // TODO
            return true;
        },

        isSchoolDegree: function(schoolDegree) {
            // TODO
            return true;
        },

        isSchoolFaculty: function(schoolFaculty) {
            // TODO
            return true;
        },

        isLanguage: function(language) {
            // TODO
            return true;
        }
    };
})();