/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('workCard', Directive);

    function Directive() {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                experiencedata:"=",
                onsave:"&",
                ondelete:"&"
            },
            templateUrl: 'partials/person/cv/cards/work.html',
            controller: 'WorkCardController'
        };
    }
})();
