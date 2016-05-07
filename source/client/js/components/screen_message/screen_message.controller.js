/* global angular */
/* global $ */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcScreenMessageController', Controller);

    Controller.$inject = ['$scope', 'ScreenMessageService', 'AppConstants'];

    function Controller($scope, ScreenMessageService, AppConstants) {
        setTimeout(function() {
            $('#screenMessage').removeClass('bounceInDown');
            $('#screenMessage').addClass('bounceOutUp');
            ScreenMessageService.clear();
        }, AppConstants.MESSAGE_LIFE);

        $scope.class = 'animated bounceInDown cvc-screen-message cvc-screen-message-' + ScreenMessageService.getMessage().type.toLowerCase();

        $scope.getMessage = function() {
            return ScreenMessageService.getMessage().message;
        };
    }
})();
