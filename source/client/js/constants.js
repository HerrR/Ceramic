/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .constant('AppConstants', {
            RESOURCE_PATH: 'rest/',
            USER_TYPES: {
                COMPANY: 'COMPANY',
                PERSON: 'PERSON'
            },
            IMAGES: {
                MAIN_COMPANY: 'logo-company.jpg',
                MAIN_PERSON: 'logo-person.jpg',
                ANONYMOUS_PERSON: 'anonymous-user-profile.jpg'
            }
        });
})();