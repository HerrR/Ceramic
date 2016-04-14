/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcCompanyController', Controller);

    Controller.$inject = ['$scope', 'ProfileService'];

    function Controller($scope, ProfileService) {
        $scope.hasSignedIn = function() {
            return ProfileService.hasSignedIn();
        };

        $scope.isCompany = function() {
            return ProfileService.isCompany();
        };
    }
})();
