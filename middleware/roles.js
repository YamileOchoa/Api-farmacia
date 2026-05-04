module.exports = (...rolesPermitidos) => (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol))
        return res.status(403).json({ msg: 'Acceso denegado' });
    next();
};