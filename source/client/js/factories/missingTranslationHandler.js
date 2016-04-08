/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .factory('MissingTranslationHandler', MissingTranslationHandler);

    function MissingTranslationHandler() {
        return function (translationID, uses) {
            return translationID;
        };
    }
})();