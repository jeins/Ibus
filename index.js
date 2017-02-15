'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');

const logger = require('./configs/logger');
const corsMiddleware = require('./middlewares/cors');

dotenv.load({ path: '.env.example' });

const app = express();

// server setup
app.set('port', process.env.PORT || 1234);
app.set('host', process.env.HOST || 'localhost');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(errorHandler());

// middleware
app.use(corsMiddleware);

// api uri
app.get('/version', (req, res)=>{
    logger.log('info', 'get version');
    res.json({version: process.env.VERSION || '1.0.0'});
});

app.listen(app.get('port'), app.get('host'), ()=>{
    console.log('Service is running at http://%s:%d in %s mode', app.get('host'), app.get('port'), app.get('env'));
});

module.exports = app;