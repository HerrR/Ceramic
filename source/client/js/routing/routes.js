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
                templateUrl: 'partials/home.html',
                customConfig: {
                    allowTranslationChange:true
                }
            })

            /*.state('error', {
                cache: false,
                url: '/error/:errorStatus',
                controller: 'RouteErrorController',
                template: '<cvc-error />'
            })*/
        ;
    }
})();