const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

exports.register = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const existe = await Usuario.findOne({ where: { email } });
        if (existe) return res.status(400).json({ msg: 'Email ya registrado' });
        const usuario = await Usuario.create({ nombre, email, password, rol });
        res.status(201).json({ msg: 'Usuario creado', id: usuario.id });
    } catch (e) { res.status(500).json({ msg: e.message }); }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return res.status(400).json({ msg: 'Credenciales inválidas' });
        const ok = await bcrypt.compare(password, usuario.password);
        if (!ok) return res.status(400).json({ msg: 'Credenciales inválidas' });
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        res.json({ token });
    } catch (e) { res.status(500).json({ msg: e.message }); }
};