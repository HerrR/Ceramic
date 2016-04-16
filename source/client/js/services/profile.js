/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('ProfileService', ProfileService);

    ProfileService.$inject = ['AppConstants'];

    function ProfileService(AppConstants) {
        var self = this;
        var userToken;
        var userType = AppConstants.USER_TYPES.PERSON;

        self.signIn = function(serviceName) {
            // TODO: implement this
            userToken = 'test_token';
            userType = serviceName;
        };

        self.hasSignedIn = function() {
            return (userToken !== undefined);
        };

        self.isCompany = function() {
            return (userType === AppConstants.USER_TYPES.COMPANY); // TODO: feteched from REST call result
        };

        self.isPerson = function() {
            return (userType === AppConstants.USER_TYPES.PERSON); // TODO: feteched from REST call result
        };

        self.save = function() {
            // TODO: post the profile
        };
    }
})();