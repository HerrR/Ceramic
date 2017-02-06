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
            templateUrl: 'partials/common/footer.html',
            controller: 'CvcFooterController'
        };
    }
})();
