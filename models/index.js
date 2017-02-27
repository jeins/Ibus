'use strict';

const Sequelize = require("sequelize");
const _ = require('lodash');
const env       = process.env.NODE_ENV || "development";
const config    = require('../configs/config')[env];

let sequelize;
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

function Model(){};

Model.Sequelize = Sequelize;

Model.sequelize = sequelize;

Model.validateData = (allowedFields, data)=>{
	let obj = {};

    _.forEach(allowedFields, (field) => {
        if (_.isObject(data[field])) {
            data[field] = JSON.stringify(data[field]);
        }

        if(_.hasIn(data, field)) {
            obj[field] = data[field];
        }
    });

    return obj;
}

Model.decodeJson = (objs)=>{
	objs = JSON.parse(objs);

    let doDecode = (obj)=>{
        _.forEach(obj, (value, key) => {
            try {
                obj[key] = JSON.parse(value);
            } catch (e) {
            }
        });
    };

    if(_.isArray(objs)){
        _.forEach(objs, (obj) => {
            doDecode(obj);
        });
    } else{
        doDecode(objs);
    }

    return objs;
}

Model.errorHandler = (err)=>{
    return {
        error: true,
        message: err.message
    };
}

module.exports = Model;