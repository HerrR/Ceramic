/* jshint node:true */
/* jshint esversion: 6 */

/**
 * Batch Program
 *
 * @author Lukas Heise
 */

(function () {
  "use strict";

  const fs = require('fs');
  const chalk = require('chalk');
  const redis = require("redis");
  const log4js = require('log4js');
  const watch = require('node-watch');
  const schedule = require('node-schedule');

  const config = require(process.argv[2] || '../../config/dev.json');

  function initialize() {
    // TODO: setup watch for datasets
    // TODO: setup cron jobs
  }

  function close() {
    // TODO: cleanup
  }

  function exitHandler(options, err) {
    if (options.cleanup) {
      close();
      console.log(chalk.blue('Shutting Down...'));
    }

    if (err) {
      console.log(chalk.red(err.stack));
      logger.error(err.stack);
    }

    if (options.exit) {
      process.exit();
    }
  }

  const logger = log4js.getLogger('batch');
  log4js.configure(config.log4js.config);
  logger.setLevel(config.log4js.level);

  process.stdin.resume();
  process.on('exit', exitHandler.bind(null, {cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

  initialize();
  logger.info('Batch Started...');
}());