/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('ComputerSkillsCardController', Controller);

    Controller.$inject = ['$scope', 'ProfileService', 'DatasetService', 'AppConstants'];

    function Controller($scope, ProfileService, DatasetService, AppConstants) {
        
    }
})();