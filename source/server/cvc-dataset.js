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

(function () {
  "use strict";

    const path = require('path');
    const watch = require('node-watch');
    const redis = require("redis");
    const loadashObject = require('lodash/fp/object');

    const cvcUtils = require('./cvc-utils');

    var config;
    var logger;
    var datasets;

    var cacheClient;

    /*
    cacheClient.set("string key", "string val", redis.print);
    cacheClient.hset("hash key", "hashtest 1", "some value", redis.print);
    cacheClient.hset(["hash key", "hashtest 2", "some other value"], redis.print);
    cacheClient.hkeys("hash key", function (err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        cacheClient.quit();
    });

    https://www.npmjs.com/package/redis
    */

    function readDataset(filename, defaultValue, doCrash) {
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

            if (filename.indexOf(config.server.datasets.countries) > -1) {
                logger.info('Reloading Countries');
                datasets.countries = readDataset(config.server.datasets.countries, datasets.countries, false);
            }

            // TODO: reload more datasets
        }
    }

    function filterDataset(filter, dataset, maxResultCount, compareFunc) {
        var filtered = [];
        var filterText = filter.toLowerCase();

        if (dataset) {
            for (var key in dataset) {
                if (dataset.hasOwnProperty(key)) {
                    var value = dataset[key];
                    if (compareFunc(value.toLowerCase(),filterText)) {
                        var jsonText = '{"' + key + '":"' + value + '"}';  // TODO: use loadash?
                        filtered.push(JSON.parse(jsonText));

                        if (maxResultCount-- <= 0) {
                            return filtered;
                        }
                    }
                }
            }
        }

        return filtered;
    }

    function initEndPoints(app) {
        app.get('/public/translations', function(req, res) {
            res.json(loadashObject.keys(datasets.translations));
        });

        app.get('/public/translations/:locale', function(req, res) {
            res.json(datasets.translations[req.params.locale.toLowerCase()] || {});
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
            res.json(filterDataset(req.params.filter, datasets.countries, 5, function(value, filter) {
                return value.indexOf(filter) === 0;
            }));
        });

        app.get('/public/cities/:country/:filter', function(req, res) {
            // TODO: fetch all cities that contain 'filter' and are in 'country'
        });

        app.get('/public/skilllevels', function(req, res) {
            // TODO: skill level
        });

        app.get('/public/languagelevels', function(req, res) {
            // TODO: language level
        });

        app.get('/public/industries', function(req, res) {
            // TODO: industry
        });

        app.get('/public/roles', function(req, res) {
            // TODO: role
        });

        app.get('/public/schooldegrees', function(req, res) {
            // TODO: school degree
        });

        app.get('/public/schoolfaculties', function(req, res) {
            // TODO: school faculty
        });

        app.get('/public/languages', function(req, res) {
            // TODO: list languages
        });

        app.get('/public/languages/:filter', function(req, res) {
            // TODO: list languages
        });
    }

    function initDatasets() {
        datasets = {
            translations: readDataset(config.server.datasets.translations,{},true),
            countries: readDataset(config.server.datasets.countries,{},true)
        };

        watch(config.server.datasets.watch, watchDatasets);
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

        cacheClient.on('message', function(channel, message) {

        });

        // TODO: substribe to the small datasets: cacheClient.subscribe('countries');
    }

    module.exports = {
        init: function(_config, _logger, _app) {
            config = _config;
            logger = _logger;

            cvcUtils.init(config, logger);

            initCache();
            initDatasets();
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

        isLanguageLevel: function(level) {
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