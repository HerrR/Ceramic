/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('EducationCardController', Controller);

    Controller.$inject = ['$scope', '$mdDialog', '$translate', '$filter', 'ProfileService', 'ScreenMessageService', 'DatasetService', 'AppConstants', 'UtilityService'];
    function Controller($scope, $mdDialog ,$translate, $filter, ProfileService, ScreenMessageService, DatasetService, AppConstants, UtilityService) {
        // Enable or disable editmode depending on what was passed from parent
        // $scope.editMode = typeof($scope.editmode) === "boolean" ? $scope.editmode : false;

        $scope.tempData = {};
        
        $scope.toggleEditMode = function(){
            $scope.editMode = !$scope.editMode;
        }

        $scope.edit = function(){
            $scope.tempData = angular.copy($scope.educationdata);
            if(!$scope.editMode){
                $scope.toggleEditMode();
            }
        }

        $scope.clearAndEdit = function(){
            $scope.tempData = angular.copy(AppConstants.CV_OBJECTS.EDUCATION_OBJECT);
            if(!$scope.editMode){
                $scope.toggleEditMode();
            }
        }

        $scope.save = function(){
            $scope.educationdata = angular.copy($scope.tempData);
            $scope.onsave({data:$scope.educationdata});
            $scope.toggleEditMode();
        }

        $scope.cancel = function(){
            if(hasNullValues($scope.educationdata)){
                $scope.ondelete();
            }
            $scope.toggleEditMode();
        }

        $scope.canBeCancelled = function(){
            if(($scope.type === "high_school") && hasNullValues($scope.educationdata)){
                return false;
            } 
            return true;
        }

        $scope.delete = function(){
            $scope.showConfirmDelete();
        }

        $scope.showConfirmDelete = function(ev){
            var confirm = $mdDialog.confirm()
                .title($translate.instant('dialog.education.delete_row.title'))
                .textContent($translate.instant('dialog.education.delete_row.text_content'))
                .ariaLabel('Remove?')
                .targetEvent(ev)
                .ok($translate.instant('dialog.ok'))
                .cancel($translate.instant('dialog.cancel'));

            $mdDialog.show(confirm).then(function() {
                // Confirmed
                $scope.ondelete();
                if($scope.type="high_school"){
                    $scope.clearAndEdit();
                }
                // $scope.edit();
            }, function() {
                // Cancel
            });
        }

        var hasNullValues = function(obj){
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if(obj[key] === null){
                        return true;
                    }
                }
            }
            return false;
        }

        var init = function(){
            if(hasNullValues($scope.educationdata)){
                $scope.edit();
            }
        }

        init();
    }
})();