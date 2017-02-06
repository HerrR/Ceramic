/* global angular */
/* global document */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcHeaderController', Controller);

    Controller.$inject = ['$scope', '$mdDialog', '$mdMedia' , 'ProfileService', '$state'];
    DialogController.$inject = ['$scope', '$mdDialog'];

    function Controller($scope, $mdDialog, $mdMedia, ProfileService, $state) {
        $scope.menuOpen = false;

        $scope.toggleMenu = function(){
            $scope.menuOpen = !$scope.menuOpen;
        }

        $scope.closeMenu = function(){
            if($scope.menuOpen){
                $scope.toggleMenu();
            }
        }

        var menuOptions = {
            "general": {

            },
            "person": {
                "profile.dashboard": {
                    "icon": "fa-bar-chart", 
                    "state": "person.dashboard"
                },
                "profile.cv": {
                    "icon": "fa-file-text",
                    "state": "person.cv"
                }, 
                "profile.library": {
                    "icon": "fa-folder-open",
                    "state": "person.library"
                }, 
                "profile.settings": {
                    "icon": "fa-cog",
                    "state": "person.settings"
                }
            },
            "company": {
                "profile.company.dashboard": {
                    "icon": "fa-bar-chart",
                    "state": "company.dashboard"
                },
                "profile.company.messages": {
                    "icon": "fa-bell",
                    "state": "company.messages"
                },
                "profile.company.searches": {
                    "icon": "fa-binoculars",
                    "state": "company.searches"
                },
                "profile.company.profiles": {
                    "icon": "fa-users",
                    "state": "company.profiles"
                },
                "profile.company.company_info": {
                    "icon": "fa-building",
                    "state": "company.companyInfo"
                },
                "profile.company.receipts": {
                    "icon": "fa-shopping-cart",
                    "state": "company.receipts"
                },
                "profile.company.settings": {
                    "icon": "fa-cog",
                    "state": "company.settings"
                }
            }
        }

        $scope.menuOptions = function(){
            if(!ProfileService.hasSignedIn()){
                // Menu set for non-logged in users
            } else if (ProfileService.isPerson()){
                return menuOptions.person;
                // Menu set for persons
            } else if (ProfileService.isCompany()){
                return menuOptions.company;
            }
            // (tab, icon) in {'dashboard':'fa-bar-chart', 'cv':'fa-file-text', 'library':'fa-folder-open', 'settings':'fa-cog'}" ui-sref="{{'person.'+tab}}
        }

        $scope.isLoggedIn = function(){
            return ProfileService.hasSignedIn();
        }

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.showAbout = function(ev) {
            doDialog(ev, 'partials/about.html');
        };

        $scope.signOut = function(){
            ProfileService.signOut();
        }

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
