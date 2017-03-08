/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('LanguageCardController', Controller);

    Controller.$inject = ['$scope', 'ProfileService', 'DatasetService', 'AppConstants'];

    function Controller($scope, ProfileService, DatasetService, AppConstants) {
        $scope.tempData = [];
        $scope.editMode = false;

        $scope.toggleEditMode = function(){
            $scope.editMode = !$scope.editMode;
        }

        $scope.edit = function(){
            console.log("Edit mode!");
            if($scope.languages) {
                $scope.tempData = angular.copy($scope.languages);
            }

            if(!$scope.editMode){
                $scope.toggleEditMode();
            }
        }

        $scope.getLanguageLevelInfo = function(level){
            if(level){
                if(level <= $scope.languageLevels.length){
                   return $scope.languageLevels[level - 1];
                }
            }
        }

        $scope.save = function(){
            removeNulls($scope.tempData);
            $scope.languages = angular.copy($scope.tempData);
            $scope.onupdate({data:$scope.languages});
            $scope.toggleEditMode();
        }

        $scope.cancel = function(){
            $scope.tempData = [];
            $scope.toggleEditMode();
        }

        $scope.addLanguage = function(){
            $scope.tempData.push(angular.copy(AppConstants.CV_OBJECTS.LANGUAGE_OBJECT))
        }

        $scope.removeLanguage = function(languageObjTobeDeleted){
            for(var i = 0; i < $scope.tempData.length; i++ ){
                if(angular.equals($scope.tempData[i], languageObjTobeDeleted)){
                    $scope.tempData.splice(i, 1);
                    break;
                }
            }
        }

        $scope.emptyLanguages = function(){
            return $scope.languages.length == 0;
        }

        var removeNulls = function(){
            for(var i = $scope.tempData.length-1 ; i >= 0 ; i--){
                if(!$scope.tempData[i].name){
                    $scope.tempData.splice(i, 1);
                    continue;
                }

                if(!$scope.tempData[i].level){
                    $scope.tempData.splice(i, 1);
                    continue;
                }
            }
        }

        // var validateLanguageObjects = function(languages){
        //     for(var langIndex in languages){
        //         var langObj = languages[langIndex];

        //         if(typeof(langObj.name) != "string"){
        //             console.log("Lang obj name is not a string", langObj);
        //         }

        //         if(typeof(langObj.level != "int")){
        //             console.log("Lang obj lvl is not an int", langObj);
        //         }
        //     }
        // }

        // var hasNullValues = function(obj){
        //     for (var key in obj) {
        //         if (obj.hasOwnProperty(key)) {
        //             if(obj[key] === null){
        //                 return true;
        //             }
        //         }
        //     }
        //     return false;
        // }

        var init = function(){
            DatasetService.getAsync(AppConstants.DATASETS.LANGUAGE_LEVELS.NAME, function(data){
                $scope.languageLevels = data.list;
                console.log($scope.languageLevels);
            });
        }

        init();
        
    }
})();



// $scope.toggleEditMode = function(){
//             $scope.editMode = !$scope.editMode;
//         }

//         $scope.edit = function(){
//             if($scope.personaldescription) {
//                 $scope.tempData.personalDescription = angular.copy($scope.personaldescription);
//             }

//             if(!$scope.editMode){
//                 $scope.toggleEditMode();
//             }
//         }

//         $scope.clear = function(){
//             $scope.showConfirmClear();
//         }

//         $scope.save = function(){
//             $scope.personaldescription = angular.copy($scope.tempData.personalDescription);
//             $scope.onsave({data:$scope.personaldescription});
//             $scope.toggleEditMode();
//         }

//         $scope.cancel = function(){
//             $scope.tempData = {};
//             $scope.toggleEditMode();
//         }

//         $scope.showConfirmClear = function(ev){
//             var confirm = $mdDialog.confirm()
//                 .title($translate.instant('dialog.education.delete_row.title'))
//                 .textContent($translate.instant('dialog.education.delete_row.text_content'))
//                 .ariaLabel('Clear?')
//                 .targetEvent(ev)
//                 .ok($translate.instant('dialog.ok'))
//                 .cancel($translate.instant('dialog.cancel'));

//             $mdDialog.show(confirm).then(function() {
//                 $scope.personaldescription = undefined;
//                 $scope.ondelete();
//                 $scope.edit();
//             });
//         }

//         var init = function(){
//             if(!$scope.personaldescription) {
//                 $scope.edit();
//             }
//         }