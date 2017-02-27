'use strict';

const order = require('../../models/order');

module.exports = {
  up: function (queryInterface, Sequelize) {
      let db = order.db(Sequelize);

      return queryInterface.createTable(db.tableName, db.tableFields);
  },

  down: function (queryInterface, Sequelize) {
      let db = order.db(Sequelize);

      return queryInterface.dropTable(db.tableName);
  }
};
