'use strict';

const product = require('../models/product');
const express = require('express');
const logger = require('../configs/logger');
const _ = require('lodash');
const router = express.Router();

let result;

/**
 * retrieve all products with pagination
 */
router.get('/list/:limit/:currPage', (req, res)=>{
    result = res;
    let attributes = ['id', 'name', 'status', 'sellingPrice', 'image'];
    let currPage = (req.params.currPage > 0) ? (req.params.currPage - 1) : 0 ;
    let limit = Number(req.params.limit);
    let offset = Number(currPage * limit);

    product.getList(attributes, offset, limit, '', _callbackHandler);
});

/**
* retrieve products from specific condition
*/
router.post('/filter', (req, res)=>{
    result = res;
    let attributes = ['id', 'name', 'status', 'sellingPrice', 'image'];
    let filter = req.body.filter;
    let pagination = (_.hasIn(req.body, 'pagination')) ? req.body.pagination : '';
    let limit, offset;

    if(pagination){
        let currPage = (pagination.currPage > 0) ? (pagination.currPage - 1) : 0 ;
        limit = Number(pagination.limit);
        offset = Number(currPage * limit);
    }

    product.getList(attributes, offset, limit, filter, _callbackHandler);
});

/**
 * retrieve product with specific id
 */
router.get('/:productId', (req, res)=>{
    result = res;
    let attributes = ['*'];
    let productId = req.params.productId;

    product.getById(attributes, productId, _callbackHandler);
});

/**
 * add new product
 */
router.post('/add', (req, res)=>{
    result = res;

    product.add(req.body, _callbackHandler);
});

/**
 * update product with specific id
 */
router.put('/update/:productId', (req, res)=>{
    result = res;
    let productId = req.params.productId;

    product.update(productId, req.body, _callbackHandler);
});

/**
 * remove product with specific id
 */
router.delete('/delete/:productId', (req, res)=>{
    result = res;
    let productId = req.params.productId;

    product.delete(productId, _callbackHandler);
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