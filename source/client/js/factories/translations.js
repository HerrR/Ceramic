/* global angular */

(function() {
  'use strict';

  angular
    .module('cvc')
    .factory('Translations', Translations);

  Translations.$inject = ['$resource', 'AppConstants', 'LocalCache'];

  function Translations($resource, AppConstants, LocalCache) {
    return $resource(AppConstants.PATHS.DATASETS + 'translations/:locale', {}, {
      'get': {
        method: 'GET',
        cache: LocalCache
      }
    });
  }
})();