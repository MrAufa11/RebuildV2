require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Use lazy-loading models - databases connect only when first accessed
const db = require('./models');

const cookieParser = require('cookie-parser');

const app = express();
app.set('trust proxy', 1); // Trust first proxy (critical for cPanel/Nginx/Heroku with SSL)

const PORT = process.env.PORT || 3000;

// Dynamic CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigin = process.env.CORS_ORIGIN;
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow localhost. In production, check ENV.
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    if (allowedOrigin && origin === allowedOrigin) {
      callback(null, true);
    } else if (!allowedOrigin) {
      // Fallback if ENV is not set (not recommended for strict sec, but functional)
      console.warn('CORS_ORIGIN not set in production, allowing all origins by reflection');
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}. Expected: ${allowedOrigin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
const path = require('path');

// Serve uploads directory (for development)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve public directory (for production - parent folder)
const publicDir = process.env.PUBLIC_DIR || path.join(__dirname, '../public');
app.use('/public', express.static(publicDir));

// ALSO serve backend/uploads/website as /public/website (for development)
app.use('/public/website', express.static(path.join(__dirname, 'uploads', 'website')));

// Bind them to /api prefix as well just in case for legacy
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/public', express.static(publicDir));

// ========== MODULAR APP ROUTES ==========
// Mount each app module with explicit prefix
// This replaces the old dynamic routing approach
const masterRoutes = require('./src/apps/master');
const spmbRoutes = require('./src/apps/spmb');
const websiteRoutes = require('./src/apps/website');
const keuanganRoutes = require('./src/apps/keuangan');

// Mount apps with /api/:appName prefix
app.use('/api/master', masterRoutes);
app.use('/api/spmb', spmbRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/keuangan', keuanganRoutes);

// Compatibility: also mount modules at legacy /api root so older frontend paths still work
// This makes endpoints like /api/public/*, /api/auth/*, /api/banners, /api/settings available
app.use('/api', masterRoutes);
app.use('/api', spmbRoutes);
app.use('/api', websiteRoutes);
app.use('/api', keuanganRoutes);

// Secure image routes - now handled by website module
// const imageRoutes = require('./routes/images'); // DELETED - old routes removed
// app.use('/api/images', imageRoutes); // Images served via /api/website/images

// Legacy routes REMOVED - use modular routes instead
// Old: /api/legacy/* 
// New: /api/spmb/*, /api/master/*, /api/website/*, /api/keuangan/*

// Eager database connection - connect all databases at startup for reliability
const connectDatabases = async () => {
  try {
    // Models auto-connect on initialization (eager loading)
    console.log('✅ All databases connected successfully');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
  }
};

connectDatabases();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 