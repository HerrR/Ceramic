/**
 * Authentication
 *
 * @author Lukas Heise
 */

 /* jshint node:true */
 /* jshint esversion: 6 */

(function () {
  "use strict";

    var config;
    var logger;

    module.exports = {
        init: function(_config, _logger) {
            config = _config;
            logger = _logger;
        },

        listEnabledMethods: function() {
            var list = [];

            if (config.authentication.local.enabled) {
                list.push('local');
            }

            if (config.authentication.http.enabled) {
                list.push('http');
            }

            if (config.authentication.facebook.enabled) {
                list.push('facebook');
            }

            if (config.authentication.google.enabled) {
                list.push('google');
            }

            if (config.authentication.twitter.enabled) {
                list.push('twitter');
            }

            return list;
        },

        ensureAuthenticated: function(req, res, next) {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.sendStatus(403);
            }
        }
    };
})();