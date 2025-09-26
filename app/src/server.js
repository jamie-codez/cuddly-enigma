const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const promClient = require('prom-client');

// --- Initial Setup ---
dotenv.config();
const app = express();
const itemRouter = require('./routes/itemRoutes');

// --- Configuration ---
const config = {
    port: process.env.PORT || 3000,
    mongodbUri: process.env.MONGODB_URI,
    corsOrigin: process.env.CORS_ORIGIN || '*',
};

// --- Security & Performance Middleware ---
app.use(helmet()); // Sets various HTTP headers for security
app.use(cors({origin: config.corsOrigin})); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies
app.use(express.json()); // Body parser for JSON

// --- Prometheus Metrics Setup ---
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({timeout: 5000}); // Collects default Node.js metrics

const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 1.5, 2, 5], // Buckets for response time from 100ms to 5s
});

const httpRequestsTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

// Middleware to capture response time
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        // Use a placeholder for dynamic routes like /api/items/:id
        const route = req.route ? req.path.replace(/:[a-zA-Z0-9_]+/g, '{id}') : req.path;
        httpRequestDuration
            .labels(req.method, route, res.statusCode)
            .observe(duration);
        httpRequestsTotal
            .labels(req.method, route, res.statusCode)
            .inc();
    });
    next();
});

// --- Database Connection ---
if (!config.mongodbUri) {
    console.error('FATAL ERROR: MONGODB_URI is not defined.');
    process.exit(1);
}

mongoose
    .connect(config.mongodbUri)
    .then(() => console.log('✅ MongoDB connection successful!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- API Routes ---
app.use('/api/items', itemRouter);

// --- Core Routes (Monitoring, Health, etc.) ---
app.get('/', (req, res) => {
    res.json({
        message: 'Hello from Secure & Monitored DevOps App!',
        version: '2.1.0',
        database: 'MongoDB',
    });
});

app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const isConnected = dbState === 1; // 1 means 'connected'
    // Return 503 Service Unavailable if DB is not connected
    res.status(isConnected ? 200 : 503).json({
        status: isConnected ? 'healthy' : 'unhealthy',
        databaseConnection: mongoose.STATES[dbState],
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

// --- 404 Not Found Handler ---
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `The route ${req.originalUrl} does not exist on this server.`,
    });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error('ERROR 💥', err);
    res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
    });
});

// --- Server Startup ---
const server = app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully.');
    server.close(() => {
        console.log('Process terminated.');
        mongoose.connection.close(false);
    });
});