/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .filter('stringFormatArray', StringFormatArray);

    StringFormatArray.$inject = ['$filter'];

    // ex: 'hello {0}, out {1}',['world','there'] => 'hello world, out there'
    function StringFormatArray($filter) {
        return function (str) {
            if (!str || arguments.length <= 1) {
                return str;
            }

            for (var i = 0; i < arguments[1].length; i++) {
                var reg = new RegExp('\\{' + i + '\\}', 'gm');
                str = str.replace(reg, $filter('translate')(arguments[1][i]));
            }

            return str;
        };
    }
})();
