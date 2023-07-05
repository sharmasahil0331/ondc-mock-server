const config = require('../utils/config');
const log = require('../utils/logger');
const axios = require('axios');

//getting path object from config file

var logger;

const trigger = (context, config, data) => {
  logger = log.init();
  let uri = 'http://localhost:2010/';
  let api = config.callback;
  let delay = config.delay;
  try {
    console.log('uri', uri, uri + api);
    logger.info('Inside trigger service');
    setTimeout(() => {
      axios
        .post(`${uri + api}`, data)
        .then((response) => {
          logger.info(`Triggered ${api} response at ${uri}${api}`);
        })
        .catch(function (error) {
          console.log(error);
          logger.error(error);
        });
    }, delay);
  } catch (error) {
    logger.error(`!!Error while triggering the response,`, error);
  }
};

module.exports = { trigger };
