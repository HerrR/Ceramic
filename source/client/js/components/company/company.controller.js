/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcCompanyController', Controller);

    Controller.$inject = ['$scope', '$filter', 'ProfileService', 'ScreenMessageService', 'DatasetService', 'AppConstants', 'UtilityService'];

    function Controller($scope, $filter, ProfileService, ScreenMessageService, DatasetService, AppConstants, UtilityService) {
        $scope.viewModel = {};

        $scope.profile = ProfileService.getProfile();
        $scope.oldHashCode = UtilityService.computeHashCode($scope.profile);
        $scope.newHashCode = UtilityService.computeHashCode($scope.profile);
        $scope.valuesChanged = false;

         DatasetService.getAsync(AppConstants.DATASETS.COMPANY_FORMS.NAME, function(data) {
            $scope.companyInfoForm = data['info'];
        });

        $scope.viewModel.profile = ProfileService.getProfile();
        $scope.viewModel.answerChanged = function() {
            $scope.newHashCode = UtilityService.computeHashCode($scope.profile);
            $scope.valuesChanged = ($scope.newHashCode !== $scope.oldHashCode);
        };

        DatasetService.getAsync(AppConstants.DATASETS.INDUSTRY.NAME, function(data) {
            $scope.industries = data.list;
            $scope.viewModel.industries = [];

            for (var i = 0; i < data.list.length; ++i) {
                $scope.viewModel.industries.push({
                    id: data.list[i].id,
                    textKey: $filter('translate')(data.list[i].textKey)
                });
            }
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
            $scope.newHashCode = UtilityService.computeHashCode($scope.profile);
            $scope.valuesChanged = ($scope.newHashCode !== $scope.oldHashCode);
        };

        $scope.save = function() {
            var validationErrors = $scope.validate();

            if (validationErrors.length === 0) {
                ProfileService.save(function(data, err) {
                    if (err === null) {
                        $scope.profile = data;
                        $scope.oldHashCode = UtilityService.computeHashCode($scope.profile);
                        $scope.newHashCode = UtilityService.computeHashCode($scope.profile);
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
                    $scope.oldHashCode = UtilityService.computeHashCode($scope.profile);
                    $scope.newHashCode = UtilityService.computeHashCode($scope.profile);
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
})();
