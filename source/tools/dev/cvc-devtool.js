#!/usr/bin/env node

/* jshint node:true */
/* jshint esversion: 6 */

/**
 * Developer Tools for CV121
 *
 * @author Lukas Heise
 */

const program = require('commander');
const async = require('async-kit');
const log4js = require('log4js');
const chalk = require('chalk');
const fs = require('fs');

const cvcDatabase = require('../../server/cvc-database');

const dataUser = require('./data.json');
const dataCompetencyHierarchy = require('../../../database/datasets/competency_hierarchy.json');
const dataDomainExperience = require('../../../database/datasets/domain_experience.json');
const dataEducationFaculty = require('../../../database/datasets/education_faculty.json');
const dataEducationHighSchoolMajor = require('../../../database/datasets/education_high_school_major.json');
const dataEducationLevel = require('../../../database/datasets/education_level.json');
const dataIndustry = require('../../../database/datasets/industry.json');
const dataLanguageLevel = require('../../../database/datasets/language_level.json');
const dataProfession = require('../../../database/datasets/professions.json');
const dataRoles = require('../../../database/datasets/roles.json');
const dataSpecificExperience = require('../../../database/datasets/specific_experience.json');

(function () {
  'use strict';

  const logger = {
    info: function(text) {
      console.log(chalk.yellow(text));
    },

    warn: function(text) {
      console.log(chalk.red('Warning: ' + text));
    },

    error: function(text) {
      console.log(chalk.red('Error: ' + text));
    },
  };

  function readJsonFileSync(filepath) {
    return JSON.parse(fs.readFileSync(filepath));
  }

  function randomData(dataArray) {
    const count = dataArray ? dataArray.length : 0;

    if (count == 0) {
      return '';
    }

    return dataArray[Math.floor(Math.random()*(count+1))];
  }

  function generateData() {
    if (program.generate && program.generate > 0) {
      logger.info('Generating data: ' + program.generate);
      
      var persons = [];

      for (var i = 0; i < program.generate; i++) {
        const userid = 'LOCAL_' + ("000000" + (i+1)).slice(-6);

        const CV = {
          generalInfo: {
            language: [
              // TODO
            ]

            //personalDescription: String,
            //interests: String,
            //otherMerits: String,
            //compensation: Number
          },
          education: [
            // TODO

            //school: String,
            //degree: String,
            //faculty: String,
            //fromDate: Date,
            //toDate: Date,
            //description: String
          ],
          experience: [
            // TODO

            //company: String,
            //profession: String,
            //industry: String,
            //discipline: String,
            //role: String,
            //description: String,
            //fromDate: Date,
            //toDate: Date,
            //keyCompetencies: [String],
            //responsibilities: [{
            //  resptype: String,
            //  amount: mongoose.Schema.Types.Number
            //}]
          ],
          skills: [
            // TODO

            //skilltype: String,
            //level: mongoose.Schema.Types.Number
          ],
          high_school: {
            // TODO

            //name: String,
            //fromDate: Date,
            //toDate: Date,
            //faculty: String
          }
        };

        const person = {
          userid: userid,
          email: userid + '@test.com',
          system: {
            created: 1004745600000,
            updated: 1004745600000,
            note: "",
            visible: true,
            schemaVersion: 1,
            authenticationProvider: "LOCAL",
            updateVersion: 1
          },

          person: {
            library: [],
            cv: CV,
            basic: {
              name: randomData(dataUser.names),
              profilePicture: randomData(dataUser.profilePictures),
              email: userid + '@test.com',
              country: randomData(dataUser.countries),
              city: randomData(dataUser.cities),
              dateOfBirth: randomData(dataUser.dateOfBirths),
              phone: ("0000000000" + (i+1)).slice(-10)
            }
          }
        };

        persons.push(person);
      }

      console.log(JSON.stringify({person: persons}));
      logger.info('Done generating data');
    }
  }

  function fillDatabase() {
    if (program.fill) {
      console.log(chalk.cyan('Executing function Fill (' + program.fill + ')...'));
      const data = readJsonFileSync(program.fill);

      if (cvcDatabase.getReadyState() === 1) {
        if (data.person && data.person.length > 0) {
          for (var i = 0; i < data.person.length; ++i) {
            const object = data.person[i];
            var newObject = new cvcDatabase.getDatamodels().Person(object);
            newObject.save(function(err) {
              if (err) {
                logger.error(err);
              } else {
                console.log(chalk.green('New Person: ' + object.userid));
              }
            });
          }
        }

        if (data.company && data.company.length > 0) {
          for (var i = 0; i < data.company.length; ++i) {
            const object = data.company[i];
            var newObject = new cvcDatabase.getDatamodels().Company(object);
            newObject.save(function(err) {
              if (err) {
                logger.error(err);
              } else {
                console.log(chalk.green('New Company: ' + object.userid));
              }
            });
          }
        }

        if (data.admin && data.admin.length > 0) {
          for (var i = 0; i < data.admin.length; ++i) {
            const object = data.admin[i];
            var newObject = new cvcDatabase.getDatamodels().Admin(object);
            newObject.save(function(err) {
              if (err) {
                logger.error(err);
              } else {
                console.log(chalk.green('New Admin: ' + object.userid));
              }
            });
          }
        }

        if (data.message && data.message.length > 0) {
          for (var i = 0; i < data.message.length; ++i) {
            const object = data.message[i];
            var newObject = new cvcDatabase.getDatamodels().Message(object);
            newObject.save(function(err) {
              if (err) {
                logger.error(err);
              } else {
                console.log(chalk.green('New Message: ' + object.fromUserid));
              }
            });
          }
        }

        if (data.receipt && data.receipt.length > 0) {
          for (var i = 0; i < data.receipt.length; ++i) {
            const object = data.receipt[i];
            var newObject = new cvcDatabase.getDatamodels().Receipt(object);
            newObject.save(function(err) {
              if (err) {
                logger.error('Failed to save Receipt: ' + JSON.stringify(object));
              } else {
                console.log(chalk.green('New Receipt: ' + object.userid));
              }
            });
          }
        }
      } else {
        logger.error('Failed to connect to MongoDB');
      }
    }
  }

  program
    .version('CV121 Devtool v1.0.0')
    .option('-c, --config [configfile]','Specify config file to load')
    .option('-f, --fill [datafile]', 'Fill database with data')
    .option('-g, --generate [rowcount]', 'Generate testdata')
    // NOTE: add more options here
    .parse(process.argv);

    if (program.config) {
      console.log(chalk.yellow('Loading config file (' + program.config +')...'));
      const config = require(program.config);

      if (program.fill) {
        console.log(chalk.yellow('Initializing database...'));
        cvcDatabase.init(config,logger, function() {
          async.series([
            fillDatabase()
          ])
          .exec(function(error, result) {
            if (error) {
              logger.error(error);
            }
          });
        });
      }

      generateData();
    }

    function exitHandler(options, err) {
      if (options.cleanup) {
        console.log(chalk.green('All commands executed, shutting down...'));
        cvcDatabase.close();
      }

      if (err) {
        console.log(chalk.red(err.stack));
        logger.error(err.stack);
      }

      if (options.exit) {
        process.exit();
      }
    }

    process.stdin.resume();
    process.on('exit', exitHandler.bind(null, {cleanup:true}));
    process.on('SIGINT', exitHandler.bind(null, {exit:true}));
    process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
}());