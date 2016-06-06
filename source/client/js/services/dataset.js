/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('DatasetService', DatasetService);

    DatasetService.$inject = ['$http', 'AppConstants'];

    function DatasetService($http, AppConstants) {
        var self = this;
        var datasets = {};

        datasets[AppConstants.TRANSLATION_LANGUAGES] = { path: AppConstants.PATHS.DATASETS + 'keys/translations', callbacks: [], data: null };
        datasets[AppConstants.LANGUAGE_LEVELS] = { path: AppConstants.PATHS.DATASETS + 'language_level', callbacks: [], data: null };
        // TODO: fetch all datasets that can be stored locally

        angular.forEach(datasets, function(value, key) {
                console.log('loaded:' + key + " value=" + value.path);
            var current = datasets[key];
            
            $http.get(current.path, {}).then(function(dataset) {
                current.data = dataset.data;
                for (var index = 0; index < current.callbacks.length; ++index) {
                    current.callbacks[index](current.data);
                }
            }, function(err) {
                // TODO
            });
        });

        self.isLoaded = function(name) {
            return (datasets[name] && datasets[name].data);
        };

        self.getAsync = function(name, callback) {
            if (callback && datasets[name]) {
                if (datasets[name].data !== null) {
                    callback(datasets[name].data);
                } else {
                    datasets[name].callbacks.push(callback);
                }
            }
        };

        self.get = function(name) {
            if (self.isLoaded(name)) {
                return datasets[name].data;
            }

            return undefined;
        };
    }
})();