const dotenv = require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const TOKEN_SECRET=process.env.TOKEN_SECRET;

module.exports = {
  PORT,MONGODB_URL,TOKEN_SECRET
  
};