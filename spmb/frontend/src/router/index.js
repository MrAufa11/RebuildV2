import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import api from '../services/api';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('../views/PublicLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'home',
                    component: HomeView
                },
                {
                    path: 'staff-guru',
                    name: 'public-teachers',
                    component: () => import('../views/public/AllTeachersView.vue')
                },
                {
                    path: 'news',
                    name: 'public-news',
                    component: () => import('../views/public/AllNewsView.vue')
                },
                {
                    path: 'news/:slug',
                    name: 'public-article-detail',
                    component: () => import('../views/public/ArticleDetailView.vue')
                },
                {
                    path: 'galeri',
                    name: 'public-galleries',
                    component: () => import('../views/public/AllGalleriesView.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            meta: { guest: true }
        },
        {
            path: '/auth',
            name: 'admin-login',
            component: () => import('../views/admin/AdminLoginView.vue'),
            meta: { guest: true }
        },
        {
            path: '/dashboard',
            name: 'student-dashboard',
            component: () => import('../views/student/Dashboard.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/admin',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'admin-dashboard',
                    component: () => import('../views/admin/AdminDashboard.vue')
                }
            ]
        },
        {
            path: '/welcome',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'welcome-settings',
                    component: () => import('../views/admin/welcome/WelcomeSettings.vue')
                }
            ]
        },
        {
            path: '/users',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'user-index',
                    component: () => import('../views/admin/users/UserIndex.vue')
                },
                {
                    path: 'create',
                    name: 'user-create',
                    component: () => import('../views/admin/users/UserForm.vue')
                },
                {
                    path: ':id',
                    name: 'user-edit',
                    component: () => import('../views/admin/users/UserForm.vue')
                }
            ]
        },
        {
            path: '/registrants',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'registrant-index',
                    component: () => import('../views/admin/registrants/RegistrantIndex.vue')
                }
            ]
        },
        {
            path: '/students',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'student-index',
                    component: () => import('../views/admin/students/StudentIndex.vue')
                }
            ]
        },
        {
            path: '/registrant-accounts',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'registrant-accounts-index',
                    component: () => import('../views/admin/registrants/RegistrantAccountsIndex.vue')
                }
            ]
        },
        {
            path: '/roles',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'role-index',
                    component: () => import('../views/admin/roles/RolesIndex.vue')
                },
                {
                    path: 'create',
                    name: 'role-create',
                    component: () => import('../views/admin/roles/RolesForm.vue')
                },
                {
                    path: ':id',
                    name: 'role-edit',
                    component: () => import('../views/admin/roles/RolesForm.vue')
                }
            ]
        },
        {
            path: '/menus',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'menu-index',
                    component: () => import('../views/admin/menus/MenuIndex.vue')
                },
                {
                    path: 'create',
                    name: 'menu-create',
                    component: () => import('../views/admin/menus/MenuForm.vue')
                },
                {
                    path: ':id',
                    name: 'menu-edit',
                    component: () => import('../views/admin/menus/MenuForm.vue')
                }
            ]
        },
        {
            path: '/navbars',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'navbar-index',
                    component: () => import('../views/admin/navbars/NavbarIndex.vue')
                },
                {
                    path: 'create',
                    name: 'navbar-create',
                    component: () => import('../views/admin/navbars/NavbarForm.vue')
                },
                {
                    path: ':id',
                    name: 'navbar-edit',
                    component: () => import('../views/admin/navbars/NavbarForm.vue')
                }
            ]
        },
        {
            path: '/banners',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'banner-index', component: () => import('../views/admin/banners/BannerIndex.vue') },
                { path: 'create', name: 'banner-create', component: () => import('../views/admin/banners/BannerForm.vue') },
                { path: ':id', name: 'banner-edit', component: () => import('../views/admin/banners/BannerForm.vue') }
            ]
        },
        {
            path: '/teachers',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'teacher-index', component: () => import('../views/admin/teachers/TeacherIndex.vue') },
                { path: 'create', name: 'teacher-create', component: () => import('../views/admin/teachers/TeacherForm.vue') },
                { path: ':id', name: 'teacher-edit', component: () => import('../views/admin/teachers/TeacherForm.vue') }
            ]
        },
        {
            path: '/articles',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'article-index', component: () => import('../views/admin/articles/ArticleIndex.vue') },
                { path: 'create', name: 'article-create', component: () => import('../views/admin/articles/ArticleForm.vue') },
                { path: ':id', name: 'article-edit', component: () => import('../views/admin/articles/ArticleForm.vue') }
            ]
        },
        {
            path: '/galleries',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'gallery-index', component: () => import('../views/admin/galleries/GalleryIndex.vue') },
                { path: 'create', name: 'gallery-create', component: () => import('../views/admin/galleries/GalleryForm.vue') },
                { path: ':id', name: 'gallery-edit', component: () => import('../views/admin/galleries/GalleryForm.vue') }
            ]
        },
        {
            path: '/settings',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'setting-index', component: () => import('../views/admin/settings/SettingIndex.vue') }
            ]
        },
        {
            path: '/religion',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'religion-index', component: () => import('../views/admin/religion/ReligionIndex.vue') },
                { path: 'create', name: 'religion-create', component: () => import('../views/admin/religion/ReligionForm.vue') },
                { path: ':id', name: 'religion-edit', component: () => import('../views/admin/religion/ReligionForm.vue') }
            ]
        },
        {
            path: '/bank',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'bank-index', component: () => import('../views/admin/bank/BankIndex.vue') },
                { path: 'create', name: 'bank-create', component: () => import('../views/admin/bank/BankForm.vue') },
                { path: ':id', name: 'bank-edit', component: () => import('../views/admin/bank/BankForm.vue') }
            ]
        },
        {
            path: '/schedule-detail',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'schedule-detail-index', component: () => import('../views/admin/schedule-detail/ScheduleDetailIndex.vue') },
                { path: 'create', name: 'schedule-detail-create', component: () => import('../views/admin/schedule-detail/ScheduleDetailForm.vue') },
                { path: ':id', name: 'schedule-detail-edit', component: () => import('../views/admin/schedule-detail/ScheduleDetailForm.vue') }
            ]
        },
        {
            path: '/discount',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'discount-index', component: () => import('../views/admin/discount/DiscountIndex.vue') },
                { path: 'create', name: 'discount-create', component: () => import('../views/admin/discount/DiscountForm.vue') },
                { path: ':id', name: 'discount-edit', component: () => import('../views/admin/discount/DiscountForm.vue') }
            ]
        },
        {
            path: '/format',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'format-index', component: () => import('../views/admin/format/FormatIndex.vue') },
                { path: 'create', name: 'format-create', component: () => import('../views/admin/format/FormatForm.vue') },
                { path: ':id', name: 'format-edit', component: () => import('../views/admin/format/FormatForm.vue') }
            ]
        },
        {
            path: '/registration-batch',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'registration-batch-index', component: () => import('../views/admin/registration-batch/RegistrationBatchIndex.vue') },
                { path: 'create', name: 'registration-batch-create', component: () => import('../views/admin/registration-batch/RegistrationBatchForm.vue') },
                { path: ':id', name: 'registration-batch-edit', component: () => import('../views/admin/registration-batch/RegistrationBatchForm.vue') }
            ]
        },
        {
            path: '/fee',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'fee-index', component: () => import('../views/admin/fee/FeeIndex.vue') },
                { path: 'create', name: 'fee-create', component: () => import('../views/admin/fee/FeeForm.vue') },
                { path: ':id', name: 'fee-edit', component: () => import('../views/admin/fee/FeeForm.vue') }
            ]
        },
        {
            path: '/position',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'position-index', component: () => import('../views/admin/position/PositionIndex.vue') },
                { path: 'create', name: 'position-create', component: () => import('../views/admin/position/PositionForm.vue') },
                { path: ':id', name: 'position-edit', component: () => import('../views/admin/position/PositionForm.vue') }
            ]
        },
        {
            path: '/selection-schedule',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'selection-schedule-index', component: () => import('../views/admin/selection-schedule/SelectionScheduleIndex.vue') },
                { path: 'create', name: 'selection-schedule-create', component: () => import('../views/admin/selection-schedule/SelectionScheduleForm.vue') },
                { path: ':id', name: 'selection-schedule-edit', component: () => import('../views/admin/selection-schedule/SelectionScheduleForm.vue') }
            ]
        },
        {
            path: '/registration-path',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'registration-path-index', component: () => import('../views/admin/registration-path/RegistrationPathIndex.vue') },
                { path: 'create', name: 'registration-path-create', component: () => import('../views/admin/registration-path/RegistrationPathForm.vue') },
                { path: ':id', name: 'registration-path-edit', component: () => import('../views/admin/registration-path/RegistrationPathForm.vue') }
            ]
        },
        {
            path: '/selection-type',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'selection-type-index', component: () => import('../views/admin/selection-type/SelectionTypeIndex.vue') },
                { path: 'create', name: 'selection-type-create', component: () => import('../views/admin/selection-type/SelectionTypeForm.vue') },
                { path: ':id', name: 'selection-type-edit', component: () => import('../views/admin/selection-type/SelectionTypeForm.vue') }
            ]
        },
        {
            path: '/classroom',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'classroom-index', component: () => import('../views/admin/classroom/ClassroomIndex.vue') },
                { path: 'create', name: 'classroom-create', component: () => import('../views/admin/classroom/ClassroomForm.vue') },
                { path: ':id', name: 'classroom-edit', component: () => import('../views/admin/classroom/ClassroomForm.vue') }
            ]
        },
        {
            path: '/exam-number',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'exam-number-index', component: () => import('../views/admin/exam-number/ExamNumberIndex.vue') },
                { path: 'create', name: 'exam-number-create', component: () => import('../views/admin/exam-number/ExamNumberForm.vue') },
                { path: ':id', name: 'exam-number-edit', component: () => import('../views/admin/exam-number/ExamNumberForm.vue') }
            ]
        },
        {
            path: '/occupation',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'occupation-index', component: () => import('../views/admin/occupation/OccupationIndex.vue') },
                { path: 'create', name: 'occupation-create', component: () => import('../views/admin/occupation/OccupationForm.vue') },
                { path: ':id', name: 'occupation-edit', component: () => import('../views/admin/occupation/OccupationForm.vue') }
            ]
        },
        {
            path: '/income',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'income-index', component: () => import('../views/admin/income/IncomeIndex.vue') },
                { path: 'create', name: 'income-create', component: () => import('../views/admin/income/IncomeForm.vue') },
                { path: ':id', name: 'income-edit', component: () => import('../views/admin/income/IncomeForm.vue') }
            ]
        },
        {
            path: '/school-data',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'school-data-index', component: () => import('../views/admin/school-data/SchoolDataIndex.vue') },
                { path: 'create', name: 'school-data-create', component: () => import('../views/admin/school-data/SchoolDataForm.vue') },
                { path: ':id', name: 'school-data-edit', component: () => import('../views/admin/school-data/SchoolDataForm.vue') }
            ]
        },
        {
            path: '/building-setup',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'building-setup-index', component: () => import('../views/admin/building-setup/BuildingSetupIndex.vue') },
                { path: 'create', name: 'building-setup-create', component: () => import('../views/admin/building-setup/BuildingSetupForm.vue') },
                { path: ':id', name: 'building-setup-edit', component: () => import('../views/admin/building-setup/BuildingSetupForm.vue') }
            ]
        },
        {
            path: '/room-setup',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'room-setup-index', component: () => import('../views/admin/room-setup/RoomSetupIndex.vue') },
                { path: 'create', name: 'room-setup-create', component: () => import('../views/admin/room-setup/RoomSetupForm.vue') },
                { path: ':id', name: 'room-setup-edit', component: () => import('../views/admin/room-setup/RoomSetupForm.vue') }
            ]
        },
        {
            path: '/discount-setup',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'discount-setup-index', component: () => import('../views/admin/discount-setup/DiscountSetupIndex.vue') },
                { path: 'create', name: 'discount-setup-create', component: () => import('../views/admin/discount-setup/DiscountSetupForm.vue') },
                { path: ':id', name: 'discount-setup-edit', component: () => import('../views/admin/discount-setup/DiscountSetupForm.vue') }
            ]
        },
        {
            path: '/academic-year-setup',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'academic-year-setup-index', component: () => import('../views/admin/academic-year-setup/AcademicYearSetupIndex.vue') },
                { path: 'create', name: 'academic-year-setup-create', component: () => import('../views/admin/academic-year-setup/AcademicYearSetupForm.vue') },
                { path: ':id', name: 'academic-year-setup-edit', component: () => import('../views/admin/academic-year-setup/AcademicYearSetupForm.vue') }
            ]
        },
        {
            path: '/life-status',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'life-status-index', component: () => import('../views/admin/life-status/LifeStatusIndex.vue') },
                { path: 'create', name: 'life-status-create', component: () => import('../views/admin/life-status/LifeStatusForm.vue') },
                { path: ':id', name: 'life-status-edit', component: () => import('../views/admin/life-status/LifeStatusForm.vue') }
            ]
        },
        {
            path: '/registration-sub-path',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'registration-sub-path-index', component: () => import('../views/admin/registration-sub-path/RegistrationSubPathIndex.vue') },
                { path: 'create', name: 'registration-sub-path-create', component: () => import('../views/admin/registration-sub-path/RegistrationSubPathForm.vue') },
                { path: ':id', name: 'registration-sub-path-edit', component: () => import('../views/admin/registration-sub-path/RegistrationSubPathForm.vue') }
            ]
        },
        {
            path: '/requirement-master',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'requirement-master-index', component: () => import('../views/admin/requirement-master/RequirementMasterIndex.vue') },
                { path: 'create', name: 'requirement-master-create', component: () => import('../views/admin/requirement-master/RequirementMasterForm.vue') },
                { path: ':id', name: 'requirement-master-edit', component: () => import('../views/admin/requirement-master/RequirementMasterForm.vue') }
            ]
        },
        {
            path: '/education-level',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'education-level-index', component: () => import('../views/admin/education-level/EducationLevelIndex.vue') },
                { path: 'create', name: 'education-level-create', component: () => import('../views/admin/education-level/EducationLevelForm.vue') },
                { path: ':id', name: 'education-level-edit', component: () => import('../views/admin/education-level/EducationLevelForm.vue') }
            ]
        },
        {
            path: '/voucher',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'voucher-index', component: () => import('../views/admin/voucher/VoucherIndex.vue') },
                { path: 'create', name: 'voucher-create', component: () => import('../views/admin/voucher/VoucherForm.vue') },
                { path: ':id', name: 'voucher-edit', component: () => import('../views/admin/voucher/VoucherForm.vue') }
            ]
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue'),
            meta: { guest: true }
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        }
        return { top: 0 }
    }
});
router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isGuest = to.matched.some(record => record.meta.guest);

    // Determine context of target route
    const refRoutes = ['/religion', '/bank', '/schedule-detail', '/discount', '/format', '/registration-batch', '/fee', '/position', '/selection-schedule', '/registration-path', '/selection-type', '/classroom', '/exam-number', '/occupation', '/income', '/school-data', '/building-setup', '/room-setup', '/discount-setup', '/academic-year-setup', '/life-status', '/registration-sub-path', '/requirement-master', '/education-level', '/voucher'];
    const isRefRoute = refRoutes.some(r => to.path.startsWith(r));

    const isAdminTarget = to.path.startsWith('/admin') || to.path.startsWith('/auth') ||
        to.path.startsWith('/users') || to.path.startsWith('/roles') ||
        to.path.startsWith('/menus') || to.path.startsWith('/settings') ||
        to.path.startsWith('/teachers') || to.path.startsWith('/articles') ||
        to.path.startsWith('/navbars') || to.path.startsWith('/banners') ||
        to.path.startsWith('/registrants') || to.path.startsWith('/registrant-accounts') || to.path.startsWith('/students') || to.path.startsWith('/galleries') ||
        to.path.startsWith('/welcome') || isRefRoute;

    const loginType = isAdminTarget ? 'admin' : 'student';

    try {
        let isAuthenticated = false;
        let userRole = null;

        try {
            const response = await api.get('/auth/me', {
                headers: { 'X-Login-Type': loginType }
            });
            isAuthenticated = true;
            userRole = response.data.role ? response.data.role.name : null;
        } catch (e) {
            isAuthenticated = false;
        }

        if (requiresAuth && !isAuthenticated) {
            if (isAdminTarget) {
                next('/auth'); // Redirect to Admin Login if trying to access Admin Area
            } else {
                next('/login'); // Redirect to Student Login otherwise
            }
        } else if (isGuest && isAuthenticated) {
            if (isAdminTarget) {
                next('/admin');
            } else {
                next('/dashboard');
            }
        } else {
            next();
        }
    } catch (error) {
        next();
    }
});

export default router;
