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
                generalinfo:"=",
                onupdate:"&"
            },
            templateUrl: 'partials/person/cv/cards/computer_skills_card.html',
            controller: 'ComputerSkillsCardController'
        };
    }
})();
