/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcPersonController', Controller);

    Controller.$inject = ['$scope', 'ProfileService', 'AppConstants'];

    function Controller($scope, ProfileService, AppConstants) {
        $scope.IMAGES = AppConstants.IMAGES;
        $scope.MIN_DATE = new Date(1940,0,1,0,0,0,0);
        $scope.MAX_DATE = new Date();
        $scope.person = ProfileService.getProfile().person;
        $scope.oldHashCode = computeHashCode($scope.person);
        $scope.newHashCode = computeHashCode($scope.person);
        $scope.valuesChanged = false;

        $scope.answerChanged = function() {
            $scope.newHashCode = computeHashCode($scope.person);
            $scope.valuesChanged = ($scope.newHashCode != $scope.oldHashCode);
        };

        $scope.save = function() {
            // TODO: validation

            ProfileService.save(function(data) {
                $scope.person = data.person;
                $scope.oldHashCode = computeHashCode($scope.person);
                $scope.newHashCode = computeHashCode($scope.person);
                $scope.valuesChanged = false;
            });
        };

        $scope.cancel = function() {
            ProfileService.reload(function (data) {
                $scope.person = data.person;
                $scope.oldHashCode = computeHashCode($scope.person);
                $scope.newHashCode = computeHashCode($scope.person);
                $scope.valuesChanged = false;
            });
        };

        function computeHashCode(object) {
            var data = JSON.stringify(object);
            var hash = 0, i, chr, len;

            if (data.length === 0) {
                return hash;
            }

            for (i = 0, len = data.length; i < len; i++) {
                chr = data.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            return hash;
        }
    }
})();
