/**
 * Get the environment variables. 
 * 
 * See this issue to understand why use this function
 * https://github.com/googlearchive/cloud-functions-emulator/issues/178
 */
const getEnv = () => {

  if (process.env.SHERPON_ENV===undefined) {
    const ENV =  require('../env/.env.json');
    
    // copy the env variables
    process.env.SHERPON_ENV = ENV.SHERPON_ENV;
    process.env.FIREBASE_SERVICE_ACCOUNT = ENV.FIREBASE_SERVICE_ACCOUNT;
    process.env.MICROSERVICES_ENDPOINT = ENV.MICROSERVICES_ENDPOINT;
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN = ENV.ACCESS_CONTROL_ALLOW_ORIGIN;
    process.env.MYSQL_HOST = ENV.MYSQL_HOST;
    process.env.MYSQL_PORT = ENV.MYSQL_PORT;
    process.env.MYSQL_USER = ENV.MYSQL_USER;
    process.env.MYSQL_PASSWORD = ENV.MYSQL_PASSWORD;
    process.env.MYSQL_DATABASE = ENV.MYSQL_DATABASE;
  }
}

module.exports = getEnv;