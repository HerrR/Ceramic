/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .filter('stringFormatProperties', StringFormatProperties);

    StringFormatProperties.$inject = ['$filter'];

    // ex: 'The city of {town} in the year {year}', {'town':'Stockholm','year':2015} => 'The city of Stockholm in the year 2015'
    function StringFormatProperties($filter) {
        return function (str) {
            if (!str || arguments.length <= 1 && arguments[1] !== undefined) {
                return str;
            }

            var jsonObject = arguments[1];
            var oldStr = '';
            var safeCounter = 0;

            while (oldStr !== str && safeCounter++ < 20) {
                oldStr = str;
                for (var value in jsonObject) {
                    if (jsonObject.hasOwnProperty(value)) {
                        var reg = new RegExp('\\{' + value + '\\}', 'gm');
                        str = str.replace(reg, $filter('translate')(jsonObject[value]));
                    }
                }
            }

            return str;
        };
    }
})();
