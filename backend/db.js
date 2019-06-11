const mysql = require('mysql')
const $config = require("./config.module")

var config = {
  user: $config.database_user,
  password: $config.database_password,
  database: $config.database_name,
  host: $config.database_host,
  port: $config.database_port,
  connectionLimit: 10,
}

if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
  config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
} 

module.exports = mysql.createPool(config)