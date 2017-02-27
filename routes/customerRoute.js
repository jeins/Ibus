'use strict';

const customer = require('../models/customer');
const express = require('express');
const logger = require('../configs/logger');
const _ = require('lodash');
const router = express.Router();

let result;

/**
 * retrieve customer with specific id
 */
router.get('/:customerId', (req, res)=>{
    result = res;
    let attributes = ['*'];
    let customerId = req.params.customerId;

    customer.getById(attributes, customerId, _callbackHandler);
});

/**
 * add new customer
 */
router.post('/', (req, res)=>{
    result = res;

    customer.add(req.body, _callbackHandler);
});

/**
 * update customer with specific id
 */
router.put('/:customerId', (req, res)=>{
    result = res;
    let customerId = req.params.customerId;

    customer.update(customerId, req.body, _callbackHandler);
});

/**
 * remove customer with specific id
 */
router.delete('/:customerId', (req, res)=>{
    result = res;
    let customerId = req.params.customerId;

    customer.delete(customerId, _callbackHandler);
});

function _callbackHandler(error, product){
    if(error) {
        result.status(500).send(error);
    }
    else {
        result.json(product);
    }
}

module.exports = router;