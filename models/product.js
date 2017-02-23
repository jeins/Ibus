'use strict';

const logger = require('../configs/logger');
const _ = require('lodash');
const uuid = require('uuid/v1');
const model = require('./');

let db;

function Products() {
    let tableName = 'Products';

    db = model.sequelize.import(tableName, (sequelize, DataTypes) => {
        return model.sequelize.define(tableName, {
            id: {type: DataTypes.STRING, primaryKey: true},
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            category: DataTypes.STRING,
            status: DataTypes.STRING,
            sellingPrice: DataTypes.STRING,
            purchasePrice: DataTypes.STRING,
            billImage: DataTypes.STRING,
            image: DataTypes.STRING
        });
    });
};

Products.prototype = {
    getList: (attributes, offset, limit, cb) => {
        db.findAll({
            attributes: attributes,
            order: 'createdAt DESC',
            offset: offset,
            limit: limit
        })
            .then((products) => {
                logger.log('info', 'get products | offset: %s | limit: %s', offset, limit);

                cb(null, _decodeJson(JSON.stringify(products)));
            })
            .catch((err) => {
                logger.log('error', 'error on get products | error: %s | offset: %s | limit: %s', err.message, offset, limit);
                cb(_errorHandler(), null);
            });
    },

    add: (data, cb) => {
        let attributes = ['name', 'description', 'category', 'status', 'purchasePrice', 'sellingPrice', 'billImage', 'image'];
        let productData = _validateData(attributes, data);

        productData['id'] = uuid();

        db.create(productData)
            .then((result) => {
                let product = result.get();

                logger.log('verbose', 'create new product | details: %s', JSON.stringify(product));

                cb(null, product);
            })
            .catch((err) => {
                logger.log('error', 'error on create new product | error: %s', err.message);
                cb(_errorHandler(), null);
            });
    },

    update: (productId, newData, cb) => {
        let attributes = ['name', 'description', 'category', 'status', 'purchasePrice', 'sellingPrice', 'billImage', 'image'];
        let newProductData = _validateData(attributes, newData);

        db.update(newProductData, {where: {id: productId}})
            .then((status) => {
                logger.log('verbose', 'update product | id: %s | status: %s | new data: %s', productId, status, JSON.stringify(newProductData));

                if (status) cb(null, {success: true});
                else cb(null, {success: false});
            })
            .catch((err) => {
                logger.log('error', 'error on update product | error: %s | id: %s | new data: %s', err.message, productId, JSON.stringify(newProductData));
                cb(_errorHandler(), null);
            });
    },

    delete: (productId, cb) => {
        db.destroy({where: {id: productId}})
            .then((status) => {
                logger.log('verbose', 'delete product | id: %s | status: %s', productId, status);

                if (status) cb(null, {success: true});
                else cb(null, {success: false});
            })
            .catch((err) => {
                logger.log('error', 'error on delete product | error: %s | id: %s', err.message, productId);
                cb(_errorHandler(), null);
            });
    }
};

function _validateData(allowedFields, data) {
    let obj = {};

    _.forEach(allowedFields, (field) => {
        if (_.isObject(data[field])) {
            data[field] = JSON.stringify(data[field]);
        }

        obj[field] = _.hasIn(data, field) ? data[field] : '';
    });

    return obj;
}

function _decodeJson(objs) {
    objs = JSON.parse(objs);

    _.forEach(objs, (obj) => {
        _.forEach(obj, (value, key) => {
            try {
                obj[key] = JSON.parse(value);
            } catch (e) {
            }
        });
    });

    return objs;
}

function _errorHandler() {
    return {
        error: true,
        message: err.message
    };
}

module.exports = new Products();