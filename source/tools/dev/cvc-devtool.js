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
    }
  };

  function readJsonFileSync(filepath) {
    return JSON.parse(fs.readFileSync(filepath));
  }

  function createPersons(data) {
    if (data.person && data.person.length > 0) {
      for (let personIndex = 0; personIndex < data.person.length; ++personIndex) {
        const object = data.person[personIndex];
        var newPerson = new cvcDatabase.getDatamodels().Person(object);
        newPerson.save(function(err) {
          if (err) {
            logger.error(err);
          } else {
            console.log(chalk.green('New Person: ' + object.userid));
          }
        });
      }
    }
  }

  function createCompanies(data) {
    if (data.company && data.company.length > 0) {
      for (let companyIndex = 0; companyIndex < data.company.length; ++companyIndex) {
        const object = data.company[companyIndex];
        var newCompany = new cvcDatabase.getDatamodels().Company(object);
        newCompany.save(function(err) {
          if (err) {
            logger.error(err);
          } else {
            console.log(chalk.green('New Company: ' + object.userid));
          }
        });
      }
    }
  }

  function createAdmins(data) {
    if (data.admin && data.admin.length > 0) {
      for (let adminIndex = 0; adminIndex < data.admin.length; ++adminIndex) {
        const object = data.admin[adminIndex];
        var newAdmin = new cvcDatabase.getDatamodels().Admin(object);
        newAdmin.save(function(err) {
          if (err) {
            logger.error(err);
          } else {
            console.log(chalk.green('New Admin: ' + object.userid));
          }
        });
      }
    }
  }

  function createMessages(data) {
    if (data.message && data.message.length > 0) {
      for (let messageIndex = 0; messageIndex < data.message.length; ++messageIndex) {
        const object = data.message[messageIndex];
        var newMessage = new cvcDatabase.getDatamodels().Message(object);
        newMessage.save(function(err) {
          if (err) {
            logger.error(err);
          } else {
            console.log(chalk.green('New Message: ' + object.fromUserid));
          }
        });
      }
    }
  }

  function createReceipts(data) {
    if (data.receipt && data.receipt.length > 0) {
      for (let receiptIndex = 0; receiptIndex < data.receipt.length; ++receiptIndex) {
        const object = data.receipt[receiptIndex];
        var newReceipt = new cvcDatabase.getDatamodels().Receipt(object);
        newReceipt.save(function(err) {
          if (err) {
            logger.error('Failed to save Receipt: ' + JSON.stringify(object));
          } else {
            console.log(chalk.green('New Receipt: ' + object.userid));
          }
        });
      }
    }
  }

  function fillDatabase() {
    if (program.fill) {
      console.log(chalk.cyan('Executing function Fill (' + program.fill + ')...'));
      const data = readJsonFileSync(program.fill);

      if (cvcDatabase.getReadyState() === 1) {
        createPersons(data);
        createCompanies(data);
        createAdmins(data);
        createMessages(data);
        createReceipts(data);
      } else {
        logger.error('Failed to connect to MongoDB');
      }
    }
  }

  program
    .version('CV121 Devtool v1.0.0')
    .option('-c, --config [configfile]','Specify config file to load')
    .option('-f, --fill [datafile]', 'Fill database with data')
    // NOTE: add more options here
    .parse(process.argv);

    if (program.config) {
      console.log(chalk.yellow('Loading config file (' + program.config +')...'));
      const config = require(program.config);

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