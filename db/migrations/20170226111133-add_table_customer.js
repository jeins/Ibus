'use strict';

const customer = require('../../models/customer');

module.exports = {
  up: function (queryInterface, Sequelize) {
      let db = customer.db(Sequelize);

      return queryInterface.createTable(db.tableName, db.tableFields);
  },

  down: function (queryInterface, Sequelize) {
      let db = customer.db(Sequelize);

      return queryInterface.dropTable(db.tableName);
  }
};
