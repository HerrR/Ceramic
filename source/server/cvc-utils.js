/**
 * Contains static helper methods
 *
 * @author Lukas Heise
 */

 /* jshint node:true */
 /* jshint esversion: 6 */

(function () {
  "use strict";

    const fs = require('fs');
    const nodemailer = require('nodemailer');

    var config;
    var logger;

    var emailTransporter;

    module.exports = {
        init: function(_config, _logger) {
            config = _config;
            logger = _logger;

            emailTransporter = nodemailer.createTransport(config.server.email.transporter);
        },

        /**
         * Reads file content and tries to parse it as a JSON file.
         */
        readJsonFileSync: function(filepath, defaultValue, doCrash) {
            try {
                return JSON.parse(fs.readFileSync(filepath));
            } catch (err) {
                logger.error('Failed to load: ' + filepath);
                if (doCrash) {
                    throw err;
                }
            }
            return defaultValue;
        },


        /**
         * Sends an email.
         */
        sendEmail: function(recipient, subject, text, html) {
            var mailOptions = {
                from: config.server.email.from,
                to: recipient,
                subject: subject,
                text: text,
                html: html
            };

            emailTransporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    return logger.error(error);
                }

                logger.info('Message sent: ' + info.response);
            });
        }
    };
})();