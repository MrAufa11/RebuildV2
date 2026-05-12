import axios from 'axios';

const normalizeWebsiteApiBaseUrl = (value) => {
    const raw = (value || '').trim();

    if (!raw) {
        return '/api/website';
    }

    if (raw.startsWith('/')) {
        return raw.replace(/\/+$/, '') || '/api/website';
    }

    try {
        const url = new URL(raw);
        const pathname = url.pathname.replace(/\/+$/, '');

        if (!pathname || pathname === '' || pathname === '/api') {
            url.pathname = '/api/website';
        }

        return url.toString().replace(/\/+$/, '');
    } catch {
        return raw.replace(/\/+$/, '');
    }
};

const websiteApi = axios.create({
    baseURL: normalizeWebsiteApiBaseUrl(
        import.meta.env.VITE_WEBSITE_API_URL || import.meta.env.VITE_API_URL
    ),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

websiteApi.interceptors.request.use(
    (config) => {
        config.headers['X-Frontend-Scope'] = 'public';
        return config;
    },
    (error) => Promise.reject(error)
);

export default websiteApi;
