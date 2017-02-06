/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('cvcWelcome', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/common/welcome.html',
            controller: 'CvcWelcomeController'
        };
    }
})();
