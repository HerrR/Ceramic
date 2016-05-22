/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcFooterController', Controller);

    Controller.$inject = ['$scope', '$http', 'AppConstants'];

    function Controller($scope, $http, AppConstants) {
        $http.get(AppConstants.PATHS.DATASETS + 'translations', {}).then(function(data) {
            $scope.translations = data;
        }, function(err) {
            // TODO
        });

        $scope.changeLanguage = function(translation) {
            // TODO
        };
    }
})();
