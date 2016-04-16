/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcPersonController', Controller);

    Controller.$inject = ['$scope', 'ProfileService'];

    function Controller($scope, ProfileService) {
    }
})();
