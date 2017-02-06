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
                AUTHORIZED: 'auth/',
                FEATURE_TOGGLE: 'feature_toggle.json'
            },
            DATASETS: {
                TRANSLATION_LANGUAGES: { NAME: 'TRANSLATION_LANGUAGES', PATH: 'keys/translations'},
                LANGUAGE_LEVELS: { NAME: 'LANGUAGE_LEVELS', PATH: 'language_level'},
                COUNTRIES: { NAME: 'COUNTRIES', PATH: 'country'},
                DEGREE: { NAME: 'DEGREE', PATH: 'education_level'},
                FACULTY: { NAME: 'FACULTY', PATH: 'education_faculty'},
                PROFESSION: { NAME: 'PROFESSION', PATH: 'professions'},
                ROLE: { NAME: 'ROLE', PATH: 'roles'},
                COMPETENCY_HIERACHY: { NAME: 'COMPETENCY_HIERACHY', PATH: 'competency_hierachy'},
                EDUCATION_HIGH_SCHOOL_MAJOR: { NAME: 'EDUCATION_HIGH_SCHOOL_MAJOR', PATH: 'education_high_school_major'},
                INDUSTRY: { NAME: 'INDUSTRY', PATH: 'industry'},
                COMPANY_FORMS: { NAME: 'COMPANY_FORMS', PATH: 'company_forms'},
                PERSON_FORMS: { NAME: 'PERSON_FORMS', PATH: 'person_forms'}
            },
            MESSAGE_LIFE: 2000,
            USER_TYPES: {
                COMPANY: 'COMPANY',
                PERSON: 'PERSON'
            },
            DEFAULT_ROUTES: {
                COMPANY: 'company.dashboard',
                PERSON: 'person.dashboard'
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