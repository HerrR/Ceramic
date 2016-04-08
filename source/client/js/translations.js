/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .config(TranslateProvider);

    TranslateProvider.$inject = ['$translateProvider'];

    function TranslateProvider($translateProvider) {
        $translateProvider
            .useLoader('TranslationsLoader')
            .preferredLanguage('en')
            .useSanitizeValueStrategy('escape')
            .useMissingTranslationHandler('MissingTranslationHandler')
            .fallbackLanguage('en');
    }
})();