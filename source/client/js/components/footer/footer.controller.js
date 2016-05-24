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
            return 'flag cvc-flag' + ($rootScope.language === translation ? ' cvc-flag-selected' : '');
        };

        $scope.changeLanguage = function(translation) {
            $rootScope.language = translation;
            // TODO: set cookie
        };

        $scope.toFlag = function(translation) {
            if (translation === 'en') {
                return "gb";
            }

            return translation;
        };
    }
})();
