/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .factory('AcceptLanguageInterceptorFactory', AcceptLanguageInterceptorFactory);

    AcceptLanguageInterceptorFactory.$inject = ['$rootScope'];

    function AcceptLanguageInterceptorFactory($rootScope) {
        return {
            request: function(config) {
                if ($rootScope.locale) {
                    config.headers['Accept-Language'] = $rootScope.locale;
                }
                return config;
            }
        };
    }
})();