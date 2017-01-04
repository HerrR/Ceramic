#!/usr/bin/env node

/* jshint node:true */
/* jshint esversion: 6 */

/**
 * Batch Program
 *
 * @author Lukas Heise
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const redis = require("redis");
const log4js = require('log4js');
const watch = require('node-watch');
const schedule = require('node-schedule');

const cvcUtils = require('./cvc-utils');

const config = require(process.argv[2] || '../config.json');

(function () {
  "use strict";

  var logger;
  var datasets;
  var cacheClient;

  function reloadDataset(filename) {
    logger.info('Loading: ' + filename);

    var newCache = cvcUtils.readJsonFileSync(filename, undefined, false);
    if (newCache && newCache.name && newCache.data) {
      logger.info('Loaded: ' + filename);

      var name = newCache.name;
      var data = newCache.data;

      logger.info('Update Cache: ' + name);
      cacheClient.set(name, JSON.stringify(data), redis.print);
      cacheClient.publish('update', name);
    } else {
      logger.error('Will not update cache for: ' + filename);
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
      reloadDataset(filename);
    }
  }

  function fillCache() {
    for (var index = 0; index < config.server.datasets.watch.length; ++index) {
      reloadDataset(config.server.datasets.watch[index]);
    }
  }

  function sendEmailNotifications() {
    // TODO: send notification e-mails
  }

  function initScheduledTasks() {
    // TODO: initalize scheduled tasks

    // TODO: task 1 => send email notifications
    // TODO: task 2 => remove all files that are marked for removal since 1 week
    // TODO: task 3 => find new files to mark for removal
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