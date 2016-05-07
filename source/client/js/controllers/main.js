/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', 'ProfileService', 'ScreenMessageService'];

    function MainController($scope, ProfileService, ScreenMessageService) {
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