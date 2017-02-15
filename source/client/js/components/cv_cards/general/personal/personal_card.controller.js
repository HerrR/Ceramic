/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('PersonalCardController', Controller);

    Controller.$inject = ['$scope', '$filter', 'ProfileService', 'ScreenMessageService', 'DatasetService', 'AppConstants', 'UtilityService'];

    function Controller($scope, $filter, ProfileService, ScreenMessageService, DatasetService, AppConstants, UtilityService) {
        $scope.init = function(type){
            console.log(type);
        }
    }
})();