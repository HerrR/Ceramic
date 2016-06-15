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

        datasets[AppConstants.DATASETS.TRANSLATION_LANGUAGES] = { path: 'keys/translations', callbacks: [], data: null };
        datasets[AppConstants.DATASETS.LANGUAGE_LEVELS] = { path: 'language_level', callbacks: [], data: null };
        datasets[AppConstants.DATASETS.INDUSTRY] = { path: 'industry', callbacks: [], data: null };
        datasets[AppConstants.DATASETS.DEGREE] = { path: 'education_level', callbacks: [], data: null };
        datasets[AppConstants.DATASETS.FACULTY] = { path: 'education_faculty', callbacks: [], data: null };

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