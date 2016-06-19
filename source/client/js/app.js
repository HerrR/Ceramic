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
            'ngFileUpload',
            'ui.router',
            'pascalprecht.translate',
            'LocalStorageModule',
            'angulartics',
            'angulartics.google.analytics',
            'chart.js'
            ])
        .config(Config)
        .run(Run);

    Run.$inject = ['$rootScope', '$cookies', '$translate','localStorageService', 'AppConstants'];
    Config.$inject = ['$compileProvider','$mdThemingProvider', '$mdDateLocaleProvider', 'ChartJsProvider'];

    function Run($rootScope, $cookies, $translate, localStorageService, AppConstants) {
        localStorageService.clearAll();

        var storedLanguage = $cookies.get(AppConstants.COOKIES.LANGUAGE);
        var transformedLanguage = 'en';

        // TODO: load from service
        var lang2lang = [
            {k: 'sv', v:'se'},
            {k: 'se', v:'se'},
            {k: 'en', v:'en'}
        ];

        if (storedLanguage === undefined || storedLanguage === null) {
            var language = (window.navigator.userLanguage || window.navigator.language).toLowerCase();
            for (var i in lang2lang) {
                if (language.indexOf(lang2lang[i].k) >= 0) {
                    transformedLanguage = lang2lang[i].v;
                    break;
                }
            }
            $cookies.put(AppConstants.COOKIES.LANGUAGE, transformedLanguage, {expires: new Date("2047-12-09")});
        } else {
            transformedLanguage = storedLanguage;
        }

        $rootScope.locale = transformedLanguage;

        $translate.use(transformedLanguage).then(function () {
            // translation changed callback
        });
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