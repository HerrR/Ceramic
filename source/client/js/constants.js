/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .constant('AppConstants', {
            PATHS: {
                PUBLIC: 'public/',
                PRIVATE: 'private/',
                DATASETS: 'public/',
                AUTHORIZED: 'auth/'
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