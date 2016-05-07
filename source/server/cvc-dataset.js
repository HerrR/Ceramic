/* jshint node:true */
/* jshint esversion: 6 */
/* jshint esnext: true */

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

    const cvcUtils = require('./cvc-utils');

    var config;
    var logger;
    var datasets;

    function readDataset(filename, defaultValue, doCrash) {
        return cvcUtils.readJsonFileSync(path.join(config.server.datasets.folder,filename), defaultValue, doCrash);
    }

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

    module.exports = {
        init: function(_config, _logger) {
            config = _config;
            logger = _logger;

            cvcUtils.init(config, logger);

            datasets = {
                translations: readDataset(config.server.datasets.translations,{},true),
                countries: readDataset(config.server.datasets.countries,{},true)
            };

            watch(config.server.datasets.watch, watchDatasets);

            // TODO: create REST endpoints here for all datasets
        },

        getDatasets: function() {
            return datasets;
        },

        filterDataset: function(filter, dataset, maxResultCount, compareFunc) {
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

    };
})();