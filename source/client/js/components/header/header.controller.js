/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcHeaderController', Controller);

    Controller.$inject = ['$scope', 'ProfileService'];

    function Controller($scope, ProfileService) {
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
