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
            }
        });
})();