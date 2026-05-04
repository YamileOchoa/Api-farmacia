const sequelize = require('../config/db');
const Usuario = require('./Usuario');
const Medicamento = require('./Medicamento');
const Laboratorio = require('./Laboratorio');
const OrdenCompra = require('./OrdenCompra');
const DetalleCompra = require('./DetalleCompra');
const OrdenVenta = require('./OrdenVenta');
const DetalleVenta = require('./DetalleVenta');

// Compras
Laboratorio.hasMany(OrdenCompra);
OrdenCompra.belongsTo(Laboratorio);
OrdenCompra.hasMany(DetalleCompra);
DetalleCompra.belongsTo(OrdenCompra);
DetalleCompra.belongsTo(Medicamento);

// Ventas
Usuario.hasMany(OrdenVenta);
OrdenVenta.belongsTo(Usuario);
OrdenVenta.hasMany(DetalleVenta);
DetalleVenta.belongsTo(OrdenVenta);
DetalleVenta.belongsTo(Medicamento);

module.exports = {
    sequelize, Usuario, Medicamento, Laboratorio,
    OrdenCompra, DetalleCompra, OrdenVenta, DetalleVenta
};