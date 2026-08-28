const express = require('express');
const router = express.Router();
const {
  listarNavigationPaths,
  obtenerNavigationPathPorPiso,
} = require('../controllers/navigationPaths.controller');

router.get('/', listarNavigationPaths);
router.get('/piso/:piso', obtenerNavigationPathPorPiso);

module.exports = router;