/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .constant('AppConstants', {
            RESOURCE_PATH: 'public/',
            PRIVATE_PATH: 'private/',
            AUTH_PATH: 'auth/',
            USER_TYPES: {
                COMPANY: 'COMPANY',
                PERSON: 'PERSON'
            }
        });
})();