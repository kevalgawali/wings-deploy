const express = require('express');
require("dotenv").config();
const router = require('./routes/routes');
const cookieParser = require('cookie-parser');
const registerRoutes = require('./routes/registerRoutes');
const viewerRoutes = require('./routes/viewerRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const viewersAdminRoutes = require('./routes/viewersAdminRoutes');
const jwtValidation = require('./utils/auth/jwtValidation');
const adminRoutes = require('./routes/adminRoutes');
const seoRoutes = require('./routes/seoRoutes');
const cors = require('cors');
const { initializeDatabase } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for frontend (allow requests from any origin and support credentials for cross-site cookies)
const corsOptions = {
  origin: true, // reflect request origin
  credentials: true, // allow cookies to be sent
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept','Origin','X-Requested-With']
};
app.use(cors(corsOptions));
// Explicitly handle preflight requests
app.options('*', cors(corsOptions));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.removeHeader('X-Powered-By');
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// SEO Routes (must be before other routes for /sitemap.xml and /robots.txt)
app.use('/', seoRoutes);

// Routes
app.use('/', router);
app.use('/register', registerRoutes);
app.use('/viewer', viewerRoutes);
app.use('/super-admin', jwtValidation, superAdminRoutes);
app.use('/viewers-admin', jwtValidation, viewersAdminRoutes);
app.use('/admin', jwtValidation, adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `${req.method} ${req.path} not found`
  });
});

// Start server with database initialization
const startServer = async () => {
  try {
    // Initialize database schema before starting the server
    console.log("🚀 Starting server...");
    const dbInitialized = await initializeDatabase();
    
    if (!dbInitialized) {
      console.error("⚠️ Database initialization had issues, but server will continue...");
    }

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();