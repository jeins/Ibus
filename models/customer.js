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
        return {tableName: tableName, tableFields: tableFields(DataTypes)};
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

                logger.log('verbose', 'create new customer | details: %s', JSON.stringify(customer));

                cb(null, customer);
            })
            .catch((err) => {
                logger.log('error', 'error on create new customer | error: %s', err.message);
                cb(model.errorHandler(err), null);
            });
    },
};

module.exports = new Customer();