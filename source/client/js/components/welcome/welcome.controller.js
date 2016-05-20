/* global angular */
/* global window */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcWelcomeController', Controller);

    Controller.$inject = ['$scope', '$http', 'ProfileService', 'AppConstants'];

    function Controller($scope, $http, ProfileService, AppConstants) {
        $scope.loginProviders = [];

        ProfileService.signIn(AppConstants.USER_TYPES.PERSON); // TODO: the type must be stored locally or in the user token

        $http.get(AppConstants.PATHS.PUBLIC + 'loginstrategies', {}).then(function(res) {
            $scope.loginProviders = res.data;
        }, function() {
            $scope.loginProviders = [];
            // TODO: handle error
        });

        $scope.signInPerson = function(type) {
            window.location.href = AppConstants.PATHS.AUTHORIZED + type + '/login';
        };

        $scope.signInCompany = function(type) {
            // TODO
        };

        $scope.hasSignedIn = function() {
            return ProfileService.hasSignedIn();
        };
    }
})();