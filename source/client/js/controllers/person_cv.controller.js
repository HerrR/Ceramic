/* global angular */
/* global document */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('PersonCvController', Controller);

    Controller.$inject = ['$scope', 'ProfileService', '$http', '$filter', 'AppConstants', 'UtilityService'];

    function Controller($scope, ProfileService, $http, $filter, AppConstants, UtilityService) {
        $scope.profile = ProfileService.getProfile();

        $scope.cvData = angular.copy($scope.profile.person.cv);
        if($scope.cvData.high_school === undefined){
            $scope.cvData.high_school = angular.copy(AppConstants.CV_OBJECTS.EDUCATION_OBJECT);
        }
    
        $scope.addEducation = function(){
            var education = angular.copy(AppConstants.CV_OBJECTS.EDUCATION_OBJECT);
            $scope.cvData.education.push(education);
        }

        $scope.addExperience = function(){
            var experience = angular.copy(AppConstants.CV_OBJECTS.WORK_OBJECT);
            $scope.cvData.experience.push(experience);
        }

        $scope.saveEducation = function(index, data){
            $scope.cvData.education[index] = data;
            $scope.updateEducation();
        }

        $scope.saveExperience = function(index, data){
            $scope.cvData.experience[index] = data;
            $scope.updateExperience();
        }

        $scope.removeEducation = function(index){
            $scope.cvData.education.splice(index, 1);
            $scope.updateEducation();
        }

        $scope.removeExperience = function(index){
            $scope.cvData.experience.splice(index, 1);
            $scope.updateEducation();
        }

        $scope.updateHighschool = function(data){
            $scope.cvData.high_school = data;
            $scope.profile.person.cv.high_school = angular.copy($scope.cvData.high_school);
            $scope.saveCv();
        }

        $scope.clearHighschool = function(){
            $scope.cvData.high_school = angular.copy(AppConstants.CV_OBJECTS.EDUCATION_OBJECT);
            delete $scope.profile.person.cv.high_school;
        }

        $scope.updateEducation = function(){
            $scope.profile.person.cv.education = [];
        
            for(var index in $scope.cvData.education){
                if(!hasNullValues($scope.cvData.education[index])){
                    $scope.profile.person.cv.education.push($scope.cvData.education[index]);
                }
            }

            $scope.saveCv();
        }

        $scope.updateExperience = function(){
            $scope.profile.person.cv.experience = [];

            for(var index in $scope.cvData.experience){
                if(!hasNullValues($scope.cvData.experience[index])){
                    $scope.profile.person.cv.experience.push($scope.cvData.experience[index]);
                }
            }

            $scope.saveCv();
        }

        

        $scope.saveCv = function(){
            // TODO Update CV in database
            console.log(
                "Save CV",
                $scope.profile.person.cv
            )
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
    }
})();