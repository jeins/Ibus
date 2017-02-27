'use strict';

const logger = require('../configs/logger');
const uuid = require('uuid/v1');
const model = require('./');

let db;
let tableName = 'Customers';

/**
 * @constructor
 */
function Customer() {
    db = model.sequelize.import(tableName, (sequelize, DataTypes) => {
        return model.sequelize.define(tableName, tableFields(DataTypes));
    });
}

/**
 * @private
 */
function tableFields(DataTypes) {
    return {
        id: {type: DataTypes.STRING, primaryKey: true},
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        postcode: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    };
}

Customer.prototype = {

    /**
     * db informations
     * @param DataTypes
     * @returns {*}
     */
    db: (DataTypes)=>{
        return {db: db, tableName: tableName, tableFields: tableFields(DataTypes)};
    },

    /**
     * get customer with specific id
     * @param attributes
     * @param customerId
     * @param cb
     */
    getById: (attributes, customerId, cb) => {
        let params = {where: {id: customerId}};

        if(attributes[0] !== '*') params[attributes] = attributes;

        db.find(params)
            .then((customer) => {
                logger.log('info', 'get customer by id | id: %s', customerId);

                cb(null, model.decodeJson(customer));
            })
            .catch((err) => {
                logger.log('error', 'error on get customer by id | error: %s | id: %s', err.message, customerId);
                cb(model.errorHandler(err), null);
            });
    },

    /**
     * add new customer
     * @param data
     * @param cb
     */
    add: (data, cb) => {
        let attributes = ['name', 'address', 'postcode', 'phoneNumber'];
        let customerData = model.validateData(attributes, data);

        customerData['id'] = uuid();

        db.create(customerData)
            .then((result) => {
                let customer = result.get();

                logger.log('history', 'create new customer | details: %s', JSON.stringify(customer));

                cb(null, customer);
            })
            .catch((err) => {
                logger.log('error', 'error on create new customer | error: %s', err.message);
                cb(model.errorHandler(err), null);
            });
    },

    /**
     * update customer data
     * @param customerId
     * @param newData
     * @param cb
     */
    update: (customerId, newData, cb) => {
        let attributes = ['name', 'address', 'postcode', 'phoneNumber'];
        let newCustomerData = model.validateData(attributes, newData);

        db.update(newCustomerData, {where: {id: customerId}})
            .then((status) => {
                logger.log('history', 'update customer | id: %s | status: %s | new data: %s', customerId, status, JSON.stringify(newCustomerData));

                if (status) cb(null, {success: true});
                else cb(null, {success: false});
            })
            .catch((err) => {
                logger.log('error', 'error on update customer | error: %s | id: %s | new data: %s', err.message, customerId, JSON.stringify(newCustomerData));
                cb(model.errorHandler(err), null);
            });
    },

    /**
     * remove customer
     * @param customerId
     * @param cb
     */
    delete: (customerId, cb) => {
        db.destroy({where: {id: customerId}})
            .then((status) => {
                logger.log('history', 'delete customer | id: %s | status: %s', customerId, status);

                if (status) cb(null, {success: true});
                else cb(null, {success: false});
            })
            .catch((err) => {
                logger.log('error', 'error on delete customer | error: %s | id: %s', err.message, customerId);
                cb(model.errorHandler(err), null);
            });
    }
};

module.exports = new Customer();