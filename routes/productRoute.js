'use strict';

const m = require('../models');
const express = require('express');
const uuid = require('uuid/v1');
const logger = require('../configs/logger');
const router = express.Router();

router.get('/list/:currPage/:limit', (req, res)=>{
    let attributes = ['id', 'name', 'status', 'sellingPrice'];
    let currPage = req.params.currPage;
    let limit = Number(req.params.limit);
    let offset = Number(currPage * limit);

    m.Products
        .findAll({
            attributes: attributes,
            order: 'createdAt DESC',
            offset: offset,
            limit: limit
        })
        .then((products)=>{
            logger.log('info', 'get products | currPage: %s | limit: %s', currPage, limit);

            res.json(products);
        })
        .catch((err)=>{
            logger.log('error', 'error on get products | error: %s | currPage: %s | limit: %s', err.message, currPage, limit);
            res.status(500).send({error:true, message: err.message});
        });
});

router.post('/add', (req, res)=>{
    m.Products
        .create({
            id: uuid(),
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            status: req.body.status,
            purchasePrice: req.body.purchasePrice,
            sellingPrice: req.body.sellingPrice,
            billImage: req.body.billImage,
            image: req.body.image
        })
        .then((result)=>{
            let product = result.get();

            logger.log('verbose', 'create new product | details: %s', JSON.stringify(product));

            res.json(product);
        })
        .catch((err)=>{
            logger.log('error', 'error on create new product | error: %s', err.message);
            res.status(500).send({error:true, message: err.message});
        });
});

module.exports = router;