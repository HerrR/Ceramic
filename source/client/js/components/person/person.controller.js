/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcPersonController', Controller);

    Controller.$inject = ['$scope', 'ProfileService', 'AppConstants'];

    function Controller($scope, ProfileService, AppConstants) {
        $scope.IMAGES = AppConstants.IMAGES;
    }
})();
