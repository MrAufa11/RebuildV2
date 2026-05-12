import axios from 'axios';

const normalizeApiBaseUrl = (value) => {
    const raw = (value || '').trim();

    // Default ke proxy /api saat env tidak tersedia
    if (!raw) {
        return '/api';
    }

    // Relative path tetap dipakai apa adanya
    if (raw.startsWith('/')) {
        return raw.replace(/\/+$/, '') || '/api';
    }

    // Absolute URL: kalau cuma host root, tambahkan /api
    try {
        const url = new URL(raw);
        const pathname = url.pathname.replace(/\/+$/, '');

        if (!pathname || pathname === '') {
            url.pathname = '/api';
        }

        return url.toString().replace(/\/+$/, '');
    } catch {
        return raw.replace(/\/+$/, '');
    }
};

const api = axios.create({
    baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
    (config) => {
        // Since we explicitly use admin token context for the CMS
        config.headers['X-Login-Type'] = 'admin';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
