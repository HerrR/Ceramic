/* global angular */
/* global window */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('ProfileService', ProfileService);

    ProfileService.$inject = ['$http', '$cookies', '$state', 'AppConstants', 'ScreenMessageService'];

    function ProfileService($http, $cookies, $state, AppConstants, ScreenMessageService) {
        var self = this;
        var userid;
        var userType;
        var profileData;
        var maxStorageSize;

        $http.get(AppConstants.PATHS.PUBLIC + 'storage_size', {}).then(function(res) {
            maxStorageSize = res.data.size;
        }, function(err) {
            maxStorageSize = 1024 * 1024;
        });

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

                    // if(profile.person.cv.high_school === undefined){
                    //     profile.person.cv.high_school = angular.copy(AppConstants.CV_OBJECTS.EDUCATION_OBJECT);
                    // }

                    // TODO
                }

                if (profile.company) {
                    // TODO
                }
            }
        }

        self.getUserType = function(){
            return userType;
        };

        self.setUserType = function(_userType) {
            userType = _userType;
        };

        self.signIn = function(_userType, serviceType, changeURL, username, password) {
            // console.log(_userType, serviceType, changeURL);
            // console.log($cookies.getAll());
            if (_userType && serviceType) {
                userType = _userType;

                $cookies.put(AppConstants.COOKIES.USERTYPE, userType, {expires: new Date("2047-12-09")});
                $cookies.put(AppConstants.COOKIES.LOGINTYPE, serviceType, {expires: new Date("2047-12-09")});

                if (changeURL) {
                    window.location.href = AppConstants.PATHS.AUTHORIZED + serviceType + '/login';
                }

                if (changeURL === false && username && password) {
                    $http.post(AppConstants.PATHS.AUTHORIZED + serviceType + '/login',{username: username, password: password}).then(function(resp) {
                        self.reload(function(data, err) {
                            if (err) {
                                ScreenMessageService.error(AppConstants.TEXT_KEYS.SIGN_IN_ERROR);
                            } else {
                                $state.go(AppConstants.DEFAULT_ROUTES[userType]);
                            }
                        });
                    }, function(err) {
                        ScreenMessageService.error(AppConstants.TEXT_KEYS.FETCH_PROFILE_ERROR);
                    });
                }

                if (changeURL === false) {
                    self.reload(function(data, err) {
                        if (err) {
                            ScreenMessageService.error(AppConstants.TEXT_KEYS.SIGN_IN_ERROR);
                        }
                    });
                }
            }
        };

        self.signOut = function() {
            userType = undefined;
            userid = undefined;
            profileData = undefined;
            $cookies.remove(AppConstants.COOKIES.USERTYPE);
            $cookies.remove(AppConstants.COOKIES.LOGINTYPE);
            window.location.reload();
            // window.location.href = AppConstants.PATHS.AUTHORIZED + 'logout';
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

        self.getMaxStorageSize = function() {
            return maxStorageSize;
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