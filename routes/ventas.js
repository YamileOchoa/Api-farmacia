const router = require('express').Router();
const ctrl = require('../controllers/ventaController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

router.post('/', auth, roles('ADMIN', 'VENDEDOR'), ctrl.registrar);
module.exports = router;