'use strict';

const logger = require('../configs/logger');
const uuid = require('uuid/v1');
const model = require('./');
const async = require('async');
const customer = require('./customer');
const product = require('./product');

let db;
let customerDb; 
let tableName = 'Orders';

/**
 * @constructor
 */
function Order() {
    db = model.sequelize.import(tableName, (sequelize, DataTypes) => {
        customerDb = customer.db(DataTypes)

        return model.sequelize.define(tableName, tableFields(DataTypes));
    });

    db.belongsTo(customerDb.db);
    customerDb.db.hasMany(db);
}

/**
 * @private
 */
function tableFields(DataTypes) {
    return {
        id: {type: DataTypes.STRING, primaryKey: true},
        customerId: {type: DataTypes.STRING, references: {model: customerDb.tableName, key: 'id'}, onUpdate: 'cascade', onDelete: 'cascade'},
        productId: DataTypes.STRING,
        discount: DataTypes.STRING,
        shippingPrice: DataTypes.STRING,
        totalPrice: DataTypes.STRING,
        paidFinished: DataTypes.BOOLEAN,
        firstTransferImage: DataTypes.STRING,
        receiptImage: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    };
}

Order.prototype = {

    /**
     * db informations
     * @param DataTypes
     * @returns {*}
     */
    db: (DataTypes)=>{
        return {tableName: tableName, tableFields: tableFields(DataTypes)};
    },

    /**
     * get order with specific id
     * @param orderId
     * @param attributes
     * @param customerAttributes
     * @param productAttributes
     * @param cb
     */
    getById: (orderId, attributes, customerAttributes, productAttributes, cb) => {
        let params = {
            where: {id: orderId},
            include: [
                {model: customerDb.db}
            ]
        };

        if(attributes[0] !== '*') params[attributes] = attributes;
        if(customerAttributes[0] !== '*') params.include[0]['attributes'] = customerAttributes;

        db.find(params)
            .then((orderResult) => {
                let order = model.decodeJson(orderResult);

                if(order){
                    order['Product'] = [];

                    async.mapSeries(order.productId, (productId, cb2)=>{
                        product.getById(productAttributes, productId, (err, result)=>{
                            if(result) {
                                order['Product'].push(result);
                                cb2(null, order);
                            } else{
                                cb2(err, null);
                            }
                        });
                    }, (err, result)=>{
                        if(err) {
                            logger.log('error', 'error on get order by id | error: %s | id: %s', err.message, orderId);

                            cb(err, null);
                        }
                        else {
                            logger.log('info', 'get order by id | id: %s', orderId);

                            cb(null, order);
                        }
                    });
                } else{
                    cb(null, order);
                }
            })
            .catch((err) => {
                logger.log('error', 'error on get order by id | error: %s | id: %s', err.message, orderId);
                cb(model.errorHandler(err), null);
            });
    },

    /**
     * add new order
     * @param data
     * @param cb
     */
    add: (data, cb) => {
        let attributes = ['customerId', 'productId', 'discount', 'shippingPrice', 'totalPrice', 'paidFinished', 'firstTransferImage', 'receiptImage'];
        let orderData = model.validateData(attributes, data);

        orderData['id'] = uuid();

        db.create(orderData)
            .then((result) => {
                let order = result.get();

                logger.log('history', 'create new order | details: %s', JSON.stringify(order));

                cb(null, order);
            })
            .catch((err) => {
                logger.log('error', 'error on create new order | error: %s', err.message);
                cb(model.errorHandler(err), null);
            });
    },

    /**
     * update order data
     * @param orderId
     * @param newData
     * @param cb
     */
    update: (orderId, newData, cb) => {
        let attributes = ['productId', 'discount', 'shippingPrice', 'totalPrice', 'paidFinished', 'firstTransferImage', 'receiptImage'];
        let newOrderData = model.validateData(attributes, newData);

        db.update(newOrderData, {where: {id: orderId}})
            .then((status) => {
                logger.log('history', 'update order | id: %s | status: %s | new data: %s', orderId, status, JSON.stringify(newOrderData));

                if (status) cb(null, {success: true});
                else cb(null, {success: false});
            })
            .catch((err) => {
                logger.log('error', 'error on update order | error: %s | id: %s | new data: %s', err.message, orderId, JSON.stringify(newOrderData));
                cb(model.errorHandler(err), null);
            });
    },

    /**
     * remove order
     * @param orderId
     * @param cb
     */
    delete: (orderId, cb) => {
        db.destroy({where: {id: orderId}})
            .then((status) => {
                logger.log('history', 'delete order | id: %s | status: %s', orderId, status);

                if (status) cb(null, {success: true});
                else cb(null, {success: false});
            })
            .catch((err) => {
                logger.log('error', 'error on delete order | error: %s | id: %s', err.message, orderId);
                cb(model.errorHandler(err), null);
            });
    }
};

module.exports = new Order();