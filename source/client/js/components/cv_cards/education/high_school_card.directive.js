/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('highSchoolCard', Directive);

    function Directive() {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                type:"@",
                educationdata:"=",
                ondelete:"&",
                onsave:"&"
            },
            templateUrl: 'partials/person/cv/cards/high_school_card.html',
            controller: 'HighSchoolCardController'
        };
    }
})();
