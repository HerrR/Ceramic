/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('ScreenMessageService', ScreenMessageService);

    ScreenMessageService.$inject = ['$filter', 'AppConstants'];

    function ScreenMessageService($filter, AppConstants) {
        var self = this;
        var message = null;

        self.info = function(message) {
            self.setMessage(AppConstants.MESSAGE_TYPE.INFO, message);
        };

        self.warn = function(message) {
            self.setMessage(AppConstants.MESSAGE_TYPE.WARN, message);
        };

        self.error = function(message) {
            self.setMessage(AppConstants.MESSAGE_TYPE.ERROR, message);
        };

        self.setMessage = function(type, text) {
            if (text !== undefined && text !== '') {
                message = {
                    type: type,
                    message: $filter('translate')(text)
                };
            }
        };

        self.getMessage = function() {
            return message;
        };

        self.hasMessage = function() {
            return (message !== null);
        };

        self.clear = function() {
            message = null;
        };
    }
})();