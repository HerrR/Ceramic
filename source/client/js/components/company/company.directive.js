/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('cvcCompany', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'partials/company.html',
            controller: 'CvcCompanyController'
        };
    }
})();
