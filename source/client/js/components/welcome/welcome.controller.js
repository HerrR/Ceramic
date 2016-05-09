/* global angular */
/* global window */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcWelcomeController', Controller);

    Controller.$inject = ['$scope', '$http', 'ProfileService', 'AppConstants'];

    function Controller($scope, $http, ProfileService, AppConstants) {
        $scope.showSignInPerson = false;
        $scope.loginProviders = [];

        ProfileService.signIn('PERSON');

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

        $scope.isShowSignInPerson = function() {
            return $scope.showSignInPerson;
        };

        $scope.doSignInPerson = function() {
            $scope.showSignInPerson = true;
        };
    }
})();