const { getFieldCI, extraerCoordenadas, obtenerLocacionesDeEdificio } = require('../utils/firestoreHelpers');
const { obtenerTodosLosEdificios } = require('./edificios.controller');

async function listarLocacionesDeEdificio(req, res) {
  try {
    const data = await obtenerLocacionesDeEdificio(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener locaciones: ' + error.message });
  }
}

async function listarLocacionesPorPiso(req, res) {
  try {
    const todas = await obtenerLocacionesDeEdificio(req.params.id);
    const pisoBuscado = req.params.piso.trim().toLowerCase();
    const data = todas.filter((loc) => {
      const piso = getFieldCI(loc, 'piso');
      return (piso ?? '').toString().trim().toLowerCase() === pisoBuscado;
    });
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: 'Error al filtrar por piso: ' + error.message });
  }
}

async function listarLocacionesPorTipo(req, res) {
  try {
    const todas = await obtenerLocacionesDeEdificio(req.params.id);
    const tipoBuscado = req.params.tipo.trim().toLowerCase();
    const data = todas.filter((loc) => {
      const tipo = getFieldCI(loc, 'tipo');
      return (tipo ?? '').toString().trim().toLowerCase() === tipoBuscado;
    });
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: 'Error al filtrar por tipo: ' + error.message });
  }
}

async function obtenerLocacionPorNombreEnEdificio(req, res) {
  try {
    const todas = await obtenerLocacionesDeEdificio(req.params.id);
    const nombreBuscado = req.params.nombre.trim().toLowerCase();
    const encontrada = todas.find((loc) => {
      const nombre = getFieldCI(loc, 'nombre');
      return (nombre ?? '').toString().trim().toLowerCase() === nombreBuscado;
    });
    if (!encontrada) {
      return res.status(404).send({ error: 'Locación no encontrada' });
    }
    res.json({ ...encontrada, coordenadas: extraerCoordenadas(encontrada) });
  } catch (error) {
    res.status(500).send({ error: 'Error al buscar locación: ' + error.message });
  }
}

// ── Búsqueda global: sin necesidad de conocer el ID del edificio ─
// Reutiliza la lista de edificios cacheada (en vez de una lectura nueva
// a Firestore) y la caché por-edificio de obtenerLocacionesDeEdificio.
async function buscarLocacionGlobal(req, res) {
  try {
    const edificios = await obtenerTodosLosEdificios();
    const nombreBuscado = req.params.nombre.trim().toLowerCase();

    for (const edificio of edificios) {
      const locaciones = await obtenerLocacionesDeEdificio(edificio.id);
      const encontrada = locaciones.find((loc) => {
        const nombre = getFieldCI(loc, 'nombre');
        return (nombre ?? '').toString().trim().toLowerCase() === nombreBuscado;
      });

      if (encontrada) {
        return res.json({
          ...encontrada,
          coordenadas: extraerCoordenadas(encontrada),
          edificioId: edificio.id,
          edificioNombre: getFieldCI(edificio, 'nombre'),
        });
      }
    }

    res.status(404).send({ error: 'Locación no encontrada en ningún edificio' });
  } catch (error) {
    res.status(500).send({ error: 'Error al buscar locación por nombre: ' + error.message });
  }
}

module.exports = {
  listarLocacionesDeEdificio,
  listarLocacionesPorPiso,
  listarLocacionesPorTipo,
  obtenerLocacionPorNombreEnEdificio,
  buscarLocacionGlobal,
};