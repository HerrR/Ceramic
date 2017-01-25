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
    },
  };

  function readJsonFileSync(filepath) {
    return JSON.parse(fs.readFileSync(filepath));
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