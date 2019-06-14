
/**
 * 
 * @param {Object} firestore - Firestore object.
 * @param {String} userId
 * @param {Number} websiteId
 * @returns {Promise} -  User object.
 */
const getPermission = (firestore, userId, websiteId) => {
  return new Promise((resolve, reject) => {
    firestore.collection('websites').doc(websiteId).get()
    .then(function(doc) {
      if (doc.exists) {
        const website = {...doc.data()};
        const permissionType = website.permissions[userId];
        if (permissionType===undefined) {
          resolve(false);
        } else {
          resolve(permissionType);
        }
      } else {
        // doc.data() will be undefined in this case
        resolve(false);
      }
    }).catch(function(error) {
      // console.log("Error getting document:", error);
      reject(error);
    });
  });
};

module.exports = getPermission;

/**
 * return new Promise((resolve, reject) => {
    if (userId === undefined || websiteId === undefined) {
      resolve(false);
    }
    
    const sql = `
    SELECT * FROM Permissions 
    WHERE userId LIKE '${userId}' 
    AND websiteId = ${websiteId}
    `;
    connection.query(sql, (error, results, fields) => {
      if (error) {
        //reject(error);
        reject(new Error(error));
        //throw error;
      }

      // connected!
      if (results.length===0) {
        resolve(false);
      } else {
        const row = results[0];
        resolve(row.type);
      }
    });
  });
 */