/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcCompanyController', Controller);

    Controller.$inject = ['$scope', 'ProfileService', 'ScreenMessageService', 'DatasetService', 'AppConstants'];

    function Controller($scope, ProfileService, ScreenMessageService, DatasetService, AppConstants) {
        $scope.profile = ProfileService.getProfile();
        $scope.oldHashCode = computeHashCode($scope.profile);
        $scope.newHashCode = computeHashCode($scope.profile);
        $scope.valuesChanged = false;

        DatasetService.getAsync(AppConstants.DATASETS.INDUSTRY.NAME, function(data) {
            $scope.industries = data.list;
        });

        $scope.newSearchCriteria = function() {
            $scope.selectedSearchCriteria = {
                education: {}
                // TODO: add more parameters
            };
        };

        $scope.editSearchCriteria = function(searchCriteria) {
            $scope.selectedSearchCriteria = searchCriteria;
        };

        $scope.cancelEditSearchCriteria = function() {
            $scope.selectedSearchCriteria = undefined;
        };

        $scope.saveSelectedSearchCriteria = function() {
            if ($scope.selectedSearchCriteria) {
                // TODO: $scope.selectedSearchCriteria
            }
        };

        $scope.cancelSaveSearchCriteria = function() {
            // TODO
        };

        $scope.isSelectedInCriteria = function(key, level) {
            if ($scope.selectedSearchCriteria[key]) {
                return ($scope.selectedSearchCriteria[key] === level);
            }
            return false;
        };

        $scope.selectInCriteria = function(key, level) {
            $scope.selectedSearchCriteria[key] = level;
        };

        $scope.hasSignedIn = function() {
            return ($scope.profile !== null && $scope.profile !== undefined);
        };

        $scope.hasScreenMessage = function() {
            return ScreenMessageService.hasMessage();
        };

        $scope.signOut = function() {
            $scope.profile = null;
            ProfileService.signOut();
        };

        $scope.answerChanged = function() {
            $scope.newHashCode = computeHashCode($scope.profile);
            $scope.valuesChanged = ($scope.newHashCode != $scope.oldHashCode);
        };

        $scope.save = function() {
            var validationErrors = $scope.validate();

            if (validationErrors.length === 0) {
                ProfileService.save(function(data, err) {
                    if (err === null) {
                        $scope.profile = data;
                        $scope.oldHashCode = computeHashCode($scope.profile);
                        $scope.newHashCode = computeHashCode($scope.profile);
                        $scope.valuesChanged = false;
                        ScreenMessageService.info('message.saved_success');
                    }
                });
            }

            return validationErrors;
        };

        $scope.cancel = function() {
            ProfileService.reload(function (data, err) {
                if (err === null) {
                    $scope.profile = data;
                    $scope.oldHashCode = computeHashCode($scope.profile);
                    $scope.newHashCode = computeHashCode($scope.profile);
                    $scope.valuesChanged = false;
                    ScreenMessageService.info('message.cancel_success');
                }
            });
        };

        $scope.validate = function() {
            // TODO: validate the form and return validation errors.
            return [];
        };

        $scope.getTabFile = function(tab) {
            return 'partials/company/tabs/' + tab + '.html';
        };
    }

    function computeHashCode(object) {
        if (object === null || object === undefined) {
            return '';
        }

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
})();
