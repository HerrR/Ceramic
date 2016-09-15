/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcCompanyController', Controller);

    Controller.$inject = ['$scope', 'ProfileService', 'ScreenMessageService'];

    function Controller($scope, ProfileService, ScreenMessageService) {
        $scope.profile = ProfileService.getProfile();

        $scope.hasSignedIn = function() {
            return ($scope.profile !== null && $scope.profile !== undefined);
        };

        $scope.hasScreenMessage = function() {
            return ScreenMessageService.hasMessage();
        };

        $scope.save = function() {
            // TODO
        };

        $scope.cancel = function() {
            // TODO
        };

        $scope.signOut = function() {
            $scope.profile = null;
            ProfileService.signOut();
        };
    }
})();
