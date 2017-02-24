'use strict';

const product = require('../models/product');
const express = require('express');
const logger = require('../configs/logger');
const router = express.Router();

let result;

router.get('/list/:limit/:currPage', (req, res)=>{
    result = res;
    let attributes = ['id', 'name', 'status', 'sellingPrice', 'image'];
    let currPage = (req.params.currPage > 0) ? (req.params.currPage - 1) : 0 ;
    let limit = Number(req.params.limit);
    let offset = Number(currPage * limit);

    product.getList(attributes, offset, limit, _callbackHandler);
});

router.get('/:productId', (req, res)=>{
    result = res;
    let attributes = ['*'];
    let productId = req.params.productId;

    product.getById(attributes, productId, _callbackHandler);
});

router.post('/add', (req, res)=>{
    result = res;

    product.add(req.body, _callbackHandler);
});

router.put('/update/:productId', (req, res)=>{
    result = res;
    let productId = req.params.productId;

    product.update(productId, req.body, _callbackHandler);
});

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