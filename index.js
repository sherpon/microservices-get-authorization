//"use strict";

// Get Development Env
require('./utilities/getEnv')();

const getToken = require('./utilities/getToken');
const getFirebase = require('./firebase/getFirebase');
const getUserByToken = require('./firebase/getUserByToken');
const getConnection = require('./db/getConnection');
const getPermission = require('./db/getPermission');

let connection;
let firebase;

const getWebsiteAuthorizationStep = async (req, res) => {
  try {
    const userId = req.body.userId;
    const websiteId = req.body.websiteId;
    connection = getConnection(connection);
    const permission = await getPermission(connection, userId, websiteId);
    if (permission===false) {
      res.status(401);
      res.end();  // send 401 UNAUTHORIZED no content
    } else {
      const result = {
        permissionType: permission,
      };
      res.status(202);
      res.send(result);  // return 202 ACCEPTED
    }
  } catch (error) {
    console.error(error);
    res.status(401);
    res.end();  // send no content
  }
};

const getUserAuthorizationStep = async (req, res) => {
  try {
    const userId = req.body.userId;
    const myToken = req.userToken;
    firebase = getFirebase(firebase);
    const uid = await getUserByToken(firebase, myToken);
    if (userId!==uid) {
      // must be the same
      res.status(401);
      res.end();  // send no content
    } else {
      const websiteId = req.body.websiteId;
      // Did the user request for website auth?
      if ( websiteId === undefined ) {
        // No
        res.status(202);
        res.end();  // return 202 ACCEPTED
      } else {
        // Yes
        await getWebsiteAuthorizationStep(req, res);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(401);
    res.end();  // send no content
  }
};

/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.getAuthorization = async (req, res) => {
  const myAuthentication = getToken(req.headers);
  if (myAuthentication===false) {
    // didn't find any token
    res.status(401);
    res.end();  // send no content
  } else {
    // populate
    req.userToken = myAuthentication.token;
    await getUserAuthorizationStep(req, res);
  }
};