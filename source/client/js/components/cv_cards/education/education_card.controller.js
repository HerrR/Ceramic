/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('EducationCardController', Controller);

    Controller.$inject = ['$scope', '$mdDialog', '$translate', '$filter', 'ProfileService', 'DatasetService', 'AppConstants'];
    function Controller($scope, $mdDialog ,$translate, $filter, ProfileService, DatasetService, AppConstants) {
        $scope.tempData = {};

        DatasetService.getAsync(AppConstants.DATASETS.DEGREE.NAME, function(data) {
            $scope.degrees = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.FACULTY.NAME, function(data) {
            $scope.faculties = data.list;
        });

        $scope.getTextKey = function(field){
            if(!$scope.educationdata[field]){
                console.error("Field not found", field);
                return;
            }

            if(field === "degree") {
                for(var i = 0; i < $scope.degrees.length ; i++){
                    if($scope.degrees[i].id === $scope.educationdata.degree){
                        return $scope.degrees[i].textKey;
                    }
                }
            }

            if(field === "faculty") {
                for(var i = 0; i < $scope.faculties.length ; i++){
                    if($scope.faculties[i].id === $scope.educationdata.faculty){
                        return $scope.faculties[i].textKey;
                    }
                }
            }

            if(field === "major") {
                for(var i = 0 ; i < $scope.faculties.length ; i++){
                    
                    if($scope.faculties[i].id === $scope.educationdata.faculty){
                        // console.log("Looping through "+ $scope.faculties[i].major.length +" majors");
                        for(var j = 0 ; j < $scope.faculties[i].major.length ; j++){
                            // console.log($scope.faculties[i].major[j].id);
                            // console.log($scope.faculties[i].major[j].id + "  === " + $scope.educationdata.major + " ? " + ($scope.faculties[i].major[j].id === $scope.educationdata.major));
                            if($scope.faculties[i].major[j].id === $scope.educationdata.major){
                                return $scope.faculties[i].major[j].textKey;
                            }
                        }
                    }
                }
            }
        }

        $scope.resetMajor = function(){
            $scope.tempData.major = null;
        }

        $scope.majors = function(){
            if($scope.tempData.faculty){
                for(var i = 0; i < $scope.faculties.length ; i++){
                    if($scope.faculties[i].id === $scope.tempData.faculty){
                        return $scope.faculties[i].major;
                    }
                }
            } 
            return undefined;
        };

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