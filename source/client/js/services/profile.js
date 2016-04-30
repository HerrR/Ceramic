/* global angular */
/* global window */

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
        var profileData;

        function prepareProfileData(profile) {
            if (profile) {
                if (profile.person) {
                    profile.person.dateOfBirth = new Date(profile.person.dateOfBirth);
                }

                if (profile.company) {
                    // TODO
                }
            }
        }

        self.signIn = function(serviceName) {
            userType = serviceName;
            self.reload(function(data,err) {
                // TODO: handle errors
            });
        };

        self.signOut = function() {
            userType = undefined;
            userid = undefined;
            profileData = undefined;
            window.location.href = AppConstants.AUTH_PATH + 'logout'
        };

        self.hasSignedIn = function() {
            return (profileData !== undefined);
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
            $http.get(AppConstants.PRIVATE_PATH + userType.toLowerCase(),{}).then(function(resp) {
                // TODO: handle error
                profileData = resp.data;
                prepareProfileData(profileData);
                if (callback) {
                    callback(profileData, null);
                }
            }, function(err) {
                if (callback) {
                    callback(null, err);
                }
            });
        };

        self.save = function(callback) {
            if (profileData) {
                $http.post(AppConstants.PRIVATE_PATH + userType.toLowerCase(),profileData).then(function(resp) {
                    // TODO: handle error
                    if (callback) {
                        callback(profileData, null);
                    }
                }, function(err) {
                    if (callback) {
                        callback(null, err);
                    }
                });
            }
        };
    }
})();