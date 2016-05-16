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

    const cvcUtils = require('./cvc-utils');

    var config;
    var logger;
    var datasets;

    /*var cacheClient = redis.createClient();

    cacheClient.on("error", function (err) {
        logger.error("Cache: " + err);
    });*/

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
                        var jsonText = '{"' + key + '":"' + value + '"}';
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
        // TODO: list supported translations

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
            res.json(filterDataset(req.params.filter, datasets.countries, 5, function(value, filter) {
                return value.indexOf(filter) === 0;
            }));
        });

        app.get('/public/cities/:country/:filter', function(req, res) {
            // TODO: fetch all cities that contain 'filter' and are in 'country'
        });
    }

    function initDatasets() {
        datasets = {
            translations: readDataset(config.server.datasets.translations,{},true),
            countries: readDataset(config.server.datasets.countries,{},true)
        };

        watch(config.server.datasets.watch, watchDatasets);
    }

    module.exports = {
        init: function(_config, _logger, _app) {
            config = _config;
            logger = _logger;

            cvcUtils.init(config, logger);

            initDatasets();
            initEndPoints(_app);
        },

        isCountry: function(key) {
            // TODO
            return true;
        }

        // TODO: verification functions for all datasets
    };
})();