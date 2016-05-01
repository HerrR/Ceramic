/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcScreenMessageController', Controller);

    Controller.$inject = ['$scope', 'ScreenMessageService'];

    function Controller($scope, ScreenMessageService) {
        $scope.getType = function() {
            return ScreenMessageService.getMessage().type;
        };

        $scope.getMessage = function() {
            return ScreenMessageService.getMessage().message;
        };
    }
})();
