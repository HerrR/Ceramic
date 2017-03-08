/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('compensationCard', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
                compensation:"=",
                onupdate:"&"
            },
            templateUrl: 'partials/person/cv/cards/compensation_card.html',
            controller: 'CompensationCardController'
        };
    }
})();
