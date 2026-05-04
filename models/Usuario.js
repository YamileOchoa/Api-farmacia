const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: { type: DataTypes.ENUM('ADMIN', 'VENDEDOR', 'ALMACEN'), defaultValue: 'VENDEDOR' }
});

Usuario.beforeCreate(async (usuario) => {
    usuario.password = await bcrypt.hash(usuario.password, 10);
});

module.exports = Usuario;