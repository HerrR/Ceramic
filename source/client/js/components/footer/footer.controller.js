/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcFooterController', Controller);

    Controller.$inject = ['$scope', '$http', '$cookies', '$rootScope', 'AppConstants'];

    function Controller($scope, $http, $cookies, $rootScope, AppConstants) {
        $http.get(AppConstants.PATHS.DATASETS + 'translations', {}).then(function(translations) {
            $scope.translations = translations.data;
        }, function(err) {
            // TODO
        });

        $scope.getCSS = function(translation) {
            return ($rootScope.language === translation ? 'flag cvc-flag cvc-flag-selected' : 'flag cvc-flag');
        };

        $scope.changeLanguage = function(translation) {
            $rootScope.language = translation;
            // TODO: set cookie
        };

        $scope.getFlagURL = function(translation) {
            var flag = translation;

            if (translation === 'en') {
                flag = 'gb';
            }

            return 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.3.1/flags/4x3/' + flag + '.svg';
        };
    }
})();
