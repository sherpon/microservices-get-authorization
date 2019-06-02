//"use strict";

// Get Development Env
require('./utilities/getEnv')();

const getToken = require('./utilities/getToken');
const getUserByToken = require('./utilities/getUserByToken');
const getConnection = require('./db/getConnection');
const getPermission = require('./db/getPermission');

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

  // get user information
  const userId = req.body.userId;
  const websiteId = req.body.websiteId;
    
  const myAuthentication = getToken(req.headers);
  if (myAuthentication===false) {
    // didn't find any token
    res.status(401);
    res.end();  // send no content
  } else {
    const myToken = myAuthentication.token;
    try {
      const uid = await getUserByToken(myToken);
      if (user.id!==uid) {
        // must be the same
        res.status(401);
        res.end();  // send no content
      } else {
        // Did the user request for website auth?
        if ( websiteId === undefined ) {
          // No
          res.status(202);
          res.end();  // return 202 ACCEPTED
        } else {
          // Yes
          const connection = getConnection();
          connection.connect();
          const permission = await getPermission(connection, userId, websiteId);
          connection.end();
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
        }
      }
    } catch (error) {
      console.log(error);
      res.status(401);
      res.end();  // send no content
    }
  }
};