const { db } = require('../config/firebase');
const { getFieldCI } = require('../utils/firestoreHelpers');
const { withCache } = require('../utils/cache');

// ── Trae todos los navigation-paths, cacheado ─────────────────
async function obtenerTodosLosNavigationPaths() {
  return withCache('navigationPaths:todos', async () => {
    const snapshot = await db.collection('navigation-paths').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });
}

async function listarNavigationPaths(req, res) {
  try {
    const data = await obtenerTodosLosNavigationPaths();
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener navigation-paths: ' + error.message });
  }
}

async function obtenerNavigationPathPorPiso(req, res) {
  try {
    const todos = await obtenerTodosLosNavigationPaths();
    const pisoBuscado = req.params.piso.trim().toLowerCase();
    const encontrado = todos.find((doc) => {
      const piso = getFieldCI(doc, 'piso');
      return (piso ?? '').toString().trim().toLowerCase() === pisoBuscado;
    });
    if (!encontrado) {
      return res.status(404).send({ error: 'No hay navigation-path para ese piso' });
    }
    res.json(encontrado);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener navigation-path: ' + error.message });
  }
}

module.exports = { listarNavigationPaths, obtenerNavigationPathPorPiso };