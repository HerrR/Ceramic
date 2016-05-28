/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .config(AcceptLanguage);

    AcceptLanguage.$inject = ['$httpProvider'];
    
    function AcceptLanguage( $httpProvider) {
        $httpProvider.interceptors.push('AcceptLanguageInterceptorFactory');
    }
})();