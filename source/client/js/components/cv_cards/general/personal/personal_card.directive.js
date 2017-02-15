/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('personalCard', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/person/cv/cards/personal_description.html',
            controller: 'PersonalCardController'
        };
    }
})();
