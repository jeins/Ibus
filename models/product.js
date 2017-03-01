'use strict';

const logger = require('../configs/logger');
const uuid = require('uuid/v1');
const model = require('./');

let db;
let tableName = 'Products'; 

/**
 * @constructor
 */
function Product() {
    db = model.sequelize.import(tableName, (sequelize, DataTypes) => {
        return model.sequelize.define(tableName, tableFields(DataTypes));
    });
};

/**
 * @private
 */
function tableFields(DataTypes) {
    return {
        id: {type: DataTypes.STRING, primaryKey: true},
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        category: DataTypes.STRING,
        status: DataTypes.STRING,
        sellingPrice: DataTypes.STRING,
        purchasePrice: DataTypes.STRING,
        billImage: DataTypes.STRING,
        image: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    };
}

Product.prototype = {
    
    /**
     * db informations
     * @param DataTypes
     * @returns {*}
     */
    db: (DataTypes)=>{
        return {tableName: tableName, tableFields: tableFields(DataTypes)};
    },

    /**
     * get product from specific pagination
     * @param attributes
     * @param offset
     * @param limit
     * @param cb
     */
    getList: (attributes, offset, limit, cb) => {
        db.findAll({
            attributes: attributes,
            order: 'createdAt DESC',
            offset: offset,
            limit: limit
        })
            .then((products) => {
                logger.log('info', 'get products | offset: %s | limit: %s', offset, limit);

                cb(null, model.decodeJson(products));
            })
            .catch((err) => {
                logger.log('error', 'error on get products | error: %s | offset: %s | limit: %s', err.message, offset, limit);
                cb(model.errorHandler(err), null);
            });
    },

    /**
     * get product with specific id
     * @param attributes
     * @param productId
     * @param cb
     */
    getById: (attributes, productId, cb) => {
        let params = {where: {id: productId}};

        if(attributes[0] !== '*') params['attributes'] = attributes;

        db.find(params)
            .then((products) => {
                logger.log('info', 'get product by id | id: %s', productId);

                cb(null, model.decodeJson(products));
            })
            .catch((err) => {
                logger.log('error', 'error on get product by id | error: %s | id: %s', err.message, productId);
                cb(model.errorHandler(err), null);
            });
    },

    /**
     * add new product
     * @param data
     * @param cb
     */
    add: (data, cb) => {
        let attributes = ['name', 'description', 'category', 'status', 'purchasePrice', 'sellingPrice', 'billImage', 'image'];
        let productData = model.validateData(attributes, data);

        productData['id'] = uuid();

        db.create(productData)
            .then((result) => {
                let product = result.get();

                logger.log('history', 'create new product | details: %s', JSON.stringify(product));

                cb(null, model.decodeJson(product));
            })
            .catch((err) => {
                logger.log('error', 'error on create new product | error: %s', err.message);
                cb(model.errorHandler(err), null);
            });
    },

    /**
     * update product data
     * @param productId
     * @param newData
     * @param cb
     */
    update: (productId, newData, cb) => {
        let attributes = ['name', 'description', 'category', 'status', 'purchasePrice', 'sellingPrice', 'billImage', 'image'];
        let newProductData = model.validateData(attributes, newData);

        db.update(newProductData, {where: {id: productId}})
            .then((status) => {
                logger.log('history', 'update product | id: %s | status: %s | new data: %s', productId, status, JSON.stringify(newProductData));

                if (status) cb(null, {success: true});
                else cb(null, {success: false});
            })
            .catch((err) => {
                logger.log('error', 'error on update product | error: %s | id: %s | new data: %s', err.message, productId, JSON.stringify(newProductData));
                cb(model.errorHandler(err), null);
            });
    },

    /**
     * remove product
     * @param productId
     * @param cb
     */
    delete: (productId, cb) => {
        db.destroy({where: {id: productId}})
            .then((status) => {
                logger.log('history', 'delete product | id: %s | status: %s', productId, status);

                if (status) cb(null, {success: true});
                else cb(null, {success: false});
            })
            .catch((err) => {
                logger.log('error', 'error on delete product | error: %s | id: %s', err.message, productId);
                cb(model.errorHandler(err), null);
            });
    }
};

module.exports = new Product();