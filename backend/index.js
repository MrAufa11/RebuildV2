require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const router = require('./routes');

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

app.use('/api', router);

// Secure image routes (after main router to avoid conflicts)
const imageRoutes = require('./routes/images');
app.use('/api/images', imageRoutes);

// Authenticate all database connections
const connectDatabases = async () => {
  try {
    await db.databases.master.authenticate();
    console.log('✅ Master Database connected...');

    await db.databases.website.authenticate();
    console.log('✅ Website Database connected...');

    await db.databases.spmb.authenticate();
    console.log('✅ SPMB Database connected...');

    await db.databases.keuangan.authenticate();
    console.log('✅ Keuangan Database connected...');

    // Sync models if needed (be careful in production)
    // await db.databases.master.sync();
    // await db.databases.website.sync();
    // await db.databases.spmb.sync();
    // await db.databases.keuangan.sync();
  } catch (err) {
    console.error('❌ Unable to connect to one of the databases:', err);
  }
};

connectDatabases();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 