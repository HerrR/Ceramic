/* global angular */
/* global window */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('ProfileService', ProfileService);

    ProfileService.$inject = ['$http','AppConstants', 'ScreenMessageService'];

    function ProfileService($http, AppConstants, ScreenMessageService) {
        var self = this;
        var userid;
        var userType;
        var profileData;

        function toDate(d) {
            return d ? new Date(d.toString().substr(0,10)) : null;
        }

        function prepareProfileData(profile) {
            if (profile) {
                if (profile.person) {
                    profile.person.basic.dateOfBirth = toDate(profile.person.basic.dateOfBirth);
                    
                    for (var educationId = 0; educationId < profile.person.cv.education.length; ++educationId) {
                        profile.person.cv.education[educationId].fromDate = toDate(profile.person.cv.education[educationId].fromDate);
                        profile.person.cv.education[educationId].toDate = toDate(profile.person.cv.education[educationId].toDate);
                    }

                    for (var experienceId = 0; experienceId < profile.person.cv.experience.length; ++experienceId) {
                        profile.person.cv.experience[experienceId].fromDate = toDate(profile.person.cv.experience[experienceId].fromDate);
                        profile.person.cv.experience[experienceId].toDate = toDate(profile.person.cv.experience[experienceId].toDate);
                    }

                    // TODO
                }

                if (profile.company) {
                    // TODO
                }
            }
        }

        self.signIn = function(serviceName) {
            userType = serviceName;
            self.reload(function(data,err) {
                ScreenMessageService.error(AppConstants.TEXT_KEYS.SIGN_IN_ERROR);
            });
        };

        self.signOut = function() {
            userType = undefined;
            userid = undefined;
            profileData = undefined;
            window.location.href = AppConstants.PATHS.AUTHORIZED + 'logout';
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

        self.hasErrors = function() {
            return (profileData.errors !== undefined);
        };

        self.getErrors = function() {
            return profileData.errors;
        };

        self.reload = function(callback) {
            $http.get(AppConstants.PATHS.PRIVATE + userType.toLowerCase(),{}).then(function(resp) {
                profileData = resp.data;
                prepareProfileData(profileData);
                if (callback) {
                    callback(profileData, null);
                }
            }, function(err) {
                ScreenMessageService.error(AppConstants.TEXT_KEYS.FETCH_PROFILE_ERROR);
                if (callback) {
                    callback(profileData, err);
                }
            });
        };

        self.save = function(callback) {
            if (profileData) {
                $http.post(AppConstants.PATHS.PRIVATE + userType.toLowerCase(),profileData).then(function(resp) {
                    ScreenMessageService.info(AppConstants.TEXT_KEYS.PROFILE_SAVED);
                    if (callback) {
                        callback(profileData, null);
                    }
                }, function(err) {
                    ScreenMessageService.error(AppConstants.TEXT_KEYS.SAVE_PROFILE_ERROR);
                    if (callback) {
                        callback(profileData, err);
                    }
                });
            }
        };
    }
})();