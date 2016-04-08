/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('LocalCache', LocalCache);

    LocalCache.$inject = ['localStorageService'];

    function LocalCache(localStorageService) {
        this.getValue = function (key) {
            return this.getValueWithLifeTime(key, 1000 * 60 * 60); // 1h cache
        };

        this.getValueWithLifeTime = function (key, lifetime) {
            var cacheTime = new Date().getTime();
            var cacheValue = localStorageService.isSupported ? localStorageService.get(key) : undefined;
            var cacheTimeKey = key + '_time';
            var cacheTimeValue = localStorageService.isSupported ? localStorageService.get(cacheTimeKey) : undefined;

            if (angular.isDefined(cacheValue) && angular.isDefined(cacheTimeValue) && cacheTimeValue + lifetime > cacheTime) {
                return cacheValue;
            }

            return undefined;
        };

        this.putValue = function (key, value) {
            if (localStorageService.isSupported && angular.isDefined(value)) {
                localStorageService.set(key, value);
                localStorageService.set(key + '_time', new Date().getTime());
            }
        };

        this.put = function (key, value) {
          this.putValue(key, value);
        };

        this.get = function (key) {
          return this.getValue(key);
        };
    }
})();
