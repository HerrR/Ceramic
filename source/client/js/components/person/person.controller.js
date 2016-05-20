/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcPersonController', Controller);

    Controller.$inject = ['$scope', '$http', 'ProfileService', 'AppConstants', 'ScreenMessageService'];

    function Controller($scope, $http, ProfileService, AppConstants, ScreenMessageService) {
        $scope.MIN_DATE = "1900-01-01";
        $scope.MAX_DATE = new Date(); // TODO: at least 16 years old

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

        $scope.getTabFile = function(tab) {
            return 'partials/person/' + tab + '.html';
        };

        $scope.getSidebar = function() {
            return 'partials/person/sidebar.html';
        };

        $scope.getToolbar = function() {
            return 'partials/person/toolbar.html';
        };

        // TODO: cant just use the JSON.stringify as the hash value
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
