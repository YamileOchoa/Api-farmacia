const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrdenVenta = sequelize.define('OrdenVenta', {
    fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    total: { type: DataTypes.FLOAT, defaultValue: 0 }
});

module.exports = OrdenVenta;