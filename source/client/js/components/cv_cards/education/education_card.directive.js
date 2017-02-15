/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('educationCard', Directive);

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
            templateUrl: 'partials/person/cv/cards/education.html',
            controller: 'EducationCardController'
        };
    }
})();
