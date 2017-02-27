'use strict';

const logger = require('../configs/logger');
const _ = require('lodash');
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
    }
};

module.exports = new Customer();