/* global angular */
/* global document */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcHeaderController', Controller);

    Controller.$inject = ['$scope', '$mdDialog', '$mdMedia' , 'ProfileService'];
    DialogController.$inject = ['$scope', '$mdDialog'];

    function Controller($scope, $mdDialog, $mdMedia, ProfileService) {
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.showAbout = function(ev) {
            doDialog(ev, 'partials/about.html');
        };

        $scope.showWhy = function(ev) {
            doDialog(ev, 'partials/why.html');
        };

        $scope.trustedSnippet = function (textKey) {
            var filteredText = $filter('translate')(textKey);
            return $sce.trustAsHtml(htmlUnescape(filteredText));
        };

        function htmlUnescape(value) {
            return String(value)
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');
        }

        function doDialog(ev, template) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

            $mdDialog.show({
                controller: DialogController,
                templateUrl: template,
                parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                })
                .then(function(answer) {
                }, function() {
                }
            );

            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }
    }

    function DialogController($scope, $mdDialog) {
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();
