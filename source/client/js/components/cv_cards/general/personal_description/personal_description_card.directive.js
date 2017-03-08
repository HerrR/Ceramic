/* global angular */

(function() {
    'use strict';

    angular
        .module('cvc')
        .directive('personalDescriptionCard', Directive);

    function Directive() {
        return {
            restrict: 'E',
            scope: {
                personaldescription:"=",
                ondelete:"&",
                onsave:"&"
            },
            templateUrl: 'partials/person/cv/cards/personal_description_card.html',
            controller: 'PersonalDescriptionCardController'
        };
    }
})();
