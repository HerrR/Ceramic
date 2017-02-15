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
            },
            templateUrl: 'partials/person/cv/cards/compensation.html',
            controller: 'CompensationCardController'
        };
    }
})();
