/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('HighSchoolCardController', Controller);

    Controller.$inject = ['$scope', '$translate', 'AppConstants', '$mdDialog'];
    function Controller($scope, $translate, AppConstants, $mdDialog) {
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
            $scope.tempData = angular.copy(AppConstants.CV_OBJECTS.HIGH_SCHOOL_OBJECT);

            if(!$scope.editMode){
                $scope.toggleEditMode();
            }
        }

        $scope.save = function(){
            console.log("Saving with data", $scope.tempData);
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
                $scope.clearAndEdit();
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

        var fixDates = function(){
            if(typeof($scope.educationdata.fromDate) === "string") {
                $scope.educationdata.fromDate = new Date($scope.educationdata.fromDate);
            }

            if(typeof($scope.educationdata.toDate) === "string") {
                $scope.educationdata.toDate = new Date($scope.educationdata.toDate);
            }
        }

        var init = function(){
            fixDates();

            if(hasNullValues($scope.educationdata)){
                $scope.edit();
            }
        }

        init();
    }
})();