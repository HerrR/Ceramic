/* global angular */
 
(function() {
    'use strict';
 
    angular
        .module('cvc')
        .service('FeatureToggleService', FeatureToggleService);
 
    FeatureToggleService.$inject = ['$http', 'AppConstants'];
 
    function getValue(toggledFeatures, property, defaultValue) {
        var value = toggledFeatures[property];
        if (value === undefined || value === null) {
            return defaultValue;
        }
        return value;
    }
 
    function FeatureToggleService($http, AppConstants) {
        var me = this;
        var toggledFeatures;
        var callbacks = [];
 
        me.init = function() {
            $http.get(AppConstants.PATHS.FEATURE_TOGGLE).then(function(resp) {
                toggledFeatures = resp.data;
 
                for (var i in callbacks) {
                    callbacks[i].callback(getValue(toggledFeatures, callbacks[i].property, callbacks[i].defaultValue));
                }
 
                callbacks = [];
            }, function(err) {
                toggledFeatures = {};
            });
        };
 
        me.isActive = function(property, defaultValue, callback) {
            if (callback) {
                if (toggledFeatures) {
                    callback(getValue(toggledFeatures, property, defaultValue));
                } else {
                    callbacks.push({
                        property: property,
                        defaultValue: defaultValue,
                        callback: callback
                    });
                }
            }
        };
    }
})();
