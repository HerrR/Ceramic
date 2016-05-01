/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('cvcScreenMessage', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/screen_message.html',
            controller: 'CvcScreenMessageController'
        };
    }
})();
