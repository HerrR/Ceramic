/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$state','ProfileService', 'ScreenMessageService'];

    function MainController($scope, $state, ProfileService, ScreenMessageService) {

        $scope.currentState = function(){
            return $state.current.name;
        };
        
        $scope.hasSignedIn = function() {
            return ProfileService.hasSignedIn();
        };

        $scope.isPerson = function() {
            return ProfileService.isPerson();
        };

        $scope.isCompany = function() {
            return ProfileService.isCompany();
        };
    }
})();