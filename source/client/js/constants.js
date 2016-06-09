/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .constant('AppConstants', {
            COOKIES: {
                LANGUAGE: 'cvc-language'
            },
            PATHS: {
                PUBLIC: 'public/',
                PRIVATE: 'private/',
                DATASETS: 'dataset/',
                AUTHORIZED: 'auth/'
            },
            DATASETS: {
                TRANSLATION_LANGUAGES: 'TRANSLATION_LANGUAGES',
                LANGUAGE_LEVELS: 'LANGUAGE_LEVELS',
                COUNTRIES: 'COUNTRIES',
                DEGREE: 'DEGREE',
                FACULTY: 'FACULTY',
                INDUSTRY: 'INDUSTRY'
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
                SIGN_IN_ERROR: '',
                FETCH_PROFILE_ERROR: '',
                SAVE_PROFILE_ERROR: '',
                PROFILE_SAVED: ''
            }
        });
})();