/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('WorkCardController', Controller);

    Controller.$inject = ['$scope', '$mdDialog', '$translate', '$filter', 'ProfileService', 'DatasetService', 'AppConstants'];

    function Controller($scope, $mdDialog, $translate, $filter, ProfileService, DatasetService, AppConstants) {
        $scope.tempData = {};
        $scope.industries = [];
        $scope.competenceHierarchy = [];

        $scope.disciplines = function(){
            if($scope.tempData.profession){
                for(var i = 0; i < $scope.competenceHierarchy.length; i++){
                    if($scope.competenceHierarchy[i].id === $scope.tempData.profession){
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
                    if(disciplines[i].id === $scope.tempData.discipline){
                        return disciplines[i].role;
                    }
                }
            }
            return undefined;
        }

        $scope.keyCompetencies = function(){
            if($scope.tempData.role){
                var roles = $scope.roles();
                for(var i = 0; i < roles.length ; i ++ ){
                    if(roles[i].id === $scope.tempData.role){
                        return roles[i].key_competency;
                    }
                }
            }
            return undefined;
        }

        var getExperienceObject = function(field){
            if(field === "industry"){
                for(var i = 0; i < $scope.industries.length ; i++ ){
                    if($scope.industries[i].id === $scope.experiencedata.industry){
                        return $scope.industries[i];
                    }
                }
            }

            if(field === "profession"){
                for(var i = 0; i < $scope.competenceHierarchy.length; i++){
                    if($scope.competenceHierarchy[i].id === $scope.experiencedata.profession){
                        return $scope.competenceHierarchy[i];
                    }
                }
            }

            if(field === "discipline"){
                var profession = getExperienceObject('profession');
                for(var i = 0; i < profession.discipline.length ; i++){
                    if(profession.discipline[i].id === $scope.experiencedata.discipline){
                        return profession.discipline[i];
                    }
                }
            }

            if(field === "role"){
                var discipline = getExperienceObject('discipline');
                for(var i = 0 ; i < discipline.role.length; i++){
                    if(discipline.role[i].id === $scope.experiencedata.role){
                        return discipline.role[i];
                    }
                }
            }
        }

        $scope.getTextKey = function(field){
            if(!$scope.experiencedata[field]){
                console.error("Field not found ", field);
                return;
            }

            if(getExperienceObject(field)){
                return getExperienceObject(field).textKey;
            } else {
                console.error("No experience object found for given field :" + field );
            }
        }

        $scope.getKeyCompetencyTextKey = function(key){
            if(getExperienceObject('role')){
                var potentialCompetencies = getExperienceObject('role').key_competency;
                for(var i = 0; i < potentialCompetencies.length; i++){
                    if(potentialCompetencies[i].id === key){
                        return potentialCompetencies[i].textKey;
                    }
                }
            }
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
            $scope.resetKeyCompetencies();
        }

        $scope.resetKeyCompetencies = function(){
            $scope.tempData.keyCompetencies = null;
        }
        
        $scope.addResponsibility = function(){
            var responsibility = angular.copy(AppConstants.CV_OBJECTS.RESPONSIBILITY_OBJECT);
            $scope.tempData.responsibilities.push(responsibility);
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


        $scope.save = function(){
            removeNulls();
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

        $scope.removeResponsibility = function(resp){
            for( var i = 0 ; i < $scope.tempData.responsibilities.length ; i++){
                if(angular.equals($scope.tempData.responsibilities[i], resp)){
                    $scope.tempData.responsibilities.splice(i, 1);
                    break;
                }
            }
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

        var removeNulls = function(){
            for( var i = $scope.tempData.responsibilities.length - 1  ; i >= 0 ; i--){
                if(!$scope.tempData.responsibilities[i].resptype){
                    $scope.tempData.responsibilities.splice(i, 1);
                    continue;
                }

                if(!$scope.tempData.responsibilities[i].amount){
                    $scope.tempData.responsibilities.splice(i, 1);
                    continue;
                }
            }
        }

        $scope.tempDataHasNulls = function(){
            return hasNullValues($scope.tempData);
        }

        var init = function(){
            // If not all fields are filled out, enter edit mode
            if(hasNullValues($scope.experiencedata)){
                $scope.edit();
            }

            // Fetch industries
            DatasetService.getAsync(AppConstants.DATASETS.INDUSTRY.NAME, function(data) {
                $scope.industries = data.list;
            });

            // Fetch competency hierarchy
            DatasetService.getAsync(AppConstants.DATASETS.COMPETENCY_HIERACHY.NAME, function(data) {
                $scope.competenceHierarchy = data.list;
            });
        }

        init();
    }
})();