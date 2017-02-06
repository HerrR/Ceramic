/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('cvcHeader', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/common/header.html',
            controller: 'CvcHeaderController'
        };
    }
})();
