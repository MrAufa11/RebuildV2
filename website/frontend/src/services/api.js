import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
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