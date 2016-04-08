/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .factory('TranslationsLoader', TranslationLoader);

    TranslationLoader.$inject = ['$q', 'Translations'];

    function TranslationLoader($q, Translations) {
        return function (options) {
            var deferred = $q.defer();

            Translations.get({
                locale: options.key
            }).$promise.then(
                function (resp) {
                    deferred.resolve(resp.translations);
                },
                function (reason) {
                    deferred.reject(options.key);
                },
                function (update) {
                }
            );

            return deferred.promise;
        };
    }
})();