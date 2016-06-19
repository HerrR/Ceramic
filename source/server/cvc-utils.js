/* jshint node:true */
/* jshint esversion: 6 */

/**
 * @module {Ceramic}
 * @parent main
 *
 * Contains static helper methods
 *
 * @author Lukas Heise
 */

(function () {
    "use strict";

    const fs = require('fs');
    const path = require('path');
    const nodemailer = require('nodemailer');
    const uuid = require('node-uuid');

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
        },

        saveFileWithUUID: function(folder, data, callback) {
            if (data) {
                var id = uuid.v4();
                while (fs.statSync(path.join(folder, id)).isFile()) {
                    id = uuid.v4();
                }

                fs.writeFile(path,join(folder, id), data, function(err) {
                    callback(id, err);
                });
            } else {
                callback(null, 'error.file.no_data');
            }
        },

        generateFileName: function(folder) {
            var id = uuid.v4();
            while (fs.statSync(path.join(folder, id)).isFile()) {
                id = uuid.v4();
            }

            return id;
        }
    };
})();