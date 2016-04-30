/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('MessageService', MessageService);

    MessageService.$inject = ['$filter', 'AppConstants'];

    function MessageService($filter, AppConstants) {
        var self = this;
        var message;

        self.info = function(message) {
            setMessage(AppConstants.MESSAGE_TYPE.INFO, message);
        };

        self.warn = function(message) {
            setMessage(AppConstants.MESSAGE_TYPE.WARN, message);
        };

        self.error = function(message) {
            setMessage(AppConstants.MESSAGE_TYPE.ERROR, message);
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
                message = undefined;
            }

            return message;
        };

        self.hasMessage = function() {
            return (message !== undefined);
        };
    }
});