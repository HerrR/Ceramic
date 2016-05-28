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

  /*
  cacheClient.set("string key", "string val", redis.print);
  cacheClient.hset("hash key", "hashtest 1", "some value", redis.print);
  cacheClient.hset(["hash key", "hashtest 2", "some other value"], redis.print);
  cacheClient.hkeys("hash key", function (err, replies) {
      console.log(replies.length + " replies:");
      replies.forEach(function (reply, i) {
          console.log("    " + i + ": " + reply);
      });
      cacheClient.quit();
  });

  https://www.npmjs.com/package/redis
  */

  function readDataset(filename, defaultValue, doCrash) {
    return cvcUtils.readJsonFileSync(path.join(config.server.datasets.folder,filename), defaultValue, doCrash);
  }

  function reloadDataset(filename, name) {
    logger.info('Reloading: ' + name);

    var oldCache = {} // TODO: load from cache
    var newCache = readDataset(filename, oldCache, false);

    // TODO: update cache
    // TODO: brodcast message
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

    cacheClient.on('message', function(channel, message) {
      logger.info('Redis message: channel=' + channel + ", message=" + message);
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

      // TODO: reload cities
      // TODO: reload skills
      // TODO: reload categories
      // TODO: reload languages
    }
  }

  function fillCache() {
    /*datasets = {
      translations: readDataset(config.server.datasets.translations,{},true),
      countries: readDataset(config.server.datasets.countries,{},true),
      skills: {},
      skilllevels: {},
      industries: {},
      roles: {},
      schooldegrees: {},
      schoolfaculties: {},
      languages: {}
    };*/
  }

  function initScheduledTasks() {
    // initalize scheduled tasts
  }

  function initialize() {
    initCacheServer();

    fillCache();

    watch(config.server.datasets.watch, watchDatasets);
    
    initScheduledTasks();
  }

  function close() {
    cacheClient.quit();
    // close scheduled tasks
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