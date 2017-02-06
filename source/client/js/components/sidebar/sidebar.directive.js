/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('cvcSidebar', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/person/sidebar.html',
            controller: 'CvcSidebarController'
        };
    }
})();
