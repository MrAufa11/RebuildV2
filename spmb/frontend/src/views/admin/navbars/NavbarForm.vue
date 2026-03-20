<template>
    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h3 class="font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit Navbar Item' : 'Create New Navbar Item' }}</h3>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6">
            <div class="space-y-6">
                <!-- Label -->
                <div>
                    <label for="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label</label>
                    <input 
                        v-model="form.label" 
                        type="text" 
                        id="label" 
                        required 
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900/50 sm:text-sm px-4 py-2.5 transition-colors" 
                        placeholder="e.g. Profil"
                    >
                </div>

                <!-- URL -->
                <div>
                    <label for="url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL / Path</label>
                    <input 
                        v-model="form.url" 
                        type="text" 
                        id="url" 
                        required 
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900/50 sm:text-sm px-4 py-2.5 transition-colors font-mono" 
                        placeholder="e.g. /about or #about"
                    >
                </div>

                <!-- Icon -->
                <div>
                    <label for="icon" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon Class (Optional)</label>
                    <div class="flex items-center gap-2">
                        <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
                             <i :class="[form.icon || 'fas fa-link']"></i>
                        </div>
                        <input 
                            v-model="form.icon" 
                            type="text" 
                            id="icon" 
                            class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900/50 sm:text-sm px-4 py-2.5 transition-colors font-mono" 
                            placeholder="e.g. fas fa-user"
                        >
                    </div>
                </div>

                <!-- Parent Navbar -->
                <div>
                    <label for="parent_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parent (Optional)</label>
                    <select 
                        v-model="form.parent_id" 
                        id="parent_id" 
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900/50 sm:text-sm px-4 py-2.5 transition-colors cursor-pointer"
                    >
                        <option :value="null">No Parent (Top Level)</option>
                        <option v-for="opt in parentOptions" :key="opt.id" :value="opt.id" :disabled="opt.id === form.id">
                            {{ opt.labelDisplay }}
                        </option>
                    </select>
                </div>

                <!-- Order -->
                <div>
                    <label for="order" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Order</label>
                    <input 
                        v-model.number="form.order" 
                        type="number" 
                        id="order" 
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900/50 sm:text-sm px-4 py-2.5 transition-colors" 
                        placeholder="0"
                    >
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
                <button type="button" @click="goBack" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all cursor-pointer">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-lg shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all shadow-brand-500/30 cursor-pointer">
                    <i class="fas fa-save mr-2"></i> {{ isEditing ? 'Update' : 'Create' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';

const route = useRoute();
const router = useRouter();

const isEditing = computed(() => !!route.params.id);
const parentOptions = ref([]);

const form = ref({
    id: null,
    label: '',
    url: '',
    icon: '',
    order: 0,
    parent_id: null
});

// Helper to flatten the tree for the select box
const flattenNavbars = (navbars, level = 0, result = []) => {
    navbars.forEach(navbar => {
        result.push({
            id: navbar.id,
            label: navbar.label,
            labelDisplay: '- '.repeat(level) + navbar.label
        });
        if (navbar.children && navbar.children.length > 0) {
            flattenNavbars(navbar.children, level + 1, result);
        }
    });
    return result;
};

const fetchParentOptions = async () => {
    try {
        const response = await api.get('/navbars');
        parentOptions.value = flattenNavbars(response.data);
    } catch (error) {
        console.error('Error fetching parent options:', error);
    }
};

const fetchNavbar = async (id) => {
    try {
        const response = await api.get(`/navbars/${id}`);
        const navbar = response.data;
        form.value = {
            id: navbar.id,
            label: navbar.label,
            url: navbar.url,
            icon: navbar.icon,
            order: navbar.order,
            parent_id: navbar.parent_id
        };
    } catch (error) {
        console.error('Error fetching navbar:', error);
        router.push({ name: 'navbar-index' });
    }
};

const handleSubmit = async () => {
    try {
        if (isEditing.value) {
            await api.put(`/navbars/${route.params.id}`, form.value);
        } else {
            await api.post('/navbars', form.value);
        }
        router.push({ name: 'navbar-index' });
    } catch (error) {
        console.error('Error saving navbar:', error);
        alert('Failed to save navbar');
    }
};

const goBack = () => {
    router.push({ name: 'navbar-index' });
};

onMounted(async () => {
    await fetchParentOptions();
    if (isEditing.value) {
        await fetchNavbar(route.params.id);
    }
});
</script>
