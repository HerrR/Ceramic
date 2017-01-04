/* jshint node:true */
/* jshint esversion: 6 */

/**
 * @module {Ceramic}
 * @parent main
 *
 * Database
 *
 * @author Lukas Heise
 */

const mongoose = require('mongoose');

const cvcSchema = require('./cvc-schema');

const schemaPerson = cvcSchema.getSchemas().person;
const schemaCompany = cvcSchema.getSchemas().company;
const schemaAdmin = cvcSchema.getSchemas().admin;
const schemaMessage = cvcSchema.getSchemas().message;
const schemaReceipt = cvcSchema.getSchemas().receipt;

(function () {
    "use strict";
    
    const PERSON_SCHEMA_VERSION = 1;

    var config;
    var logger;
    var database = mongoose.connection;

    var datamodels = {
        Person: undefined,
        Company: undefined,
        Admin: undefined,
        Message: undefined,
        Receipt: undefined
    };

    function connectToDatabase() {
        try {
            var dbUser = process.env.DB_USERNAME || config.server.database.username;
            var dbPass = process.env.DB_PASSWORD || config.server.database.password;
            var dbUrl = config.server.database.url;
            dbUrl = dbUrl.replace('{username}',dbUser).replace('{password}',dbPass);

            // TODO: bcrypt = require(bcrypt), SALT_WORK_FACTOR = 10;

            mongoose.connect(dbUrl);
        } catch (err) {
            logger.error('Failed to connect to database: ' + config.server.database.url);
            throw err;
        }
    }

    module.exports = {
        init: function(_config, _logger) {
            config = _config;
            logger = _logger;

            database.on('error', logger.error);
            database.once('open', function() {
                logger.info('Connected to MongoDB');

                datamodels.Person = mongoose.model('Person', new mongoose.Schema(schemaPerson));
                datamodels.Company = mongoose.model('Company', new mongoose.Schema(schemaCompany));
                datamodels.Admin = mongoose.model('Admin', new mongoose.Schema(schemaAdmin));
                datamodels.Message = mongoose.model('Message', new mongoose.Schema(schemaMessage));
                datamodels.Receipt = mongoose.model('Receipt', new mongoose.Schema(schemaReceipt));
            });

            connectToDatabase();
        },

        close: function() {
            database.close();
        },

        getDatamodels: function() {
            return datamodels;
        },

        hideSecretProfileData: function(profileData) {
            if (profileData) {
                profileData._id = undefined;
                profileData.__v = undefined;
                profileData.system = undefined;
                profileData.userid = undefined;
            }
        },

        mergeProfileData: function(dst, src) {
            dst.system.updated = new Date();

            if (dst.system.locked === undefined) {
                if (dst.person !== undefined) {
                    src.person.library = dst.person.library;
                    
                    dst.settings = src.settings;
                    dst.person = src.person;

                }

                if (dst.company !== undefined) {
                    dst.company = src.company;
                }
            } else {
                logger.warn('User ' + dst.userid + ' tried to update locked data.');
            }

            dst.system.updateVersion++;
        },

        validateProfile: function(profile) {
            // TODO: do not save if there are validation errors, return error message?
            return profile;
        },

        getGeneralStatistics: function(callback) {
            // TODO: get general information like number of users and so on
        },

        createSystemObject: function(authenticationProvider) {
            return {
                created: new Date(),
                locked: undefined,
                deleted: undefined,
                updated: new Date(),
                note: '',
                visible: true,
                schemaVersion: PERSON_SCHEMA_VERSION,
                authenticationProvider: authenticationProvider.toUpperCase(),
                updateVersion: 0
            };
        },

        /**
         * 0 = disconnected
         * 1 = connected
         * 2 = connecting
         * 3 = disconnecting
         */
        getReadyState: function() {
            return mongoose.connection.readyState;
        }
    };
})();