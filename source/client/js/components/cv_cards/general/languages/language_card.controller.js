/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('LanguageCardController', Controller);

    Controller.$inject = ['$scope', '$filter', 'ProfileService', 'ScreenMessageService', 'DatasetService', 'AppConstants', 'UtilityService'];

    function Controller($scope, $filter, ProfileService, ScreenMessageService, DatasetService, AppConstants, UtilityService) {
        
    }
})();