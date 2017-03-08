/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CompensationCardController', Controller);

    Controller.$inject = ['$scope', 'ProfileService', 'DatasetService', 'AppConstants'];

    function Controller($scope, ProfileService, DatasetService, AppConstants) {
        $scope.editMode = false;
        $scope.tempData = {};
        $scope.currency = "SEK";

        $scope.toggleEditMode = function(){
            $scope.editMode = !$scope.editMode;
        }

        $scope.edit = function(){
            $scope.tempData.compensation = angular.copy($scope.compensation);
            $scope.toggleEditMode();
        }

        $scope.save = function(){
            $scope.compensation = angular.copy($scope.tempData.compensation);
            $scope.onupdate({data:$scope.compensation});
            $scope.toggleEditMode();
        }

        $scope.cancel = function(){
            $scope.tempData = {};
            $scope.toggleEditMode();
        }

        $scope.hasCompensation = function(){
            return $scope.compensation != undefined;
        }

        var init = function(){
            if(!$scope.compensation){
                $scope.edit();
            }
        }

        init();
    }
})();