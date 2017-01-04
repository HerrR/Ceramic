#!/usr/bin/env node

/* jshint node:true */
/* jshint esversion: 6 */

/**
 * Developer Tools for CV121
 *
 * @author Lukas Heise
 */

/**
 * Module dependencies.
 */

const program = require('commander');
const log4js = require('log4js');
const chalk = require('chalk');
const fs = require('fs');

const cvcDatabase = require('../../server/cvc-database');

(function () {
  'use strict';

  var config;

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
    // TODO: more options
    .parse(process.argv);

    if (program.config) {
      console.log(chalk.yellow('Loading config file (' + program.config +')...'));
      config = require(program.config);

      console.log(chalk.yellow('Initializing database...'));
      cvcDatabase.init(config,logger);
    }

    if (program.fill) {
      console.log(chalk.cyan('Executing function Fill...'));
      const data = readJsonFileSync(program.fill);

      // while (cvcDatabase.getReadyState() != 1) {}

      // TODO: JSON should contain a list of object per schema
      // system: System, person: Person, company: Company, admin: Admin, message: Message, receipt: Receipt
    }

    console.log(chalk.green('All commands executed, shutting down...'));
    process.exit();
}());