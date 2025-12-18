const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    // console.log(req);
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
    console.log("';lkjhgAA");
    res.json({
        message: 'JSON to UI API Server',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            clients: '/api/clients',
            // clientById: '/api/clients/:id'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.path}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
    console.log(`💚 Health check at http://localhost:${PORT}/api/health\n`);
});
