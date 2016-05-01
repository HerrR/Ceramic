/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('ScreenMessageService', ScreenMessageService);

    ScreenMessageService.$inject = ['$filter', 'AppConstants'];

    function ScreenMessageService($filter, AppConstants) {
        var self = this;
        var message;

        self.info = function(message) {
            self.setMessage(AppConstants.MESSAGE_TYPE.INFO, message);
        };

        self.warn = function(message) {
            self.setMessage(AppConstants.MESSAGE_TYPE.WARN, message);
        };

        self.error = function(message) {
            self.setMessage(AppConstants.MESSAGE_TYPE.ERROR, message);
        };

        self.setMessage = function(type, message) {
            message = {
                type: type,
                message: $filter('translate')(message),
                lifeTime: new Date().getTime() + MESSAGE_LIFE
            };
        };

        self.getMessage = function() {
            if (message && new Date().getTime() > message.lifeTime) {
                self.clear();
            }

            return message;
        };

        self.hasMessage = function() {
            return (message !== undefined);
        };

        self.clear = function() {
            message = undefined;
        };
    }
})();