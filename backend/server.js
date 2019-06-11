const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
var jwt = require('express-jwt');
const pathToRegexp = require('path-to-regexp');
const $config = require('./config.module')

app.use(express.urlencoded({ extended: true, limit: $config.limit_upload }))
app.use(express.json({limit: $config.limit_upload }))
app.use(cors())
app.use(morgan("short"))
app.use(jwt({ secret: $config.jwt_secret }).unless({
  path: [
    "/",
    pathToRegexp("/favicon.ico*"), 
    pathToRegexp("/css/*"), 
    pathToRegexp("/fonts/*"), 
    pathToRegexp("/img/*"), 
    pathToRegexp("/js/*"), 
    pathToRegexp("/rest/auth/*"), 
    "/rest/rols"]
}))

app.use(express.static('public'));

module.exports = app;