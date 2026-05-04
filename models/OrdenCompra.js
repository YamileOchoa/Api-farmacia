const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrdenCompra = sequelize.define('OrdenCompra', {
    fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    total: { type: DataTypes.FLOAT, defaultValue: 0 }
});

module.exports = OrdenCompra;