/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('Profile', Profile);

    Profile.$inject = [];

    function Profile() {
        var self = this;

        self.signIn = function(serviceName) {
            // TODO: 
        };

        self.hasSignedIn = function() {
            // TODO
            return false;
        };

        // TODO: holds data for all profile types
    }
})();