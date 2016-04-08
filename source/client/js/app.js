/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc', [
            'ngMaterial',
            'ngResource',
            'ngAnimate',
            'ngCookies',
            'ui.router',
            'pascalprecht.translate',
            'LocalStorageModule'
            ])

        .run(Run);

    Run.$inject = ['localStorageService'];

    function Run(localStorageService) {
        localStorageService.clearAll();
    }
})();