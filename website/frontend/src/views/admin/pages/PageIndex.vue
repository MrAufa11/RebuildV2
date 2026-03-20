<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Custom Pages</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage custom pages and content.</p>
            </div>
            <router-link :to="{ name: 'page-create' }" class="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-brand-500/30">
                <i class="fas fa-plus mr-2"></i>
                Add New Page
            </router-link>
        </div>

        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-[500px]">
             
             <!-- Filter Bar -->
             <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                 <div class="flex items-center gap-2">
                     <span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
                     <select v-model="perPage" class="text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-darkbg dark:text-white focus:ring-brand-500 focus:border-brand-500">
                         <option :value="10">10</option>
                         <option :value="25">25</option>
                         <option :value="50">50</option>
                     </select>
                     <span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
                 </div>
                 <div class="relative">
                     <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                     <input v-model="search" type="text" placeholder="Search pages..." class="pl-9 pr-4 py-2 text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-darkbg dark:text-white focus:ring-brand-500 focus:border-brand-500 w-full sm:w-64">
                 </div>
             </div>

             <!-- Pages Table -->
             <div class="overflow-x-auto">
                 <table class="w-full text-left border-collapse">
                     <thead>
                         <tr class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">
                             <th class="px-6 py-4 font-semibold border-b border-gray-100 dark:border-gray-700">Title</th>
                             <th class="px-6 py-4 font-semibold border-b border-gray-100 dark:border-gray-700">Slug</th>
                             <th class="px-6 py-4 font-semibold border-b border-gray-100 dark:border-gray-700">Status</th>
                             <th class="px-6 py-4 font-semibold border-b border-gray-100 dark:border-gray-700 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                         <tr v-if="loading" class="animate-pulse">
                             <td colspan="4" class="px-6 py-4 text-center text-gray-500">Loading...</td>
                         </tr>
                         <tr v-else-if="paginatedData.length === 0">
                             <td colspan="4" class="px-6 py-8 text-center text-gray-500">No pages found.</td>
                         </tr>
                         <tr v-else v-for="page in paginatedData" :key="page.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                             <td class="px-6 py-4">
                                 <div class="font-medium text-gray-900 dark:text-white">{{ page.title }}</div>
                             </td>
                             <td class="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm font-mono">
                                 /{{ page.slug }}
                             </td>
                             <td class="px-6 py-4">
                                 <span :class="page.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'" class="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                     {{ page.is_active ? 'Active' : 'Draft' }}
                                 </span>
                             </td>
                             <td class="px-6 py-4 text-right space-x-2">
                                 <a :href="`/pages/${page.slug}`" target="_blank" class="text-gray-400 hover:text-brand-600 transition-colors" title="View">
                                     <i class="fas fa-external-link-alt"></i>
                                 </a>
                                 <router-link :to="{ name: 'page-edit', params: { id: page.id } }" class="text-brand-600 hover:text-brand-800 transition-colors" title="Edit">
                                     <i class="fas fa-edit"></i>
                                 </router-link>
                                 <button @click="confirmDelete(page.id)" class="text-red-500 hover:text-red-700 transition-colors" title="Delete">
                                     <i class="fas fa-trash-alt"></i>
                                 </button>
                             </td>
                         </tr>
                     </tbody>
                 </table>
             </div>

             <!-- Pagination -->
             <div class="mt-auto border-t border-gray-100 dark:border-gray-700 p-4">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        Showing {{ (currentPage - 1) * perPage + 1 }} to {{ Math.min(currentPage * perPage, filteredData.length) }} of {{ filteredData.length }} entries
                    </div>
                    <div class="flex gap-2">
                        <button 
                            @click="currentPage--" 
                            :disabled="currentPage === 1"
                            class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                        >
                            Previous
                        </button>
                        <button 
                            @click="currentPage++" 
                            :disabled="currentPage * perPage >= filteredData.length"
                            class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </div>
             </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import api from '../../../services/api';
import Alert from '../../../assets/alert';

const pages = ref([]);
const loading = ref(true);
const search = ref('');
const perPage = ref(10);
const currentPage = ref(1);

const fetchPages = async () => {
    loading.value = true;
    try {
        const response = await api.get('/pages');
        pages.value = response.data;
    } catch (error) {
        console.error('Error fetching pages:', error);
        Alert.error('Error', 'Failed to load pages');
    } finally {
        loading.value = false;
    }
};

const confirmDelete = async (id) => {
    const result = await Alert.confirm('Are you sure?', 'This action cannot be undone.');
    if (result.isConfirmed) {
        try {
            await api.delete(`/pages/${id}`);
            Alert.success('Deleted!', 'Page has been deleted.');
            fetchPages();
        } catch (error) {
            console.error('Error deleting page:', error);
            Alert.error('Error', 'Failed to delete page');
        }
    }
};

const filteredData = computed(() => {
    if (!search.value) return pages.value;
    const query = search.value.toLowerCase();
    return pages.value.filter(item => 
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.slug && item.slug.toLowerCase().includes(query))
    );
});

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return filteredData.value.slice(start, end);
});

watch([search, perPage], () => {
    currentPage.value = 1;
});

onMounted(() => {
    fetchPages();
});
</script>
