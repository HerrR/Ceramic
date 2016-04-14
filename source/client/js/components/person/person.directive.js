/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('cvcPerson', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/person.html',
            controller: 'CvcPersonController'
        };
    }
})();
