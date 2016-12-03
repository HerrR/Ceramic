/* global angular */
/* global JSON */

(function() {
    'use strict';

    angular
        .module('cvc')
        .service('UtilityService', UtilityService);

    UtilityService.$inject = [];

    function UtilityService() {
        var self = this;

        self.computeHashCode = function(object) {
            if (object === null || object === undefined) {
                return '';
            }

            var data = JSON.stringify(object);
            var hash = 0, i, chr, len;

            if (data.length === 0) {
                return hash;
            }

            for (i = 0, len = data.length; i < len; i++) {
                chr = data.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            return hash;
        };
    }
})();