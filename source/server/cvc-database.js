/* jshint node:true */
/* jshint esversion: 6 */
/* jshint esnext: true */

/**
 * @module {Ceramic}
 * @parent main
 *
 * Database
 *
 * @author Lukas Heise
 */

(function () {
  "use strict";
    
    const PERSON_SCHEMA_VERSION = 1;

    const mongoose = require('mongoose');

    const schemaSystem = {
        created: Date,
        locked: Date,
        deleted: Date,
        updated: Date,
        note: String,
        visible: mongoose.Schema.Types.Boolean,
        schemaVersion: mongoose.Schema.Types.Number,
        updateVersion: mongoose.Schema.Types.Number,
        authenticationProvider: String
    };

    const schemaPerson = {
        userid: { type: String, index: true },
        email: { type: String, index: true },
        system: schemaSystem,
        settings: {
            recieveEmailNotifications: mongoose.Schema.Types.Boolean
        },
        person: {
            name: String,
            description: String,
            dateOfBirth: Date,
            searchable: mongoose.Schema.Types.Boolean,
            skills: [{
                type: String,
                level: mongoose.Schema.Types.Number
            }],
            experience: {
                company: String,
                industry: String,
                fromDate: Date,
                toDate: Date,
                responsibilities: [{
                    type: String,
                    amount: mongoose.Schema.Types.Number
                }]
            }
        }
    };

    const schemaCompany = {
        userid: { type: String, index: true },
        email: { type: String, index: true },
        updateVersion: mongoose.Schema.Types.Number,
        system: schemaSystem,
        company: {
            name: String,
            description: String,
            industry: String,
            searchCriteria: {
                skills: [{
                type: String,
                minLevel: mongoose.Schema.Types.Number
            }],
            responsibilities: [{
                type: String,
                minAmount: mongoose.Schema.Types.Number
            }]
        }
    }
    };

    const schemaAdmin = {
        userid: String,
        level: mongoose.Schema.Types.Number
    };

    const schemaMessage = {
        fromUserid: { type: String, index: true },
        toUserid: { type: String, index: true },
        created: Date,
        wasRead: mongoose.Schema.Types.Boolean,
        wasRemoved: mongoose.Schema.Types.Boolean,
        wasReplied: mongoose.Schema.Types.Boolean,
        wasNotified: mongoose.Schema.Types.Boolean,
        wasReported: mongoose.Schema.Types.Boolean,
        subject: String,
        message: String
    };

    const schemaReceipt = {
        userid: { type: String, index: true },
        paymentDate: Date,
        amount: mongoose.Schema.Types.Number,
        currency: String,
        method: String,
        purchase: String,
        transaction: String
    };

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
            // TODO: clamp texts like name etc..
            return profile;
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
                authenticationProvider: authenticationProvider,
                updateVersion: 0
            };
        }
    };
})();