/**
 * Database
 *
 * @author Lukas Heise
 */

 /* jshint node:true */
 /* jshint esversion: 6 */

(function () {
  "use strict";

    const mongoose = require('mongoose');

    const schemaSystem = {
        created: Date,
        locked: Date,
        deleted: Date,
        updated: Date,
        note: String,
        visible: mongoose.Schema.Types.Boolean,
        schemaVersion: mongoose.Schema.Types.Number
    };

    const schemaPerson = {
        userid: String,
        updateVersion: mongoose.Schema.Types.Number,
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
        userid: String,
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
        fromUserid: String,
        toUserid: String,
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
        userid: String,
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
        }
    };
})();