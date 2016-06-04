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
  const path = require('path');
  const chalk = require('chalk');
  const redis = require("redis");
  const log4js = require('log4js');
  const watch = require('node-watch');
  const schedule = require('node-schedule');

  const cvcUtils = require('./cvc-utils');

  const config = require(process.argv[2] || '../../config/dev.json');

  var logger;
  var datasets;
  var cacheClient;

  function readDataset(filename, defaultValue, doCrash) {
    return cvcUtils.readJsonFileSync(path.join(config.server.datasets.folder,filename), defaultValue, doCrash);
  }

  function reloadDataset(filename, name) {
    logger.info('Reloading: ' + name);

    var newCache = readDataset(filename, undefined, false);

    if (newCache !== undefined) {
      cacheClient.set(name, JSON.stringify(newCache), redis.print);
      cacheClient.publish('update', name);
    }
  }

  function initCacheServer() {
    cacheClient = redis.createClient(config.redis);
    
    cacheClient.on('error', function (err) {
      logger.error('Redis Error: ' + err);
    });

    cacheClient.on('ready', function() {
      logger.info('Redis is ready');
    });

    cacheClient.on('connect', function() {
      logger.info('Connected to Redis');
    });

    cacheClient.on('reconnecting', function(delay, attempt) {
      logger.info('Reconnected to Redis: delay=' + delay + ' attempt=' + attempt);
    });

    cacheClient.on('end', function() {
      logger.info('Redis End');
    });

    cacheClient.on('warning', function(warn) {
      logger.warn('Redis Warning: ' + warn);
    });

    cacheClient.on('subscribe', function(channel, count) {
      logger.info('Redis Subscribe: channel=' + channel + ' count=' + count);
    });

    cacheClient.on('message', function(channel, message) {
      logger.info('Redis message: channel=' + channel + ' message=' + message);
    });
  }

  function watchDatasets(filename) {
    if (config.server.datasets.watchEnabled) {
      logger.info('Watch triggered on file: ' + filename);

      if (filename.indexOf(config.server.datasets.translations) > -1) {
        reloadDataset(config.server.datasets.translations, 'translations');
      }

      if (filename.indexOf(config.server.datasets.countries) > -1) {
        reloadDataset(config.server.datasets.countries, 'countries');
      }

      if (filename.indexOf(config.server.datasets.cities) > -1) {
        reloadDataset(config.server.datasets.countries, 'cities');
      }

      if (filename.indexOf(config.server.datasets.languages) > -1) {
        reloadDataset(config.server.datasets.countries, 'languages');
      }

      // TODO: reload cities
      // TODO: reload skills
      // TODO: reload categories
    }
  }

  function fillCache() {
    reloadDataset(config.server.datasets.translations, 'translations');
    reloadDataset(config.server.datasets.countries, 'countries');
    reloadDataset(config.server.datasets.cities, 'cities');
    reloadDataset(config.server.datasets.languages, 'languages');

    /*
      skills: {},
      skilllevels: {},
      industries: {},
      roles: {},
      schooldegrees: {},
      schoolfaculties: {},
    */
  }

  function sendEmailNotifications() {
    // TODO: send notification e-mails
  }

  function initScheduledTasks() {
    // TODO: initalize scheduled tasks
  }

  function initialize() {
    cvcUtils.init(config, logger);
    initCacheServer();
    fillCache();
    watch(config.server.datasets.watch, watchDatasets);
    initScheduledTasks();
  }

  function close() {
    cacheClient.quit();
    // TODO: close scheduled tasks
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

  logger = log4js.getLogger('batch');
  log4js.configure(config.log4js.config);
  logger.setLevel(config.log4js.level);

  process.stdin.resume();
  process.on('exit', exitHandler.bind(null, {cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

  initialize();
  logger.info('Batch Started...');
}());