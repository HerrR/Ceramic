/* global angular */
/* global $ */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('DatasetService', DatasetService);

    DatasetService.$inject = ['$http', 'AppConstants'];

    function DatasetService($http, AppConstants) {
        var self = this;
        var datasets = {};

        for (var key in AppConstants.DATASETS) {
            datasets[AppConstants.DATASETS[key].NAME] = { path: AppConstants.DATASETS[key].PATH, callbacks: [], data: null };
        }

        // TODO: fetch all datasets that can be stored locally

        $.each(datasets, function(index, value) {
            $http.get(AppConstants.PATHS.DATASETS + value.path, {}).then(function(dataset) {
                value.data = dataset.data;
                for (var index = 0; index < value.callbacks.length; ++index) {
                    value.callbacks[index](value.data);
                }
                value.callbacks = [];
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

        self.getFilter = function(name, filter, callback) {
            // TODO
        };

        self.get = function(name) {
            if (self.isLoaded(name)) {
                return datasets[name].data;
            }

            return undefined;
        };
    }
})();