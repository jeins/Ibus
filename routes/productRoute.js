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
router.post('/filter/:limit/:currPage', (req, res)=>{
    result = res;
    let attributes = ['id', 'name', 'status', 'sellingPrice', 'image'];
    let currPage = (req.params.currPage > 0) ? (req.params.currPage - 1) : 0 ;
    let limit = Number(req.params.limit);
    let offset = Number(currPage * limit);
    let filter = req.body.filter;

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
        let doConvertPrice = (obj)=>{
            if(_.hasIn(obj, 'sellingPrice')) _convertPrice(obj.sellingPrice);
            if(_.hasIn(obj, 'purchasePrice')) _convertPrice(obj.purchasePrice);
        };

        let doConvertImage = (obj)=>{
            if(_.hasIn(obj, 'image')) obj.image = _convertImage(obj.image);
            if(_.hasIn(obj, 'billImage')) obj.billImage = _convertImage(obj.billImage);
        };

        if(_.isArray(product)){
            _.forEach(product, (prod)=>{
                doConvertPrice(prod);
                doConvertImage(prod);
            });
        } else{
            doConvertPrice(product);
            doConvertImage(product);
        }

        result.json(product);
    }
}

function _convertImage(img){
    if(!img.includes('jpg')) return img;

    let tmpArr = img.split('.');
    let imgName;

    if(tmpArr.length > 2){
        _.forEach(tmpArr, (tmp)=>{
            imgName += tmp;
        })
    } else{
        imgName = tmpArr[0];
    }

    return '/image/' + imgName + '/' + tmpArr[tmpArr.length - 1];
}

function _convertPrice(obj){
    let priceText = [];

    if(obj.currency === 'rupiah'){
        let n = 3;
        let val = obj.value.toString();
        let i;

        for(i=n; i < val.length; i+=n){
            priceText.push(val.substr(val.length - i, n));
        }

        priceText = _.reverse(priceText);

        let txt = '.' + _.join(priceText, '.');
        let rest = val.replace(_.join(priceText, ''), '');

        obj['text'] = 'Rp ' + ((rest === '.') ? txt : (txt === '.') ? rest : rest + txt);
    } else{
        //TODO
        obj['text'] = obj.value + ' €';
    }
}

module.exports = router;