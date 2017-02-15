'use strict';

const models = require('../models');
const express = require('express');
const uuid = require('uuid/v1');
const router = express.Router();

router.get('/test', (req, res)=>{
    res.json({hello: 'world'});
});

router.post('/create', (req, res)=>{
    models.Products.create({
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
        .then((product)=>{res.json(product.get())})
        .catch((err)=>{res.status(500).send({error:true, message: err.message});});
});

module.exports = router;