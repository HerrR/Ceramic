/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('cvcFooter', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/footer.html',
            controller: 'CvcFooterController'
        };
    }
})();
