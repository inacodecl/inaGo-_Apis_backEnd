require('./config/firebase'); // inicializa Firebase Admin antes que nada

const express = require('express');
const cors = require('cors');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const edificiosRoutes = require('./routes/edificios.routes');
const locacionesRoutes = require('./routes/locaciones.routes');
const navigationPathsRoutes = require('./routes/navigationPaths.routes');
const rutasRoutes = require('./routes/rutas.routes');

const app = express();

// ── CORS: en producción, restringir a los orígenes permitidos ─
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : true; // sin CORS_ORIGIN definido, se permite cualquier origen (útil en desarrollo)
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ── Healthcheck ─────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── Rutas ────────────────────────────────────────────────────
app.use('/edificios', edificiosRoutes);
app.use('/locaciones', locacionesRoutes);
app.use('/navigation-paths', navigationPathsRoutes);
app.use('/rutas', rutasRoutes);

// ── 404 y manejo global de errores (siempre al final) ────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;