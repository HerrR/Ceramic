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

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const uuid = require('node-uuid');

(function () {
    "use strict";

    var config;
    var logger;

    var emailTransporter;

    module.exports = {
        init: function(_config, _logger) {
            config = _config;
            logger = _logger;

            emailTransporter = nodemailer.createTransport(config.server.email.transporter);
        },

        getUUID: function() {
            return uuid.v4();
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

                // TODO: log this to the database

                logger.info('Message sent: ' + info.response);
            });
        },

        saveFileWithUUID: function(folder, data, callback) {
            if (data) {
                var id = this.generateFileName(folder);

                fs.writeFile(path,join(folder, id), data, function(err) {
                    callback(id, err);
                });
            } else {
                callback(null, 'error.file.no_data');
            }
        },

        generateFileName: function(folder) {
            var id = this.getUUID();
            while (fs.statSync(path.join(folder, id)).isFile()) {
                id = this.getUUID();
            }

            return id;
        }
    };
})();