const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Medicamento = sequelize.define('Medicamento', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    precio: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    fecha_vencimiento: { type: DataTypes.DATEONLY }
});

module.exports = Medicamento;