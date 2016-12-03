/* global angular */
/* global $ */

(function() {
    'use strict';

    angular
        .module('cvc')
        .controller('CvcPersonController', Controller);

    Controller.$inject = ['$scope', '$http', '$filter', '$timeout', 'ProfileService', 'AppConstants', 'ScreenMessageService', 'DatasetService', 'Upload', 'UtilityService'];

    function Controller($scope, $http, $filter, $timeout, ProfileService, AppConstants, ScreenMessageService, DatasetService, Upload, UtilityService) {
        $scope.MIN_DATE = "1900-01-01";
        $scope.MAX_DATE = new Date(); // TODO: at least 18 years old

        $scope.MAX_EDUCATION_COUNT = 20;
        $scope.MAX_WORK_COUNT = 40;
        $scope.MAX_LANGUAGE_COUNT = 20;
        $scope.MAX_LIBRARY_COUNT = 20;

        $scope.profile = ProfileService.getProfile();
        $scope.oldHashCode = UtilityService.computeHashCode($scope.profile);
        $scope.newHashCode = UtilityService.computeHashCode($scope.profile);
        $scope.valuesChanged = false;
        $scope.latestUploadFile = null;
        $scope.latestUploadFileError = null;

        DatasetService.getAsync(AppConstants.DATASETS.LANGUAGE_LEVELS.NAME, function(data) {
            $scope.languageLevelToText = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.DEGREE.NAME, function(data) {
            $scope.degrees = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.FACULTY.NAME, function(data) {
            $scope.faculties = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.INDUSTRY.NAME, function(data) {
            $scope.industries = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.PROFESSION.NAME, function(data) {
            $scope.professions = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.COMPETENCY_HIERACHY.NAME, function(data) {
            $scope.competency_hierachy = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.EDUCATION_HIGH_SCHOOL_MAJOR.NAME, function(data) {
            console.log('major',data.list);
            $scope.education_high_school_major = data.list;
        });

        DatasetService.getAsync(AppConstants.DATASETS.COUNTRIES.NAME, function(data) {
            var items = [];
            for (var key in data) {
                items.push({display: data[key]});
            }

            $scope.countries = items;
        });

        $scope.resetIndustry = function(experience) {
            experience.discipline = null;
            experience.role = null;
            experience.keyCompetencies = [];
        };

        $scope.resetDiscipline = function(experience) {
            experience.role = null;
            experience.keyCompetencies = [];
        };

        $scope.resetRole = function(experience) {
            experience.keyCompetencies = [];
        };

        $scope.getDisciplines = function(experience) {
            if ($scope.competency_hierachy) {
                for (var key in $scope.competency_hierachy) {
                    if ($scope.competency_hierachy[key].id === experience.industry) {
                        return $scope.competency_hierachy[key].discipline;
                    }
                }
            }

            return undefined;
        };

        $scope.getRoles = function(experience) {
            var disciplines = $scope.getDisciplines(experience);
            
            if (disciplines) {
                for (var key in disciplines) {
                    if (disciplines[key].id === experience.discipline) {
                        return disciplines[key].role;
                    }
                }
            }

            return undefined;
        };

        $scope.getKeyCompetencies = function(experience) {
            var roles = $scope.getRoles(experience);

            if (roles) {
                for (var key in roles) {
                    if (roles[key].id === experience.role) {
                        return roles[key].key_competency;
                    }
                }
            }

            return undefined
        };

        $scope.transformChip = function(chip) {
            return chip.id;
        };

        $scope.hasScreenMessage = function() {
            return ScreenMessageService.hasMessage();
        };

        $scope.answerChanged = function() {
            $scope.newHashCode = UtilityService.computeHashCode($scope.profile);
            $scope.valuesChanged = ($scope.newHashCode !== $scope.oldHashCode);
        };

        $scope.save = function() {
            var validationErrors = $scope.validate();

            if (validationErrors.length === 0) {
                ProfileService.save(function(data, err) {
                    if (err === null) {
                        $scope.profile = data;
                        $scope.oldHashCode = UtilityService.computeHashCode($scope.profile);
                        $scope.newHashCode = UtilityService.computeHashCode($scope.profile);
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
                    $scope.oldHashCode = UtilityService.computeHashCode($scope.profile);
                    $scope.newHashCode = UtilityService.computeHashCode($scope.profile);
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
                    toDate: '',
                    description: ''
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
                    profession: '',
                    fromDate: '',
                    toDate: '',
                    description: '',
                    keyCompetencies: []
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
            var totalSize = 0;
            for (var index = 0; index < $scope.profile.person.library.length; ++index) {
                totalSize += $scope.profile.person.library[index].size;
            }
            return $filter('stringFormatArray')($filter('translate')('profile.library.storage_usage'), [toMegabytes(totalSize), toMegabytes(ProfileService.getMaxStorageSize())]);
        };

        $scope.removeLibrary = function(id) {
            $scope.profile.person.library.splice(id,1);
            $scope.answerChanged();
        };

        $scope.uploadFiles = function(file, invalidFiles) {
            $scope.latestUploadFile = file;
            $scope.latestUploadFileError = invalidFiles && invalidFiles[0];

            if ($scope.profile.person.library.length + 1 >= $scope.MAX_LIBRARY_COUNT) {
                $scope.latestUploadFileError = $filter('stringFormatArray')($filter('translate')('profile.library.toManyFiles'), [$scope.MAX_LIBRARY_COUNT]);
            } else if (file) {
                file.upload = Upload.upload({
                    url: AppConstants.PATHS.PRIVATE + 'upload',
                    data: {file: file}
                });

                file.upload.then(function(attachment) {
                    $timeout(function() {
                        $scope.profile.person.library.push(attachment.data);
                        $scope.oldHashCode = UtilityService.computeHashCode($scope.profile);
                        $scope.newHashCode = UtilityService.computeHashCode($scope.profile);
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

        $scope.getFileIcon = function(attachment) {
            if (attachment.name.endsWith('.pdf')) {
                return 'fa-file-pdf-o';
            }

            if (attachment.name.endsWith('.doc') || attachment.name.endsWith('.docx')) {
                return 'fa-file-word-o';
            }

            if (attachment.name.endsWith('.zip')) {
                return 'fa-file-zip-o';
            }

            if (attachment.name.endsWith('.png') || attachment.name.endsWith('.jpg')) {
                return 'fa-file-image-o';
            }

            if (attachment.name.endsWith('.txt')) {
                return 'fa-file-text-o';
            }

            return 'fa-file-o';
        };
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

    function toMegabytes(size) {
        return (size / (1024.0 * 1024.0)).toFixed(2);
    }
})();
