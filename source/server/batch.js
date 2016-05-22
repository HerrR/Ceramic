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
  const log4js = require('log4js');
  const chalk = require('chalk');

  const config = require(process.argv[2] || '../../config/dev.json');

  function exitHandler(options, err) {
    if (options.cleanup) {
      // TODO: cleanup
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

  const logger = log4js.getLogger('base');
  log4js.configure(config.log4js.config);
  logger.setLevel(config.log4js.level);

  process.stdin.resume();
  process.on('exit', exitHandler.bind(null, {cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

  // TODO: load and run batch tasks

  // TODO: setup watch for datasets

  // TODO: do not terminate this program when it comes to the end
}());