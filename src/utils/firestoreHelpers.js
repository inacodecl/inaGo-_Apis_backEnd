const { db } = require('../config/firebase');
const { withCache } = require('./cache');

// ── Colecciones de locaciones dentro de cada edificio ────────
const COLECCIONES_LOCACIONES = [
  'Locaciones',
  'Locaciones piso -1',
  'Locaciones piso 2',
  'Locaciones piso 3',
];

// ── Busca un campo sin importar mayúscula/minúscula ──────────
function getFieldCI(obj, fieldName) {
  if (!obj) return undefined;
  const regex = new RegExp(`^${fieldName}$`, 'i');
  const key = Object.keys(obj).find((k) => regex.test(k));
  return key !== undefined ? obj[key] : undefined;
}

// ── Normaliza coordenadas 3D sin importar el nombre del campo ─
function extraerCoordenadas(doc) {
  const coord = getFieldCI(doc, 'Coordenadas 3D') || getFieldCI(doc, 'Coordenadas');
  if (!coord || typeof coord !== 'object') return null;
  const x = getFieldCI(coord, 'x');
  const y = getFieldCI(coord, 'y');
  const z = getFieldCI(coord, 'z');
  if (x == null || y == null || z == null) return null;
  return { x, y, z };
}

// ── Trae todas las locaciones (de las 4 colecciones) de un edificio ─
// Es la función que más lecturas consume (4 queries por edificio), así
// que se cachea por edificioId: mientras el resultado esté "fresco",
// llamadas repetidas (incluida la búsqueda global, que la llama una vez
// por cada edificio) no vuelven a golpear Firestore.
async function obtenerLocacionesDeEdificio(edificioId) {
  return withCache(`locaciones:${edificioId}`, async () => {
    const resultados = [];
    for (const nombreColeccion of COLECCIONES_LOCACIONES) {
      const snapshot = await db
        .collection('Edificios')
        .doc(edificioId)
        .collection(nombreColeccion)
        .get();
      snapshot.docs.forEach((doc) => {
        resultados.push({ id: doc.id, _coleccion: nombreColeccion, ...doc.data() });
      });
    }
    return resultados;
  });
}

module.exports = {
  COLECCIONES_LOCACIONES,
  getFieldCI,
  extraerCoordenadas,
  obtenerLocacionesDeEdificio,
};