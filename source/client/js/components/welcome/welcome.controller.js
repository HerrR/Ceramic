/* global angular */
/* global window */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcWelcomeController', Controller);

    Controller.$inject = ['$scope', '$cookies', '$http', 'ProfileService', 'AppConstants', 'ScreenMessageService'];

    function Controller($scope, $cookies, $http, ProfileService, AppConstants, ScreenMessageService) {
        $scope.loginProviders = [];

        console.log('USERTYPE',$cookies.get(AppConstants.COOKIES.USERTYPE));
        ProfileService.signIn($cookies.get(AppConstants.COOKIES.USERTYPE) || AppConstants.USER_TYPES.PERSON);

        $http.get(AppConstants.PATHS.PUBLIC + 'loginstrategies', {}).then(function(res) {
            $scope.loginProviders = res.data;
        }, function(err) {
            $scope.loginProviders = [];
            ScreenMessageService.error(AppConstants.TEXT_KEYS.GENERAL_ERROR);
        });

        $scope.signInPerson = function(type) {
            $cookies.put(AppConstants.COOKIES.USERTYPE, AppConstants.USER_TYPES.PERSON, {expires: new Date("2047-12-09")});
            $cookies.put(AppConstants.COOKIES.LOGINTYPE, type, {expires: new Date("2047-12-09")});

            ProfileService.signIn(AppConstants.USER_TYPES.PERSON);
            window.location.href = AppConstants.PATHS.AUTHORIZED + type + '/login';
        };

        $scope.signInCompany = function(type) {
            $cookies.put(AppConstants.COOKIES.USERTYPE, AppConstants.USER_TYPES.COMPANY, {expires: new Date("2047-12-09")});
            $cookies.put(AppConstants.COOKIES.LOGINTYPE, type, {expires: new Date("2047-12-09")});

            ProfileService.signIn(AppConstants.USER_TYPES.COMPANY);
            window.location.href = AppConstants.PATHS.AUTHORIZED + type + '/login';
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