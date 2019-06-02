/**
 * 
 * @param {Object} admin - Is a firebase-admin instance
 * @param {String} token - Firebase authentication token.
 * @returns {Promise} - return the user's uid. 
 */
const getUserByToken = (admin, token) => {
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