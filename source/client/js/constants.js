/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .constant('AppConstants', {
            COOKIES: {
                LANGUAGE: 'cvc-language',
                USERTYPE: 'cvc-usertype',
                LOGINTYPE: 'cvc-logintype'
            },
            PATHS: {
                PUBLIC: 'public/',
                PRIVATE: 'private/',
                DATASETS: 'dataset/',
                AUTHORIZED: 'auth/'
            },
            DATASETS: {
                TRANSLATION_LANGUAGES: { NAME: 'TRANSLATION_LANGUAGES', PATH: 'keys/translations'},
                LANGUAGE_LEVELS: { NAME: 'LANGUAGE_LEVELS', PATH: 'language_level'},
                COUNTRIES: { NAME: 'COUNTRIES', PATH: 'country'},
                DEGREE: { NAME: 'DEGREE', PATH: 'education_level'},
                FACULTY: { NAME: 'FACULTY', PATH: 'education_faculty'},
                PROFESSION: { NAME: 'PROFESSION', PATH: 'professions'},
                ROLE: { NAME: 'ROLE', PATH: 'roles'},
                INDUSTRY: { NAME: 'INDUSTRY', PATH: 'industry'}
            },
            MESSAGE_LIFE: 2000,
            USER_TYPES: {
                COMPANY: 'COMPANY',
                PERSON: 'PERSON'
            },
            MESSAGE_TYPE: {
                INFO: 'INFO',
                WARN: 'WARN',
                ERROR: 'ERROR'
            },
            TEXT_KEYS: {
                GENERAL_ERROR: 'error.general',
                SIGN_IN_ERROR: '',
                FETCH_PROFILE_ERROR: '',
                SAVE_PROFILE_ERROR: '',
                PROFILE_SAVED: ''
            }
        });
})();