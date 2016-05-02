/**
 * Ceramic - Main Server Startup
 */

 /* jshint node:true */
 /* jshint esversion: 6 */

 /**
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
  const path = require('path');
  const https = require('https');
  const log4js = require('log4js');
  const cluster = require('cluster');
  const uuid = require('node-uuid');
  const chalk = require('chalk');
  
  const cvcUtils = require('./cvc-utils');
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

  var logger = log4js.getLogger('base');
  log4js.configure(config.log4js.config);
  logger.setLevel(config.log4js.level);

  cvcUtils.init(config, logger);
  cvcEndpoint.init(config, logger);

  var server = https.createServer({
    cert: fs.readFileSync(config.server.https.cert),
    key: fs.readFileSync(config.server.https.key)
  }, cvcEndpoint.getApp());
  
  process.stdin.resume();
  process.on('exit', exitHandler.bind(null, {cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

  logger.info('Number of clusters: ' + numClusters);
  logger.info('Starting directory: ' + __dirname);
  logger.info('Serving static files: ' + config.server.staticFiles);

  server.listen(config.server.port, function() {
    logger.info('Started application on port: ' + config.server.port);
  });
}());