'use strict';

const order = require('../models/order');
const express = require('express');
const logger = require('../configs/logger');
const _ = require('lodash');
const router = express.Router();

let result;

/**
 * retrieve order with specific id
 */
router.get('/:orderId', (req, res)=>{
    result = res;
    let orderId = req.params.orderId;
    let attributes = ['*'];
    let customerAttributes = ['name', 'address', 'postcode'];
    let productAttributes = ['id', 'name', 'category', 'status', 'image'];

    order.getById(orderId, attributes, customerAttributes, productAttributes, _callbackHandler);
});

/**
 * retrieve order with specific product id
 */
router.get('/product/:productId', (req, res)=>{
    result = res;
    let productId = req.params.productId;
    let attributes = ['*'];
    let customerAttributes = ['name', 'address', 'postcode'];

    order.getByProduct(productId, attributes, customerAttributes, _callbackHandler);
});

/**
 * retrieve all ordered products with pagination
 */
router.get('/list/:limit/:currPage', (req, res)=>{
    result = res;
    let attributes = ['*'];
    let productAttributes = ['id', 'name', 'category', 'status', 'image'];
    let currPage = (req.params.currPage > 0) ? (req.params.currPage - 1) : 0 ;
    let limit = Number(req.params.limit);
    let offset = Number(currPage * limit);

    order.getList(attributes, productAttributes, offset, limit, _callbackHandler);
});

/**
 * add new order
 */
router.post('/', (req, res)=>{
    result = res;

    order.add(req.body, _callbackHandler);
});

/**
 * update order with specific id
 */
router.put('/:orderId', (req, res)=>{
    result = res;
    let orderId = req.params.orderId;

    order.update(orderId, req.body, _callbackHandler);
});

/**
 * remove order with specific id
 */
router.delete('/:orderId', (req, res)=>{
    result = res;
    let orderId = req.params.orderId;

    order.delete(orderId, _callbackHandler);
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