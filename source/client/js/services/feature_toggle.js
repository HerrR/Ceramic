/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('FeatureToggleService', FeatureToggleService);

    FeatureToggleService.$inject = [];

    function FeatureToggleService() {
        
        this.init = function() {
            // TODO
        };

        this.isActive = function(name, defaultValue, callback) {
            // TODO
        };
    }
})();
