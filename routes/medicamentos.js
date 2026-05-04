const router = require('express').Router();
const ctrl = require('../controllers/medicamentoController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

router.get('/', auth, ctrl.listar);
router.post('/', auth, roles('ADMIN', 'ALMACEN'), ctrl.crear);
router.put('/:id', auth, roles('ADMIN', 'ALMACEN'), ctrl.actualizar);
router.delete('/:id', auth, roles('ADMIN'), ctrl.eliminar);
module.exports = router;