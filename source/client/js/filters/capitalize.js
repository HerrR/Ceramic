/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .filter('capitalize', Capitalize);

    // ex: "HELLO world" => "Hello World"
    function Capitalize() {
        return function (input, scope) {
            if (input !== undefined) {
                return input.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }
        };
    }
})();
