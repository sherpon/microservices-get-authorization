/**
 * reference https://cloud.google.com/functions/docs/sql
 */

const mysql = require('mysql');

/**
 * @returns {Object} - returns the mysql connection object
 */
const getConnection = () => {
  const mysqlConfig = {
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  };

  if (process.env.SHERPON_ENV==='DEVELOPMENT') {
    mysqlConfig.host = process.env.MYSQL_HOST;
    mysqlConfig.port = process.env.MYSQL_PORT;
  } else {
    mysqlConfig.socketPath = process.env.INSTANCE_CONNECTION_NAME;
  }

  const connection = mysql.createConnection(mysqlConfig);

  return connection;
};

module.exports = getConnection;