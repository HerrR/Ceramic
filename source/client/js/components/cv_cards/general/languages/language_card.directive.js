/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('languageCard', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/person/cv/cards/languages.html',
            controller: 'LanguageCardController'
        };
    }
})();
