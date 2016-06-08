/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcFooterController', Controller);

    Controller.$inject = ['$scope', '$http', '$cookies', '$rootScope', '$translate', 'AppConstants', 'DatasetService'];

    function Controller($scope, $http, $cookies, $rootScope, $translate, AppConstants, DatasetService) {
        DatasetService.getAsync(AppConstants.DATASETS.TRANSLATION_LANGUAGES, function(data) {
            $scope.translations = data;
        });

        $scope.getCSS = function(translation) {
            return ($rootScope.locale === translation ? 'flag cvc-flag cvc-flag-selected' : 'flag cvc-flag');
        };

        $scope.changeLanguage = function(translation) {
            if ($rootScope.locale !== translation) {
                $rootScope.locale = translation;
                $cookies.put(AppConstants.COOKIES.LANGUAGE, translation, {expires: new Date("2047-12-09")});
                $rootScope.$broadcast('locale.changed', $rootScope.locale);

                $translate.use(translation).then(function () {
                    // translation changed callback
                });
            }
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