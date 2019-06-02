const admin = require('firebase-admin');

/**
 * 
 * @param {String} token - Firebase authentication token.
 * @returns {Promise} - return the user's uid. 
 */
const getUserByToken = (token) => {
  
  if (!admin.apps.length) {
    if (process.env.SHERPON_ENV==='DEVELOPMENT') {
      admin.initializeApp({
        credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT)
      });
    } else {
      admin.initializeApp();
    }
  }

  return new Promise((resolve, reject) => {
    admin.auth().verifyIdToken(token)
    .then(function(decodedToken) {
      var uid = decodedToken.uid
      resolve(uid)
    })
    .catch(function(error) {
      // Handle error
      reject(new Error(error))
    })
  });
};

module.exports = getUserByToken;