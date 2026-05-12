const express = require('express');
const router = express.Router();

// SPMB module routes - Student recruitment management
// Auth routes (shared from Master - for login/me endpoint)
const authRoutes = require('../master/routes/auth');

// Middleware to auto-set app_type for SPMB routes
// This ensures menus and data are filtered for SPMB app only
router.use((req, res, next) => {
  req.query.app_type = 'spmb';
  next();
});

// Safe require helper - returns a stub router when module is missing
const safeRequire = (p) => {
  try { return require(p); }
  catch (e) {
    const express = require('express');
    const r = express.Router();
    r.all('*', (req, res) => res.status(404).json({ message: `Route not available: ${p}` }));
    return r;
  }
};

const registrantRoutes = safeRequire('./routes/registrants');
const studentRoutes = safeRequire('./routes/students');
const studentUserRoutes = safeRequire('./routes/student-users');
const studentPaymentsRoutes = safeRequire('./routes/student/payments');
const voucherRoutes = safeRequire('./routes/voucher');
const formatRoutes = safeRequire('./routes/format');
const schoolDataRoutes = safeRequire('./routes/school-data');
const examNumberRoutes = safeRequire('./routes/exam-number');
const selectionScheduleRoutes = safeRequire('./routes/selection-schedule');
const selectionTypeRoutes = safeRequire('./routes/selection-type');
const scheduleDetailRoutes = safeRequire('./routes/schedule-detail');
const discountRoutes = safeRequire('./routes/discount');
const positionRoutes = safeRequire('./routes/position');
const classroomRoutes = safeRequire('./routes/classroom');
const buildingSetupRoutes = safeRequire('./routes/building-setup');
const roomSetupRoutes = safeRequire('./routes/room-setup');
const discountSetupRoutes = safeRequire('./routes/discount-setup');
const academicYearSetupRoutes = safeRequire('./routes/academic-year-setup');
const lifeStatusRoutes = safeRequire('./routes/life-status');
const requirementMasterRoutes = safeRequire('./routes/requirement-master');
const educationLevelRoutes = safeRequire('./routes/education-level');
const occupationRoutes = safeRequire('./routes/occupation');
const incomeRoutes = safeRequire('./routes/income');
const religionRoutes = safeRequire('./routes/religion');
const bankRoutes = safeRequire('./routes/bank');
const registrationBatchRoutes = safeRequire('./routes/registration-batch');
const registrationPathRoutes = safeRequire('./routes/registration-path');
const registrationSubPathRoutes = safeRequire('./routes/registration-sub-path');
const registrantDocumentRoutes = safeRequire('./routes/registrant-documents');
const dynamicItemsRoutes = safeRequire('./routes/dynamic-items');
const settingRoutes = safeRequire('../website/routes/settings');

// Fee routes (from Keuangan module - for SPMB payments)
const feeRoutes = safeRequire('../keuangan/routes/fee');
const uploadRoutes = safeRequire('../keuangan/routes/upload');

// Subdirectory routes (admin/student)
const adminRegistrantsRoutes = safeRequire('./routes/admin/registrants');
const studentRegistrantsRoutes = safeRequire('./routes/student/registrants');

// Public route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to SPMB API' });
});

// Auth routes (must be before other routes to avoid conflicts)
router.use('/auth', authRoutes);

// SPMB routes
router.use('/registrants', registrantRoutes);
router.use('/students', studentRoutes);
router.use('/student-users', studentUserRoutes);
router.use('/voucher', voucherRoutes);
router.use('/format', formatRoutes);
router.use('/school-data', schoolDataRoutes);
router.use('/exam-number', examNumberRoutes);
router.use('/selection-schedule', selectionScheduleRoutes);
router.use('/selection-type', selectionTypeRoutes);
router.use('/schedule-detail', scheduleDetailRoutes);
router.use('/discount', discountRoutes);
router.use('/position', positionRoutes);
router.use('/classroom', classroomRoutes);
router.use('/building-setup', buildingSetupRoutes);
router.use('/room-setup', roomSetupRoutes);
router.use('/discount-setup', discountSetupRoutes);
router.use('/academic-year-setup', academicYearSetupRoutes);
router.use('/life-status', lifeStatusRoutes);
router.use('/requirement-master', requirementMasterRoutes);
router.use('/education-level', educationLevelRoutes);
router.use('/occupation', occupationRoutes);
router.use('/income', incomeRoutes);
router.use('/religion', religionRoutes);
router.use('/bank', bankRoutes);
router.use('/registration-batch', registrationBatchRoutes);
router.use('/registration-path', registrationPathRoutes);
router.use('/registration-sub-path', registrationSubPathRoutes);
router.use('/registrant-documents', registrantDocumentRoutes);

// Settings routes
router.use('/settings', settingRoutes);

// Fee routes (for SPMB payments)
router.use('/fee', feeRoutes);
router.use('/upload', uploadRoutes);

// Dynamic items route (for compatibility)
router.use('/items', dynamicItemsRoutes);

// Admin/Student specific registrant routes
router.use('/admin/registrants', adminRegistrantsRoutes);
router.use('/registrants', adminRegistrantsRoutes);
router.use('/student/registrants', studentRegistrantsRoutes);
router.use('/student/payments', studentPaymentsRoutes);

module.exports = router;
