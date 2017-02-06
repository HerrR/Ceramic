/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .config(Route);

    Route.$inject = ['$stateProvider', '$urlRouterProvider'];

    function Route($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                cache: false,
                url: '/',
                templateUrl: 'partials/common/home.html'
            })
            .state('person', {
                cache: false,
                url: '/person',
                redirectTo: 'person.dashboard',
                templateUrl: 'partials/person/person.html'
            })
            .state('person.dashboard', 
            {
                cache: false,
                url: '/dashboard',
                restrictAccessTo: ['PERSON'],
                templateUrl: 'partials/person/dashboard.html'
            })
            .state('person.cv',
            {
                cache: false,
                url: '/cv',
                restrictAccessTo: ['PERSON'],
                templateUrl: 'partials/person/cv.html'
            })
            .state('person.library',{
                cache: false,
                url: '/library',
                restrictAccessTo: ['PERSON'],
                templateUrl: 'partials/person/library.html'
            })
            .state('person.settings', {
                cache: false,
                url: '/settings',
                restrictAccessTo: ['PERSON'],
                templateUrl: 'partials/person/settings.html'
            })
            .state('company', {
                cache: false,
                url: '/company',
                restrictAccessTo: ['COMPANY'],
                templateUrl: 'partials/company/company.html'
            })
            .state('company.dashboard', {
                cache: false,
                url: '/dashboard',
                restrictAccessTo: ['COMPANY'],
                templateUrl: 'partials/company/dashboard.html'
            })


            /*.state('error', {
                cache: false,
                url: '/error/:errorStatus',
                controller: 'RouteErrorController',
                template: '<cvc-error />'
            })*/

            /* /loginfailed */

            // TODO: status
        ;
    }
})();