'use strict';

const product = require('../../models/product');

module.exports = {
    up: function (queryInterface, Sequelize) {
        let db = product.db(Sequelize);
        
        return queryInterface.createTable(db.tableName, db.tableFields);
    },

    down: function (queryInterface, Sequelize) {
        let db = product.db(Sequelize);

        return queryInterface.dropTable(db.tableName);
    }
};
