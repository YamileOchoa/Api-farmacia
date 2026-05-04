const { Medicamento } = require('../models');

exports.listar = async (req, res) => {
    const data = await Medicamento.findAll();
    res.json(data);
};

exports.crear = async (req, res) => {
    try {
        const med = await Medicamento.create(req.body);
        res.status(201).json(med);
    } catch (e) { res.status(400).json({ msg: e.message }); }
};

exports.actualizar = async (req, res) => {
    try {
        await Medicamento.update(req.body, { where: { id: req.params.id } });
        res.json({ msg: 'Actualizado' });
    } catch (e) { res.status(400).json({ msg: e.message }); }
};

exports.eliminar = async (req, res) => {
    await Medicamento.destroy({ where: { id: req.params.id } });
    res.json({ msg: 'Eliminado' });
};