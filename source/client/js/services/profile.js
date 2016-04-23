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
        
        // TODO: remove dummy data
        var profileData = {
            userid: undefined,
            system: {
                userType: AppConstants.USER_TYPES.PERSON,
            },
            person: {
                name: 'Kalle Anka',
                dateOfBirth: new Date(1967,5,23,0,0,0,0),
                searchable: true
            }
        };

        self.signIn = function(serviceName) {
            // TODO: implement this
            userid = 'test_token';
            profileData.system.userType = serviceName;
        };

        self.signOut = function() {
            // $http.get(AppConstants.RESOURCE_PATH + 'logout', function())
            // TODO: sign out
            userid = undefined;
        };

        self.hasSignedIn = function() {
            return (userid !== undefined);
        };

        self.isCompany = function() {
            return (profileData.system.userType === AppConstants.USER_TYPES.COMPANY);
        };

        self.isPerson = function() {
            return (profileData.system.userType === AppConstants.USER_TYPES.PERSON);
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