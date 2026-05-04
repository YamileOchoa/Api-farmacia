const { OrdenVenta, DetalleVenta, Medicamento } = require('../models');

exports.registrar = async (req, res) => {
    try {
        const { detalles } = req.body;
        // detalles = [{ medicamentoId, cantidad, precio }]

        // Validar stock primero
        for (const d of detalles) {
            const med = await Medicamento.findByPk(d.medicamentoId);
            if (!med) return res.status(404).json({ msg: `Medicamento ${d.medicamentoId} no encontrado` });
            if (med.stock < d.cantidad)
                return res.status(400).json({ msg: `Stock insuficiente para ${med.nombre}` });
        }

        const orden = await OrdenVenta.create({ UsuarioId: req.usuario.id });
        let total = 0;

        for (const d of detalles) {
            await DetalleVenta.create({
                OrdenVentaId: orden.id,
                MedicamentoId: d.medicamentoId,
                cantidad: d.cantidad,
                precio: d.precio
            });
            // Descontar stock
            const med = await Medicamento.findByPk(d.medicamentoId);
            await med.update({ stock: med.stock - d.cantidad });
            total += d.cantidad * d.precio;
        }

        await orden.update({ total });
        res.status(201).json({ msg: 'Venta registrada', orden });
    } catch (e) { res.status(500).json({ msg: e.message }); }
};