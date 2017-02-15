/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('computerSkillsCard', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/person/cv/cards/computer_skills.html',
            controller: 'ComputerSkillsCardController'
        };
    }
})();
