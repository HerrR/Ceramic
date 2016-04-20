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
        .config(Config)
        .run(Run);

    Run.$inject = ['localStorageService'];
    Config.$inject = ['$mdThemingProvider', '$mdDateLocaleProvider'];

    function Run(localStorageService) {
        // TODO: determine if user has signed in
        localStorageService.clearAll();
    }

    function Config($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('grey');

        // TODO: $mdDateLocaleProvider, https://material.angularjs.org/latest/api/service/$mdDateLocaleProvider
    }
})();