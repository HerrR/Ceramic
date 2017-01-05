#!/usr/bin/env node

/* jshint node:true */
/* jshint esversion: 6 */

/**
 * Developer Tools for CV121
 *
 * @author Lukas Heise
 */

const program = require('commander');
const log4js = require('log4js');
const chalk = require('chalk');
const fs = require('fs');

const cvcDatabase = require('../../server/cvc-database');

(function () {
  'use strict';

  var pendingTasks = 0;

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
      cvcDatabase.init(config,logger);
    }

    if (program.fill) {
      console.log(chalk.cyan('Executing function Fill...'));
      const data = readJsonFileSync(program.fill);

      /*const startTime = new Date().getTime();
      while (cvcDatabase.getReadyState() != 1) {
        const newTime = new Date().getTime();
        if (newTime - startTime > 5000) {
          break;
        }
      }*/

      if (cvcDatabase.getReadyState() === 1) {
        if (data.person && data.person.length > 0) {
          for (var i = 0; i < data.person.length; ++i) {
            pendingTasks++;
            var newObject = new cvcDatabase.getDatamodels().Person(data.person[i]);
            newObject.save(function(err) {
              if (err) {
                logger.error('Failed to save Person: ' + JSON.stringify(data.person[i]));
              } else {
                console.log(chalk.green('New Person: ' + data.person[i].userid));
              }
              pendingTasks--;
            });
          }
        }

        if (data.company && data.company.length > 0) {
          for (var i = 0; i < data.company.length; ++i) {
            pendingTasks++;
            var newObject = new cvcDatabase.getDatamodels().Company(data.company[i]);
            newObject.save(function(err) {
              if (err) {
                logger.error('Failed to save Company: ' + JSON.stringify(data.company[i]));
              } else {
                console.log(chalk.green('New Company: ' + data.company[i].userid));
              }
              pendingTasks--;
            });
          }
        }

        if (data.admin && data.admin.length > 0) {
          for (var i = 0; i < data.admin.length; ++i) {
            pendingTasks++;
            var newObject = new cvcDatabase.getDatamodels().Admin(data.admin[i]);
            newObject.save(function(err) {
              if (err) {
                logger.error('Failed to save Admin: ' + JSON.stringify(data.admin[i]));
              } else {
                console.log(chalk.green('New Admin: ' + data.admin[i].userid));
              }
              pendingTasks--;
            });
          }
        }

        if (data.message && data.message.length > 0) {
          for (var i = 0; i < data.message.length; ++i) {
            pendingTasks++;
            var newObject = new cvcDatabase.getDatamodels().Message(data.message[i]);
            newObject.save(function(err) {
              if (err) {
                logger.error('Failed to save Message: ' + JSON.stringify(data.message[i]));
              } else {
                console.log(chalk.green('New Message: ' + data.message[i].userid));
              }
              pendingTasks--;
            });
          }
        }

        if (data.receipt && data.receipt.length > 0) {
          for (var i = 0; i < data.receipt.length; ++i) {
            pendingTasks++;
            var newObject = new cvcDatabase.getDatamodels().Receipt(data.receipt[i]);
            newObject.save(function(err) {
              if (err) {
                logger.error('Failed to save Receipt: ' + JSON.stringify(data.receipt[i]));
              } else {
                console.log(chalk.green('New Receipt: ' + data.receipt[i].userid));
              }
              pendingTasks--;
            });
          }
        }
      } else {
        logger.error('Failed to connect to MongoDB');
      }
    }

    while (pendingTasks > 0) {
      for (var i = 10; i > 0; --i) {
        const startTime = new Date().getTime();
        while (new Date().getTime() - startTime < 1000 && pendingTasks > 0) {}
        if (pendingTasks === 0) {
          break;
        }
        console.log(chalk.grey('Waiting for tasks to complete: number of tasks left is ' + pendingTasks + ', waiting up to ' + i + ' more seconds.'));
      }
    }

    console.log(chalk.green('All commands executed, shutting down...'));
    process.exit();
}());