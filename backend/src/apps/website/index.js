const express = require('express');
const router = express.Router();

// Website module routes - Public website & CMS
const articleRoutes = require('./routes/articles');
const bannerRoutes = require('./routes/banners');
const galleryRoutes = require('./routes/galleries');
const teacherRoutes = require('./routes/teachers');
const categoryRoutes = require('./routes/categories');
const settingRoutes = require('./routes/settings');
const navbarRoutes = require('./routes/navbars');
const imageRoutes = require('./routes/images');
const pageRoutes = require('./routes/pages');
const publicRoutes = require('./routes/public');
const SettingController = require('./controllers/SettingController');
const BannerController = require('./controllers/BannerController');
const TeacherController = require('./controllers/TeacherController');
const ArticleController = require('./controllers/ArticleController');
const GalleryController = require('./controllers/GalleryController');
const NavbarController = require('./controllers/NavbarController');

const isPublicFrontend = (req) => req.get('X-Frontend-Scope') === 'public';

// Public route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Website API' });
});

// Public frontend aliases without /public prefix.
router.get('/settings', (req, res, next) => (isPublicFrontend(req) ? SettingController.getAllPublic(req, res) : next()));
router.get('/banners', (req, res, next) => (isPublicFrontend(req) ? BannerController.getAllPublic(req, res) : next()));
router.get('/teachers', (req, res, next) => (isPublicFrontend(req) ? TeacherController.getAllPublic(req, res) : next()));
router.get('/articles', (req, res, next) => (isPublicFrontend(req) ? ArticleController.getAllPublic(req, res) : next()));
router.get('/articles/:slug', (req, res, next) => (isPublicFrontend(req) ? ArticleController.getOnePublic(req, res) : next()));
router.get('/galleries', (req, res, next) => (isPublicFrontend(req) ? GalleryController.getAllPublic(req, res) : next()));
router.get('/menus', (req, res, next) => (isPublicFrontend(req) ? NavbarController.getAll(req, res) : next()));

// Public routes
router.use('/public', publicRoutes);
router.use('/images', imageRoutes);
router.use('/articles', articleRoutes);
router.use('/banners', bannerRoutes);
router.use('/teachers', teacherRoutes);
router.use('/galleries', galleryRoutes);
router.use('/categories', categoryRoutes);
router.use('/navbars', navbarRoutes);
router.use('/settings', settingRoutes);
router.use('/pages', pageRoutes);

module.exports = router;
