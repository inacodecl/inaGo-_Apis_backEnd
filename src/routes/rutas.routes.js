const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { withCache } = require('../utils/cache');

// NOTA: colección "rutas" reemplazada por "navigation-paths" (Accesos/Giros/Conexiones).
// Se deja este endpoint por si se necesita más adelante, pero actualmente no lo usa el frontend.
// Si se confirma que ya no hace falta, se puede eliminar este archivo y su línea en app.js
// para que ustedes lo consideren mejor ya que lo hice de manera rapida.
router.get('/', async (req, res) => {
  try {
    const data = await withCache('rutas:todas', async () => {
      const snapshot = await db.collection('rutas').get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    });
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener rutas: ' + error.message });
  }
});

module.exports = router;