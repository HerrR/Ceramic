/* jshint node:true */
/* jshint esversion: 6 */

/**
 * @module {Ceramic}
 * @parent main
 *
 * Database Schemas
 *
 * @author Lukas Heise
 */

(function () {
  "use strict";

  const mongoose = require('mongoose');

  const System = {
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

    const Person = {
        userid: { type: String, index: true },
        email: { type: String, index: true },
        system: System,
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

    const Company = {
        userid: { type: String, index: true },
        email: { type: String, index: true },
        updateVersion: mongoose.Schema.Types.Number,
        system: System,
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

    const Admin = {
        userid: String,
        level: mongoose.Schema.Types.Number
    };

    const Message = {
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

    const Receipt = {
        userid: { type: String, index: true },
        paymentDate: Date,
        amount: mongoose.Schema.Types.Number,
        currency: String,
        method: String,
        purchase: String,
        transaction: String
    };

    module.exports = {
        getSchemas: function() {
            return {
                system: System,
                person: Person,
                company: Company,
                admin: Admin,
                message: Message,
                receipt: Receipt
            };
        }
    };
})();