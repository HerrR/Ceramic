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
            'angulartics.google.analytics',
            'chart.js'
            ])
        .config(Config)
        .run(Run);

    Run.$inject = ['$rootScope','localStorageService'];
    Config.$inject = ['$compileProvider','$mdThemingProvider', '$mdDateLocaleProvider', 'ChartJsProvider'];

    function Run($rootScope, localStorageService) {
        localStorageService.clearAll();
    
        // TODO: load from service
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

        // TODO: load from $cookies

        $rootScope.language = transformedLanguage;
    }

    function Config($compileProvider, $mdThemingProvider, $mdDateLocaleProvider, ChartJsProvider) {
        $compileProvider.debugInfoEnabled(false);

        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('grey');

        //ChartJsProvider.setOptions({ colours : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
        //ChartJsProvider.setOptions('Line', { datasetFill: false });

        // TODO: $mdDateLocaleProvider, https://material.angularjs.org/latest/api/service/$mdDateLocaleProvider
    }
})();