const router = require('express').Router();
const ctrl = require('../controllers/compraController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

router.post('/', auth, roles('ADMIN', 'ALMACEN'), ctrl.registrar);
module.exports = router;