<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Banner Management</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage hero banners and slides.</p>
            </div>
            <router-link :to="{ name: 'banner-create' }" class="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-brand-500/30">
                <i class="fas fa-plus mr-2"></i>
                Add New Banner
            </router-link>
        </div>

        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                         <tr v-for="banner in banners" :key="banner.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <img :src="banner.image_url" alt="Banner" class="h-10 w-16 object-cover rounded bg-gray-100">
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ banner.title }}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ banner.subtitle }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {{ banner.order }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                <span :class="[
                                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                    banner.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                ]">
                                    {{ banner.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex items-center justify-end gap-2">
                                    <router-link :to="{ name: 'banner-edit', params: { id: banner.id } }" class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </router-link>
                                    <button @click="confirmDelete(banner.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="banners.length === 0">
                            <td colspan="5" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                No banners found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../../services/api';
import Alert from '../../../assets/alert';

const banners = ref([]);

const fetchBanners = async () => {
    try {
        const response = await api.get('/banners');
        banners.value = response.data;
    } catch (error) {
        console.error('Error fetching banners:', error);
        Alert.error('Error', 'Failed to load banners');
    }
};

const confirmDelete = async (id) => {
    const result = await Alert.confirm('Are you sure?', 'This action cannot be undone.');
    if (result.isConfirmed) {
        try {
            await api.delete(`/banners/${id}`);
            Alert.success('Deleted!', 'Banner has been deleted.');
            fetchBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
            Alert.error('Error', 'Failed to delete banner');
        }
    }
};

onMounted(() => {
    fetchBanners();
});
</script>
