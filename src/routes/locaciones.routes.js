const express = require('express');
const router = express.Router();
const { buscarLocacionGlobal } = require('../controllers/locaciones.controller');

// Búsqueda global sin necesidad de conocer el edificio: /locaciones/:nombre
router.get('/:nombre', buscarLocacionGlobal);

module.exports = router;