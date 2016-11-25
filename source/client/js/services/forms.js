/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('FormService', FormService);

    FormService.$inject = [];

    function FormService() {
        var self = this;

        var sidebarPersonForm = [
            // TODO: form
        ];

        var highSchoolPersonForm = [
            // TODO: form
        ];

        var collegePersonForm = [
            // TODO: form
        ];

        var workPersonForm = [
            // TODO: form
        ];

        var generalInfoPersonForm = [
            // TODO: form
        ];

        var settingsPersonForm = [
            // TODO: form
        ];


        var infoCompanyForm = [
            // TODO: form
        ];

        var settingsCopanyForm = [
            // TODO: form
        ];

        var personForms = {
            sidebar: sidebarPersonForm,
            highSchool: highSchoolPersonForm,
            college: collegePersonForm,
            work: workPersonForm,
            generalInfo: generalInfoPersonForm,
            settings: settingsPersonForm
        };

        var companyForms = {
            info: infoCompanyForm,
            settings: settingsCopanyForm

            // TODO: more form types
        };
        
        self.getPersonForm = function(type) {
            return personForms[type];
        };

        self.getCompanyForm = function(type) {
            return companyForms[type];
        };
    }
})();