const express = require('express');
const router = express.Router();
const SettingController = require('../controllers/SettingController');
const BannerController = require('../controllers/BannerController');
const TeacherController = require('../controllers/TeacherController');
const PageController = require('../controllers/PageController');
const ArticleController = require('../controllers/ArticleController');
const GalleryController = require('../controllers/GalleryController');
const NavbarController = require('../controllers/NavbarController');

// Settings
router.get('/settings', SettingController.getAllPublic);

// Banners
router.get('/banners', BannerController.getAllPublic);

// Teachers
router.get('/teachers', TeacherController.getAllPublic);

// Articles
router.get('/articles', ArticleController.getAllPublic);
router.get('/articles/:slug', ArticleController.getOnePublic);

// Galleries
router.get('/galleries', GalleryController.getAllPublic);

// Pages
router.get('/page/:slug', PageController.findBySlug);

// Menus
router.get('/menus', NavbarController.getAll);

module.exports = router;
