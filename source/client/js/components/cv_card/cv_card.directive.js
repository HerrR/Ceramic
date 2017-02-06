/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('educationCard', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/person/cv/cards/education_card.html',
            controller: 'CvCardController'
        };
    }
})();
