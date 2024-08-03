const dotenv = require('dotenv');
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const DATABASE_URL = isProduction
  ? process.env.PROD_DATABASE_URL
  : process.env.DEV_DATABASE_URL;

module.exports = { DATABASE_URL };
