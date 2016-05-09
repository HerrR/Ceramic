/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcPersonController', Controller);

    Controller.$inject = ['$scope', '$http', 'ProfileService', 'AppConstants', 'ScreenMessageService'];

    function Controller($scope, $http, ProfileService, AppConstants, ScreenMessageService) {
        $scope.MIN_DATE = new Date(1900,0,1,0,0,0,0);
        $scope.MAX_DATE = new Date();
        $scope.person = ProfileService.getProfile().person;
        $scope.oldHashCode = computeHashCode($scope.person);
        $scope.newHashCode = computeHashCode($scope.person);
        $scope.valuesChanged = false;

        $http.get(AppConstants.PATHS.DATASETS + 'countries', {}).then(function(resp) {
            var items = [];
            for (var key in resp.data) {
                items.push({display: resp.data[key]});
            }

            $scope.countries = items;
        }, function() {
            // TODO: handle error
        });

        $scope.hasScreenMessage = function() {
            return ScreenMessageService.hasMessage();
        };

        $scope.answerChanged = function() {
            $scope.newHashCode = computeHashCode($scope.person);
            $scope.valuesChanged = ($scope.newHashCode != $scope.oldHashCode);
        };

        $scope.save = function() {
            // TODO: validation

            ProfileService.save(function(data, err) {
                if (err === null) {
                    $scope.person = data.person;
                    $scope.oldHashCode = computeHashCode($scope.person);
                    $scope.newHashCode = computeHashCode($scope.person);
                    $scope.valuesChanged = false;
                    ScreenMessageService.info('message.saved_success');
                }
            });
        };

        $scope.cancel = function() {
            ProfileService.reload(function (data, err) {
                if (err === null) {
                    $scope.person = data.person;
                    $scope.oldHashCode = computeHashCode($scope.person);
                    $scope.newHashCode = computeHashCode($scope.person);
                    $scope.valuesChanged = false;
                    ScreenMessageService.info('message.cancel_success');
                }
            });
        };

        $scope.signOut = function() {
            ProfileService.signOut();
        };

        $scope.hasSignedIn = function() {
            return ProfileService.hasSignedIn();
        };

        $scope.getMatches = function(filter) {
            var filtered = [];
            var filterText = filter.toLowerCase();
            for (var country in $scope.countries) {
                console.log('obj',$scope.countries[country]);
                if ($scope.countries[country].display.toLowerCase().indexOf(filterText) === 0) {
                    filtered.push($scope.countries[country]);
                }
            }

            return filtered;
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
