const { getPublicKey } = require("../utils/utils");
const {  signNack,invalidNack } = require("../utils/acknowledgement");
const log = require("../utils/logger");
const config = require("../utils/config");
const { validateRequest, verifyHeader } = require("./validation");

//getting path object from config file

var paths;
var props;
var security;
var logger;
var server;

const onRequest = async (req, res) => {
  if (paths == undefined) {
    logger = log.init();
    props = config.getConfig();
    security = props.security;
    server = props.server;
    paths = props.path;
  }
  try {
    const { api } = req.params;
    logger.info(`Received ${req.url} api request`);
    if (security.verify_sign) {
      if (!await verifyHeader(req, security)){
        // Handle the case when signature is not verified
        res.status(400).json(signNack);
        logger.error("Authorization header not verified");
        return; // Make sure to return to exit the function
    } 
  }

    //getting the callback url from config file
    let callbackConfig;
    let context;
    if (paths[api]) {
      // TODO add senario selection
      context = {
        req_body: req.body,
        apiConfig: paths[api],
      };
      callbackConfig = paths[api]?.callbacks?.default;
    } else {
      logger.error("Invalid Request");
      return res.json(invalidNack);
    }
    
    logger.info(`Validating ${api} request`);
    await validateRequest(context, callbackConfig, res, security, server);
  } catch (error) {
    logger.error("ERROR!!", error);
    console.trace(error);
  }
};

module.exports = { onRequest };
