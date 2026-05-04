const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Laboratorio = sequelize.define('Laboratorio', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    direccion: { type: DataTypes.STRING }
});

module.exports = Laboratorio;