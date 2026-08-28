const { db } = require('../config/firebase');
const { getFieldCI } = require('../utils/firestoreHelpers');
const { withCache } = require('../utils/cache');

// hastes de hacer cambios, entiendan bien el codigo
// ── Trae todos los edificios, cacheado ────────────────────────
// listarEdificios, obtenerEdificioPorId y obtenerEdificioPorNombre
// reutilizan este mismo resultado mientras esté "fresco", en vez de
// hacer una lectura nueva a Firestore por cada petición.
async function obtenerTodosLosEdificios() {
  return withCache('edificios:todos', async () => {
    const snapshot = await db.collection('Edificios').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });
}

async function listarEdificios(req, res) {
  try {
    const data = await obtenerTodosLosEdificios();
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener edificios: ' + error.message });
  }
}

async function obtenerEdificioPorId(req, res) {
  try {
    const todos = await obtenerTodosLosEdificios();
    const encontrado = todos.find((e) => e.id === req.params.id);
    if (!encontrado) {
      return res.status(404).send({ error: 'Edificio no encontrado' });
    }
    res.json(encontrado);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener edificio: ' + error.message });
  }
}

async function obtenerEdificioPorNombre(req, res) {
  try {
    const todos = await obtenerTodosLosEdificios();
    const nombreBuscado = req.params.nombre.trim().toLowerCase();
    const encontrado = todos.find((e) => {
      const nombre = getFieldCI(e, 'nombre');
      return (nombre ?? '').toString().trim().toLowerCase() === nombreBuscado;
    });
    if (!encontrado) {
      return res.status(404).send({ error: 'Edificio no encontrado' });
    }
    res.json(encontrado);
  } catch (error) {
    res.status(500).send({ error: 'Error al buscar edificio por nombre: ' + error.message });
  }
}

module.exports = {
  obtenerTodosLosEdificios,
  listarEdificios,
  obtenerEdificioPorId,
  obtenerEdificioPorNombre,
};