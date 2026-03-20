const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const tokenRoutes = require('./tokens');
const authRoutes = require('./auth');
const menuRoutes = require('./menus');
const roleRoutes = require('./roles');
const permissionRoutes = require('./permissions');
const publicRoutes = require('./public');
const settingRoutes = require('./settings');
const bannerRoutes = require('./banners');
const teacherRoutes = require('./teachers');
const articleRoutes = require('./articles');
const galleryRoutes = require('./galleries');
const categoryRoutes = require('./categories');
const navbarRoutes = require('./navbars');
// const spmbRoutes = require('./registrants');
const imageRoutes = require('./images'); // Secure image serving

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Public routes
router.use('/auth', authRoutes);
router.use('/images', imageRoutes); // Secure image serving (public)
router.use('/public', publicRoutes);
router.use('/articles', articleRoutes);
router.use('/banners', bannerRoutes);
router.use('/teachers', teacherRoutes);
router.use('/galleries', galleryRoutes);
router.use('/categories', categoryRoutes);
router.use('/navbars', navbarRoutes);
router.use('/settings', settingRoutes);
// router.use('/pages', pageRoutes);


// router.use('/spmb', spmbRoutes);
router.use('/students', require('./students'));
router.use('/data-leads', require('./student-users'));

// SPMB Reference Data Routes (accessible by both student and admin)
router.use('/religion', require('./religion'));
router.use('/bank', require('./bank'));
router.use('/schedule-detail', require('./schedule-detail'));
router.use('/discount', require('./discount'));
router.use('/format', require('./format'));
router.use('/registration-batch', require('./registration-batch'));
router.use('/fee', require('./fee'));
router.use('/position', require('./position'));
router.use('/selection-schedule', require('./selection-schedule'));
router.use('/registration-path', require('./registration-path'));
router.use('/selection-type', require('./selection-type'));
router.use('/classroom', require('./classroom'));
router.use('/exam-number', require('./exam-number'));
router.use('/occupation', require('./occupation'));
router.use('/income', require('./income'));
router.use('/school-data', require('./school-data'));
router.use('/building-setup', require('./building-setup'));
router.use('/room-setup', require('./room-setup'));
router.use('/discount-setup', require('./discount-setup'));
router.use('/academic-year-setup', require('./academic-year-setup'));
router.use('/life-status', require('./life-status'));
router.use('/registration-sub-path', require('./registration-sub-path'));
router.use('/requirement-master', require('./requirement-master'));
router.use('/education-level', require('./education-level'));
router.use('/voucher', require('./voucher'));
router.use('/registrant-documents', require('./registrant-documents'));

const verifyToken = require('../middleware/verifyToken');
const uploadRoutes = require('./upload');
router.use(verifyToken);

// Admin-only routes (require token)
router.use('/users', userRoutes);
router.use('/tokens', tokenRoutes);
router.use('/menus', menuRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/upload', uploadRoutes);



module.exports = router;
