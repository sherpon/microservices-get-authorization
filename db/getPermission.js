
/**
 * 
 * @param {Object} connection - MySQL connection object.
 * @param {String} userId
 * @param {Number} websiteId
 * @returns {Promise} -  User object.
 */
const getPermission = (connection, userId, websiteId) => {
  return new Promise((resolve, reject) => {
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
};

module.exports = getPermission;