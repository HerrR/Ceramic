/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('ProfileService', ProfileService);

    ProfileService.$inject = ['$http','AppConstants'];

    function ProfileService($http, AppConstants) {
        var self = this;
        var userid;
        var userType;
        
        // TODO: remove dummy data
        var profileData;

        self.signIn = function(serviceName) {
            $http.get(AppConstants.PRIVATE_PATH + 'person',{}).then(function(resp) {
                // TODO: implement this
                profileData = resp.data;
                if (profileData !== undefined) {
                    userid = profileData.userid;
                    userType = AppConstants.USER_TYPES.PERSON;
                    console.log('user',profileData);
                }
            });
        };

        self.signOut = function() {
            // $location.get(AppConstants.RESOURCE_PATH + 'logout', function())
            // TODO: sign out
            userType = undefined;
            userid = undefined;
        };

        self.hasSignedIn = function() {
            return (userid !== undefined);
        };

        self.isCompany = function() {
            return (userType === AppConstants.USER_TYPES.COMPANY);
        };

        self.isPerson = function() {
            return (userType === AppConstants.USER_TYPES.PERSON);
        };

        self.getProfile = function() {
            return profileData;
        };

        self.reload = function(callback) {
            console.log('reload');
            // TODO: reload the profile information from server
        };

        self.save = function(callback) {
            console.log('save');
            // TODO: save profile information
        };
    }
})();