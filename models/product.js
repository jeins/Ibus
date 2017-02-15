'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Products", {
        id: {type: DataTypes.STRING, primaryKey: true},
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        category: DataTypes.STRING,
        status: DataTypes.STRING,
        sellingPrice: DataTypes.DOUBLE,
        purchasePrice: DataTypes.DOUBLE,
        billImage: DataTypes.STRING,
        image: DataTypes.STRING
    });
};

