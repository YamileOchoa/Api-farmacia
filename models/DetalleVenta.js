const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DetalleVenta = sequelize.define('DetalleVenta', {
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precio: { type: DataTypes.FLOAT, allowNull: false }
});

module.exports = DetalleVenta;