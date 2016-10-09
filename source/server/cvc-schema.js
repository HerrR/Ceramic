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
        emailAuthenticated: mongoose.Schema.Types.Boolean,
        visible: mongoose.Schema.Types.Boolean,
        schemaVersion: mongoose.Schema.Types.Number,
        updateVersion: mongoose.Schema.Types.Number,
        authenticationProvider: String
    };

    const PersonSkill = {
        skilltype: String,
        level: mongoose.Schema.Types.Number
    };

    const PersonExperience = {
        company: String,
        industry: String,
        profession: String,
        role: String,
        description: String,
        fromDate: Date,
        toDate: Date,
        keyCompetencies: [String],
        responsibilities: [{
            resptype: String,
            amount: mongoose.Schema.Types.Number
        }]
    };

    const Attachment = {
        id: { type: String, required: true, index: { unique: true } },
        name: String,
        mimetype: String,
        checksum: String,
        link: String,
        size: mongoose.Schema.Types.Number,
        added: Date,
        validContent: mongoose.Schema.Types.Boolean,
        maliciousContent: mongoose.Schema.Types.Boolean,
        scanned: Date
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
        toDate: Date,
        description: String
    };

    const PersonLanguage = {
        name: String,
        level: mongoose.Schema.Types.Number
    };

    const PersonGeneralInfo = {
        language: [PersonLanguage],
        personalDescription: String,
        interests: String,
        otherMerits: String,
        compensation: Number
    };

    const PersonBasic = {
        name: String,
        profilePicture: String,
        dateOfBirth: Date,
        email: String,
        country: String,
        city: String,
        phone: String
    };

    const PersonHighSchool = {
        name: String,
        fromDate: Date,
        toDate: Date,
        faculty: String
    };

    const PersonCV = {
        skills: [PersonSkill],
        experience: [PersonExperience],
        high_school: PersonHighSchool,
        education: [PersonEducation],
        generalInfo: PersonGeneralInfo
    };

    const PersonAuthorizedUser = {
        userid: { type: String, required: true },
        fromDate: { type: Date, required: true },
        toDate: Date
    };

    const Person = {
        userid: { type: String, index: true, required: true },
        email: { type: String, required: true, index: { unique: true } },
        system: System,
        settings: PersonSettings,
        person: {
            basic: PersonBasic,
            cv: PersonCV,
            library: [Attachment]
        },

        authorizedUsers: [PersonAuthorizedUser]
    };

    const CompanyBasic = {
        name: String,
        description: String,
        industry: String
    };

    const CompanySearchProfile = {
        education: {
            level: [{ requirement: String, type: String }],
            faculty: [{ requirement: String, type: String }],
            major: [{ requirement: String, type: String }]
        },
        experience: {
            industry: [{ requirement: String, type: String }],
            function: [{ requirement: String, type: String }],
            position: [{ requirement: String, type: String }],
            language: [{ requirement: String, type: String }],
            keywords: [String],
            compensation: { currency: String, amount: mongoose.Schema.Types.Number },
            location: { country: String, city: String }
        }
    };

    const Company = {
        userid: { type: String, index: true, required: true },
        email: { type: String, required: true, index: { unique: true } },
        updateVersion: mongoose.Schema.Types.Number,
        credits: mongoose.Schema.Types.Number,
        system: System,
        company: {
            basic: CompanyBasic,
            searchProfile: [CompanySearchProfile]
        }
    };

    const Admin = {
        userid: String,
        level: mongoose.Schema.Types.Number,
        start: Date
    };

    const Message = {
        fromUserid: { type: String, index: true, required: true },
        toUserid: { type: String, index: true, required: true },
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

    // http://blog.mongodb.org/post/32866457221/password-authentication-with-mongoose-part-1
    const Account = {
        email: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true }
    };

    // TODO: sent emails

    // TODO: login providers profile data

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