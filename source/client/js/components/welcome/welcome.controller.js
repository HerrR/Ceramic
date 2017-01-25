/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcWelcomeController', Controller);

    Controller.$inject = ['$scope', '$cookies', '$http', 'ProfileService', 'AppConstants', 'ScreenMessageService'];

    function Controller($scope, $cookies, $http, ProfileService, AppConstants, ScreenMessageService) {
        $scope.loginProviders = [];

        ProfileService.signIn($cookies.get(AppConstants.COOKIES.USERTYPE), $cookies.get(AppConstants.COOKIES.LOGINTYPE), false);

        $http.get(AppConstants.PATHS.PUBLIC + 'loginstrategies', {}).then(function(res) {
            $scope.loginProviders = res.data;
        }, function(err) {
            $scope.loginProviders = [];
            ScreenMessageService.error(AppConstants.TEXT_KEYS.GENERAL_ERROR);
        });

        $scope.signInPerson = function(type) {
            ProfileService.signIn(AppConstants.USER_TYPES.PERSON, type, true);
        };

        $scope.signInCompany = function(type) {
            ProfileService.signIn(AppConstants.USER_TYPES.COMPANY, type, true);
        };

        $scope.signInPersonUsingUsernamePassword = function(type) {
            ProfileService.signIn(AppConstants.USER_TYPES.PERSON, type, false, '1234567890','1234567890');
        };

        $scope.signInCompanyUsingUsernamePassword = function(type) {
            ProfileService.signIn(AppConstants.USER_TYPES.COMPANY, type, false, '1234567890','1234567890');
        };

        $scope.hasSignedIn = function() {
            return ProfileService.hasSignedIn();
        };

        $scope.getProviderCSS = function(provider) {
            if (provider === 'google') {
                return 'fa fa-lg fa-google-plus';
            }

            return 'fa fa-lg fa-' + provider + '-square';
        };
    }
})();