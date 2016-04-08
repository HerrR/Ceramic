/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .config(StorageProvider);

    StorageProvider.$inject = ['localStorageServiceProvider'];

    function StorageProvider(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('cvc');
        localStorageServiceProvider.setStorageType('sessionStorage');
    }
})();