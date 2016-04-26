/* global angular */
/* global window */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcWelcomeController', Controller);

    Controller.$inject = ['$scope', 'ProfileService', 'AppConstants'];

    function Controller($scope, ProfileService, AppConstants) {
        $scope.IMAGES = AppConstants.IMAGES;

        ProfileService.signIn('PERSON');

        $scope.testSignIn = function(type) {
            window.location.href = AppConstants.AUTH_PATH + 'facebook/login';
        };

        $scope.hasSignedIn = function() {
            return ProfileService.hasSignedIn();
        };
    }
})();
