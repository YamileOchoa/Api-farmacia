const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DetalleCompra = sequelize.define('DetalleCompra', {
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precio: { type: DataTypes.FLOAT, allowNull: false }
});

module.exports = DetalleCompra;