import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        // Axios headers can be lowercase depending on version/config
        let loginType = config.headers['X-Login-Type'] || config.headers['x-login-type'];

        if (!loginType) {
            const path = window.location.pathname;
            const refRoutes = ['/religion', '/bank', '/schedule-detail', '/discount', '/format', '/registration-batch', '/fee', '/position', '/selection-schedule', '/registration-path', '/selection-type', '/classroom', '/exam-number', '/occupation', '/income', '/school-data', '/building-setup', '/room-setup', '/discount-setup', '/academic-year-setup', '/life-status', '/registration-sub-path', '/requirement-master', '/education-level', '/voucher'];
            const isRefRoute = refRoutes.some(r => path.startsWith(r));

            const isAdmin = path.startsWith('/admin') || path.startsWith('/auth') ||
                path.startsWith('/users') || path.startsWith('/roles') ||
                path.startsWith('/menus') || path.startsWith('/settings') ||
                path.startsWith('/teachers') || path.startsWith('/articles') ||
                path.startsWith('/navbars') || path.startsWith('/banners') ||
                path.startsWith('/registrants') || path.startsWith('/registrant-accounts') ||
                path.startsWith('/students') || path.startsWith('/galleries') ||
                path.startsWith('/welcome') || isRefRoute;

            loginType = isAdmin ? 'admin' : 'student';
            config.headers['X-Login-Type'] = loginType;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;