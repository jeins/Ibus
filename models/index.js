'use strict';

const Sequelize = require("sequelize");
const env       = process.env.NODE_ENV || "development";
const config    = require('../configs/config')[env];

let db = {};
let sequelize;

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;