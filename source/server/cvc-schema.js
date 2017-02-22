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

const mongoose = require('mongoose');

(function () {
    "use strict";

    const System = {
        created: Date, // TODO: required
        locked: Date,
        deleted: Date,
        updated: Date,
        note: String,
        emailAuthenticated: mongoose.Schema.Types.Boolean, // TODO: required
        visible: mongoose.Schema.Types.Boolean, // TODO: required
        schemaVersion: mongoose.Schema.Types.Number, // TODO: required
        updateVersion: mongoose.Schema.Types.Number, // TODO: required
        authenticationProvider: String // TODO: required
    };

    const PersonSkill = {
        skilltype: String,
        level: mongoose.Schema.Types.Number
    };

    const PersonExperience = {
        company: String,
        industry: String,
        discipline: String,
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
        id: String, // TODO: unique, index
        name: String, // TODO: required
        mimetype: String, // TODO: required
        checksum: String,
        link: String, // TODO: required
        size: mongoose.Schema.Types.Number, // TODO: required
        added: Date, // TODO: required
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
        compensation: mongoose.Schema.Types.Number
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
        toDate: Date // can be null, no end date
    };

    const Person = {
        userid: { type: String, index: true, required: true, unique: true },
        email: { type: String, index: true, required: false },
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

    /**
     * Search criteria
     */
    const CompanySearchProfile = {
        education: {
            high_school_level: [{ requirement: String, type: String }],
            bachelor_level: [{ requirement: String, type: String }],
            master_level: [{ requirement: String, type: String }]
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
        userid: { type: String, index: true, required: true, unique: true },
        email: { type: String, index: true, required: false },
        updateVersion: { type: mongoose.Schema.Types.Number }, // TODO: required
        credits: { type: mongoose.Schema.Types.Number }, // TODO: required
        system: System,
        company: {
            basic: CompanyBasic,
            searchProfile: [CompanySearchProfile]
        }
    };

    const Admin = {
        userid: { type: String, required: true },
        level: { type: mongoose.Schema.Types.Number, required: true },
        start: { type: Date, required: true }
    };

    const Message = {
        fromUserid: { type: String, index: true, required: true },
        toUserid: { type: String, index: true, required: true },
        created: { type: Date, required: true },
        wasRead: { type: mongoose.Schema.Types.Boolean, required: true },
        wasRemoved: { type: mongoose.Schema.Types.Boolean, required: true },
        wasReplied: { type: mongoose.Schema.Types.Boolean, required: true },
        wasNotified: { type: mongoose.Schema.Types.Boolean, required: true },
        wasReported: { type: mongoose.Schema.Types.Boolean, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true }
    };

    const Receipt = {
        userid: { type: String, index: true, required: true },
        paymentDate: { type: Date, required: true },
        amount: { type: mongoose.Schema.Types.Number, required: true },
        currency: { type: String, required: true },
        method: { type: String, required: true },
        purchase: { type: String, required: true },
        transaction: { type: String, required: true }
    };

    // http://blog.mongodb.org/post/32866457221/password-authentication-with-mongoose-part-1
    const Account = {
        email: { type: String, required: true, index: { unique: true, required: true } },
        password: { type: String, required: true }
    };

    const SentEmail = {
        from: { type: String, required: true },
        to: { type: String, required: true },
        created: { type: Date, required: true }
    };

    const RawProfile = {
        provider: { type: String, required: true },
        created: { type: Date, required: true },
        data: { type: String, required: true }
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