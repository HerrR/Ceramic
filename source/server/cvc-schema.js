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

    const PersonSkill = {
        type: String,
        level: mongoose.Schema.Types.Number
    };

    const PersonExperience = {
        company: String,
        industry: String,
        role: String,
        fromDate: Date,
        toDate: Date,
        responsibilities: [{
            type: String,
            amount: mongoose.Schema.Types.Number
        }]
    };

    const Attachment = {
        id: String,
        name: String,
        type: String,
        checksum: String,
        link: String,
        size: mongoose.Schema.Types.Number,
        added: Date
    };

    const PersonSettings = {
        recieveEmailNotifications: mongoose.Schema.Types.Boolean,
        searchable: mongoose.Schema.Types.Boolean
    };

    const PersonEducation = {
        school: String,
        degree: String,
        faculty: String,
        fromDate: Date,
        toDate: Date
    };

    const PersonLanguage = {
        name: String,
        level: mongoose.Schema.Types.Number
    };

    const PersonGeneralInfo = {
        language: [PersonLanguage],
        personalDescription: String,
        interests: String,
        otherMerits: String
    };

    const Person = {
        userid: { type: String, index: true },
        email: { type: String, index: true },
        system: System,
        settings: PersonSettings,
        person: {
            name: String,           // TODO: put in "general"
            profilePicture: String, // TODO: put in "general"
            dateOfBirth: Date, // TODO: put in "general"
            email: String,          // TODO: initialize to registered email, and put in general
            country: String, // TODO: put in "general"
            city: String, // TODO: put in "general"
            phone: String, // TODO: put in "general"
            
            cv: {
                skills: [PersonSkill],
                experience: [PersonExperience],
                education: [PersonEducation],
                generalInfo: PersonGeneralInfo
            },

            library: [Attachment]
        }
    };

    const Company = {
        userid: { type: String, index: true },
        email: { type: String, index: true },
        updateVersion: mongoose.Schema.Types.Number,
        credits: mongoose.Schema.Types.Number,
        system: System,
        company: {
            name: String, // TODO: put in "general"
            description: String, // TODO: put in "general"
            industry: String, // TODO: put in "general"

            // TODO: money
            // TODO: receipt

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
        level: mongoose.Schema.Types.Number,
        start: Date
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