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
                languages:"=",
                onupdate:"&"
            },
            templateUrl: 'partials/person/cv/cards/languages_card.html',
            controller: 'LanguageCardController'
        };
    }
})();
