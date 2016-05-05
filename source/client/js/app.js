/* global angular */
/* global window */

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
            'LocalStorageModule',
            'angulartics',
            'angulartics.google.analytics'
            ])
        .config(Config)
        .run(Run);

    Run.$inject = ['$rootScope','localStorageService'];
    Config.$inject = ['$mdThemingProvider', '$mdDateLocaleProvider'];

    function Run($rootScope, localStorageService) {
        localStorageService.clearAll();
    
        var lang2lang = [
            {k: 'sv', v:'se'},
            {k: 'se', v:'se'},
            {k: 'en', v:'en'}
        ];
        var language = (window.navigator.userLanguage || window.navigator.language).toLowerCase();
        var transformedLanguage = 'en';
        for (var i in lang2lang) {
            if (language.indexOf(lang2lang[i].k) > -1) {
                transformedLanguage = lang2lang[i].v;
                break;
            }
        }

        $rootScope.language = transformedLanguage;
    }

    function Config($mdThemingProvider, $mdDateLocaleProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('grey');

        // TODO: $mdDateLocaleProvider, https://material.angularjs.org/latest/api/service/$mdDateLocaleProvider
    }
})();