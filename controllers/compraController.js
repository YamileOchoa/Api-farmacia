const { OrdenCompra, DetalleCompra, Medicamento } = require('../models');

exports.registrar = async (req, res) => {
    try {
        const { laboratorioId, detalles } = req.body;
        // detalles = [{ medicamentoId, cantidad, precio }]

        const orden = await OrdenCompra.create({ LaboratorioId: laboratorioId });
        let total = 0;

        for (const d of detalles) {
            await DetalleCompra.create({
                OrdenCompraId: orden.id,
                MedicamentoId: d.medicamentoId,
                cantidad: d.cantidad,
                precio: d.precio
            });
            // Aumentar stock
            const med = await Medicamento.findByPk(d.medicamentoId);
            await med.update({ stock: med.stock + d.cantidad });
            total += d.cantidad * d.precio;
        }

        await orden.update({ total });
        res.status(201).json({ msg: 'Compra registrada', orden });
    } catch (e) { res.status(500).json({ msg: e.message }); }
};