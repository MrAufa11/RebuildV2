import { reactive, toRefs } from 'vue';
import api from '../services/api';

// Create a reactive state outside the function to share state across components
const state = reactive({
    settings: {},
    loading: false,
    error: null,
    fetched: false
});

export function useSettings() {

    const fetchSettings = async () => {
        if (state.fetched) return; // Avoid re-fetching if already loaded

        state.loading = true;
        try {
            // Fetch from public settings endpoint
            const response = await api.get('/public/settings');
            state.settings = response.data;
            state.fetched = true;
        } catch (error) {
            console.error('Error fetching global settings:', error);
            state.error = error;
        } finally {
            state.loading = false;
        }
    };

    const getSetting = (key, fallback = '') => {
        return state.settings[key] !== undefined ? state.settings[key] : fallback;
    };

    return {
        ...toRefs(state),
        fetchSettings,
        getSetting
    };
}
