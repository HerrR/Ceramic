/* jshint node:true */
/* jshint esversion: 6 */
/* jshint esnext: true */

/**
 * Ceramic - Main Server Startup

 * Environment Variables
 * =====================
 * SESSION_KEY = express sesstion
 * FACEBOOK_APP_ID = facebook app id
 * FACEBOOK_APP_SECRET = facebook secret id
 * DB_USERNAME = mongodb user
 * DB_PASSWORD = mongodb password
 */

(function () {
  "use strict";

  const os = require('os');
  const fs = require('fs');
  const https = require('https');
  const log4js = require('log4js');
  const uuid = require('node-uuid');
  const chalk = require('chalk');

  const cvcEndpoint = require('./cvc-endpoint');

  const config = require(process.argv[2] || '../../config/dev.json');
  const numCPUs = os.cpus().length;
  const numClusters = config.server.clusters === 0 ? numCPUs : config.server.clusters;

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

  cvcEndpoint.init(config, logger);

  const server = https.createServer({
    cert: fs.readFileSync(config.server.https.cert),
    key: fs.readFileSync(config.server.https.key)
  }, cvcEndpoint.getApp());
  
  process.stdin.resume();
  process.on('exit', exitHandler.bind(null, {cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

  logger.info('Number of clusters: ' + numClusters);
  logger.info('Number of CPU\'s: ' + numCPUs);
  logger.info('Starting directory: ' + __dirname);
  logger.info('Serving static files: ' + config.server.staticFiles);

  server.listen(config.server.port, function() {
    logger.info('Started application on port: ' + config.server.port);
  });
}());