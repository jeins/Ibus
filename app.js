'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');

const logger = require('./configs/logger');
const corsMiddleware = require('./middlewares/cors');

const productRoute = require('./routes/productRoute');
const customerRoute = require('./routes/customerRoute');

const app = express();

// server setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(errorHandler());

// middleware
app.use(corsMiddleware);

// api uri
app.use('/product', productRoute);
app.use('/customer', customerRoute);
app.use('/version', (req, res)=>{
    logger.log('info', 'get version');
    res.json({version: process.env.VERSION || '1.0.0'});
});

// catch 404 and forward to error handler
app.use((req, res, next)=>{
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: (app.get('env') === 'development') ? err : {}
    });
});


module.exports = app;