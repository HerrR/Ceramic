/* global angular */
/* global $ */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcPersonController', Controller);

    Controller.$inject = ['$scope', '$http', '$filter', '$timeout', 'ProfileService', 'AppConstants', 'ScreenMessageService', 'DatasetService', 'Upload'];

    function Controller($scope, $http, $filter, $timeout, ProfileService, AppConstants, ScreenMessageService, DatasetService, Upload) {
        $scope.MIN_DATE = "1900-01-01";
        $scope.MAX_DATE = new Date(); // TODO: at least 18 years old

        $scope.MAX_EDUCATION_COUNT = 20;
        $scope.MAX_WORK_COUNT = 40;
        $scope.MAX_LANGUAGE_COUNT = 20;
        $scope.MAX_LIBRARY_COUNT = 1;

        $scope.profile = ProfileService.getProfile();
        $scope.oldHashCode = computeHashCode($scope.profile);
        $scope.newHashCode = computeHashCode($scope.profile);
        $scope.valuesChanged = false;
        $scope.latestUploadFile = null;
        $scope.latestUploadFileError = null;

        DatasetService.getAsync(AppConstants.DATASETS.LANGUAGE_LEVELS, function(data) {
            $scope.languageLevelToText = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.DEGREE, function(data) {
            $scope.degrees = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.FACULTY, function(data) {
            $scope.faculties = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.COUNTRIES, function(data) {
            var items = [];
            for (var key in data) {
                items.push({display: data[key]});
            }

            $scope.countries = items;
        });

        $scope.hasScreenMessage = function() {
            return ScreenMessageService.hasMessage();
        };

        $scope.answerChanged = function() {
            $scope.newHashCode = computeHashCode($scope.profile);
            $scope.valuesChanged = ($scope.newHashCode != $scope.oldHashCode);
        };

        $scope.save = function() {
            var validationErrors = $scope.validate();

            if (validationErrors.length === 0) {
                ProfileService.save(function(data, err) {
                    if (err === null) {
                        $scope.profile = data;
                        $scope.oldHashCode = computeHashCode($scope.profile);
                        $scope.newHashCode = computeHashCode($scope.profile);
                        $scope.valuesChanged = false;
                        ScreenMessageService.info('message.saved_success');
                    }
                });
            }

            return validationErrors;
        };

        $scope.cancel = function() {
            ProfileService.reload(function (data, err) {
                if (err === null) {
                    $scope.profile = data;
                    $scope.oldHashCode = computeHashCode($scope.profile);
                    $scope.newHashCode = computeHashCode($scope.profile);
                    $scope.valuesChanged = false;
                    ScreenMessageService.info('message.cancel_success');
                }
            });
        };

        $scope.signOut = function() {
            $scope.profile = null;
            ProfileService.signOut();
        };

        $scope.hasSignedIn = function() {
            return ($scope.profile !== null && $scope.profile !== undefined);
        };

        $scope.getMatches = function(filter) {
            var filtered = [];
            var filterText = filter.toLowerCase();
            for (var country in $scope.countries) {
                console.log('obj',$scope.countries[country]);
                if ($scope.countries[country].display.toLowerCase().indexOf(filterText) === 0) {
                    filtered.push($scope.countries[country]);
                }
            }

            return filtered;
        };

        $scope.getTabFile = function(tab) {
            return 'partials/person/' + tab + '.html';
        };

        $scope.validate = function() {
            // TODO: validate the form and return validation errors.
            return [];
        };

        $scope.addEducation = function() {
            addElement($scope.profile.person.cv.education, function () {
                return {
                    school: '',
                    degree: '',
                    faculty: '',
                    fromDate: '',
                    toDate: ''
                };
            }, function(element) {
                return element.school.trim() !== '';
            }, $scope.MAX_EDUCATION_COUNT);
        };

        $scope.removeEducation = function(id) {
            $scope.profile.person.cv.education.splice(id,1);
            $scope.answerChanged();
        };

        $scope.addWork = function() {
            addElement($scope.profile.person.cv.experience, function () {
                return {
                    company: '',
                    industry: '',
                    role: '',
                    fromDate: '',
                    toDate: '',
                };
            }, function(element) {
                return element.company.trim() !== '';
            }, $scope.MAX_WORK_COUNT);
        };

        $scope.removeWork = function(id) {
            $scope.profile.person.cv.experience.splice(id,1);
            $scope.answerChanged();
        };

        $scope.addLanguage = function() {
            addElement($scope.profile.person.cv.generalInfo.language, function () {
                return {
                    name: '',
                    level: 0
                };
            }, function(element) {
                return element.name.trim() !== '';
            }, $scope.MAX_LANGUAGE_COUNT);
        };

        $scope.removeLanguage = function(id) {
            $scope.profile.person.cv.generalInfo.language.splice(id,1);
            $scope.answerChanged();
        };

        $scope.getStorageUsage = function() {
            // TODO: calculate storage usage
            return $filter('translate')('profile.library.storage_usage');
        };

        $scope.removeLibrary = function(id) {
            $scope.profile.person.library.splice(id,1);
            $scope.answerChanged();
        };

        $scope.uploadFiles = function(file, invalidFiles) {
            $scope.latestUploadFile = file;
            $scope.latestUploadFileError = invalidFiles && invalidFiles[0];

            // TODO: do not allow more than $scope.MAX_LIBRARY_COUNT files

            if (file) {
                file.upload = Upload.upload({
                    url: AppConstants.PATHS.PRIVATE + 'upload',
                    data: {file: file}
                });

                file.upload.then(function(attachment) {
                    $timeout(function() {
                        $scope.profile.person.library.push(attachment.data);
                        $scope.oldHashCode = computeHashCode($scope.profile);
                        $scope.newHashCode = computeHashCode($scope.profile);
                    }); 
                }, function(err) {
                    if (err.status > 0) {
                        $scope.latestUploadFile = null;
                        $scope.latestUploadFileError = $filter('translate')(data.error);
                    }
                }, function(event) {
                    file.progress = Math.min(100, parseInt(100.0 * event.loaded / event.total));
                });
            }
        };

        $scope.getDownloadPath = function(attachment) {
            return AppConstants.PATHS.PRIVATE + 'download/' + attachment.id;
        };
    }

    function computeHashCode(object) {
        if (object === null || object === undefined) {
            return '';
        }

        var data = JSON.stringify(object);
        var hash = 0, i, chr, len;

        if (data.length === 0) {
            return hash;
        }

        for (i = 0, len = data.length; i < len; i++) {
            chr = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }

        return hash;
    }

    function addElement(list, createCallback, isNotEmptyCallback, maxElements) {
        if (!list) {
            list = [];
        }

        if (list.length === 0) {
            list.push(createCallback());
        } else if (list.length < maxElements) {
            var lastElement = list[list.length - 1];

            if (isNotEmptyCallback(lastElement)) {
                list.push(createCallback());
            }
        }
    }
})();
