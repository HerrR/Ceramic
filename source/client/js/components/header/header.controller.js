/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcHeaderController', Controller);

    Controller.$inject = ['$scope', 'ProfileService'];

    function Controller($scope, ProfileService) {
        $scope.gotoHome = function() {
            // TODO
            console.log('gotoHome');
        };

        $scope.signOut = function() {
            ProfileService.signOut();
        };

        $scope.hasSignedIn = function() {
            return ProfileService.hasSignedIn();
        };

        $scope.isPerson = function() {
            return ProfileService.isPerson();
        };

        $scope.isCompany = function() {
            return ProfileService.isCompany();
        };
    }
})();
