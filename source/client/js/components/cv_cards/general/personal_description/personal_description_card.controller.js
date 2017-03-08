/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('PersonalDescriptionCardController', Controller);

    Controller.$inject = ['$scope', 'ProfileService', 'DatasetService', 'AppConstants', '$mdDialog', '$translate'];

    function Controller($scope, ProfileService, DatasetService, AppConstants, $mdDialog, $translate) {
        $scope.editMode = false;
        $scope.tempData = {};

        $scope.toggleEditMode = function(){
            $scope.editMode = !$scope.editMode;
        }

        $scope.edit = function(){
            if($scope.personaldescription) {
                $scope.tempData.personalDescription = angular.copy($scope.personaldescription);
            }

            if(!$scope.editMode){
                $scope.toggleEditMode();
            }
        }

        $scope.clear = function(){
            $scope.showConfirmClear();
        }

        $scope.save = function(){
            $scope.personaldescription = angular.copy($scope.tempData.personalDescription);
            $scope.onsave({data:$scope.personaldescription});
            $scope.toggleEditMode();
        }

        $scope.cancel = function(){
            $scope.tempData = {};
            $scope.toggleEditMode();
        }

        // TODO: Update this text or remove clearing option
        $scope.showConfirmClear = function(ev){
            var confirm = $mdDialog.confirm()
                .title($translate.instant('dialog.education.delete_row.title'))
                .textContent($translate.instant('dialog.education.delete_row.text_content'))
                .ariaLabel('Clear?')
                .targetEvent(ev)
                .ok($translate.instant('dialog.ok'))
                .cancel($translate.instant('dialog.cancel'));

            $mdDialog.show(confirm).then(function() {
                $scope.personaldescription = undefined;
                $scope.ondelete();
                $scope.edit();
            });
        }

        var init = function(){
            if(!$scope.personaldescription) {
                $scope.edit();
            }
        }

        init();
    }
})();