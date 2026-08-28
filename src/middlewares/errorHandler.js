// ── 404: ninguna ruta coincidió ────────────────────────────
function notFoundHandler(req, res) {
  res.status(404).send({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// ── Manejador global de errores no capturados ──────────────
// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  console.error('Error no manejado:', error);
  res.status(500).send({ error: 'Error interno del servidor' });
}

module.exports = { notFoundHandler, errorHandler };