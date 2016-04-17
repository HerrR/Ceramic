/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcWelcomeController', Controller);

    Controller.$inject = ['$scope', 'ProfileService', 'AppConstants'];

    function Controller($scope, ProfileService, AppConstants) {
        $scope.IMAGES = AppConstants.IMAGES;

        $scope.testSignIn = function(type) {
            ProfileService.signIn(type);
        };

        $scope.hasSignedIn = function() {
            return ProfileService.hasSignedIn();
        };
    }
})();
