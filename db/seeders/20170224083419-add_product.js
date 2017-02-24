'use strict';

const faker = require('faker');
const moment = require('moment');
const uuid = require('uuid/v1');

module.exports = {
  up: function (queryInterface, Sequelize) {
    let arrData = [];
    let category = ['tas', 'dompet', 'jam'];
    let status = ['baru', 'bekas'];

    for(let i=0; i<100; i++){
      arrData.push({
        id: uuid(),
        name: faker.commerce.productName(),
        description: faker.company.catchPhrase(),
        category: category[Math.floor((Math.random() * 3) + 0)],
        status: status[Math.floor((Math.random() * 2) + 0)],
        sellingPrice: JSON.stringify({currency: 'rupiah', value: Math.floor((Math.random() * 100000) + 10000000)}),
        purchasePrice: JSON.stringify({currency: 'euro', value: Math.floor((Math.random() * 20) + 1000)}),
        image: faker.image.food(),
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt:  moment().format('YYYY-MM-DD HH:mm:ss')
      });
    }

      return queryInterface.bulkInsert('Products', arrData, {});
  }
  ,

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
