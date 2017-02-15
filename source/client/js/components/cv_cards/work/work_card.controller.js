/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('WorkCardController', Controller);

    Controller.$inject = ['$scope', '$mdDialog', '$translate', '$filter', 'ProfileService', 'ScreenMessageService', 'DatasetService', 'AppConstants', 'UtilityService'];

    function Controller($scope, $mdDialog, $translate, $filter, ProfileService, ScreenMessageService, DatasetService, AppConstants, UtilityService) {
        $scope.tempData = {};
        $scope.selectedIndustry = undefined;

        DatasetService.getAsync(AppConstants.DATASETS.INDUSTRY.NAME, function(data) {
            // console.log("industries", data.list);
            // $scope.industries = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.PROFESSION.NAME, function(data) {
            // console.log("professions", data.list);
            $scope.professions = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.COMPETENCY_HIERACHY.NAME, function(data) {
            // console.log("competence hierarchy", data.list);
            // competenceHierarchy == industries
            // $scope.industries = data.list;
            console.log(data.list);
            $scope.competenceHierarchy = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.ROLE.NAME, function(data) {
            // console.log("Roles", data.list);
            $scope.roles = data.list;
        });

        $scope.disciplines = function(){
            if($scope.tempData.industry){
                for(var i = 0; i < $scope.competenceHierarchy.length; i++){
                    if($scope.competenceHierarchy[i].id === $scope.tempData.industry.id){
                        return $scope.competenceHierarchy[i].discipline;
                    }
                }
            }
            return undefined;
        }

        $scope.roles = function(){
            if($scope.tempData.discipline){
                var disciplines = $scope.disciplines();
                for(var i = 0; i < disciplines.length ; i++ ){
                    if(disciplines[i].id === $scope.tempData.discipline.id){
                        return disciplines[i].role;
                    }
                }
            }

            return undefined;
        }

        $scope.resetIndustry = function(){
            $scope.tempData.industry = null;
            $scope.resetDiscipline();
        }

        $scope.resetDiscipline = function(){
            $scope.tempData.discipline = null;
            $scope.resetRole();
        }

        $scope.resetRole = function(){
            $scope.tempData.role = null;
        }


        $scope.mjao = function(){
            console.log($scope.tempData);
        }
        
        $scope.toggleEditMode = function(){
            $scope.editMode = !$scope.editMode;
        }

        $scope.edit = function(){
            $scope.tempData = angular.copy($scope.experiencedata);
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
            $scope.experiencedata = angular.copy($scope.tempData);
            $scope.onsave({data:$scope.experiencedata});
            $scope.toggleEditMode();
        }

        $scope.cancel = function(){
            if(hasNullValues($scope.experiencedata)){
                $scope.ondelete();
            }
            $scope.toggleEditMode();
        }

        $scope.delete = function(){
            $scope.showConfirmDelete();
        }

        $scope.showConfirmDelete = function(ev){
            var confirm = $mdDialog.confirm()
                .title($translate.instant('dialog.experience.delete_row.title'))
                .textContent($translate.instant('dialog.experience.delete_row.text_content'))
                .ariaLabel('Remove?')
                .targetEvent(ev)
                .ok($translate.instant('dialog.ok'))
                .cancel($translate.instant('dialog.cancel'));

            $mdDialog.show(confirm).then(function() {
                // Confirmed
                $scope.ondelete();
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

        $scope.tempDataHasNulls = function(){
            return hasNullValues($scope.tempData);
        }

        var init = function(){
            if(hasNullValues($scope.experiencedata)){
                $scope.edit();
            }
        }

        init();
    }
})();