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
                },
                {
                    path: 'page/:slug',
                    name: 'public-page',
                    component: () => import('../views/public/PageView.vue')
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
            path: '/pages',
            component: () => import('../views/admin/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'page-index', component: () => import('../views/admin/pages/PageIndex.vue') },
                { path: 'create', name: 'page-create', component: () => import('../views/admin/pages/PageForm.vue') },
                { path: ':id', name: 'page-edit', component: () => import('../views/admin/pages/PageForm.vue') }
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

    try {
        if (requiresAuth || isGuest) {
            let isAuthenticated = false;
            try {
                // We can optimize this by checking a local store first, but for now check API
                await api.get('/auth/me');
                isAuthenticated = true;
            } catch (e) {
                isAuthenticated = false;
            }

            if (requiresAuth && !isAuthenticated) {
                next('/login');
            } else if (isGuest && isAuthenticated) {
                next('/admin');
            } else {
                next();
            }
        } else {
            next();
        }
    } catch (error) {
        next();
    }
});

export default router;
