<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Gallery Management</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage photo gallery and albums.</p>
            </div>
            <router-link :to="{ name: 'gallery-create' }" class="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-brand-500/30">
                <i class="fas fa-plus mr-2"></i>
                Add New Photo
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
                     <input v-model="search" type="text" placeholder="Search gallery..." class="pl-9 pr-4 py-2 text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-darkbg dark:text-white focus:ring-brand-500 focus:border-brand-500 w-full sm:w-64">
                 </div>
             </div>

             <!-- Gallery Grid -->
             <div class="flex-1 p-6">
                 <div v-if="loading" class="flex justify-center py-12">
                     <i class="fas fa-spinner fa-spin text-4xl text-brand-500"></i>
                 </div>

                 <div v-else-if="paginatedData.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                     <i class="fas fa-images text-4xl mb-4"></i>
                     <p>No gallery images found.</p>
                 </div>

                 <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     <div v-for="item in paginatedData" :key="item.id" class="group relative bg-white dark:bg-darkbg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                         <!-- Image Container with Fixed Aspect Ratio -->
                         <div class="relative w-full pt-[75%] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                             <img :src="item.image_url" :alt="item.title" class="absolute top-0 left-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
                             
                             <!-- Overlay Actions -->
                             <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                 <router-link :to="{ name: 'gallery-edit', params: { id: item.id } }" class="p-2 bg-white text-brand-600 rounded-full hover:bg-gray-100 transition shadow-lg" title="Edit">
                                     <i class="fas fa-edit"></i>
                                 </router-link>
                                 <button @click="confirmDelete(item.id)" class="p-2 bg-white text-red-600 rounded-full hover:bg-gray-100 transition shadow-lg" title="Delete">
                                     <i class="fas fa-trash-alt"></i>
                                 </button>
                             </div>
                         </div>
                         
                         <!-- Content -->
                         <div class="p-4 flex flex-col flex-1">
                             <div class="flex items-center justify-between mb-2">
                                 <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 uppercase tracking-wider">{{ item.website_category?.name || 'General' }}</span>
                                 <span class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</span>
                             </div>
                             <h4 class="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1" :title="item.title">{{ item.title }}</h4>
                             <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ item.description || 'No description' }}</p>
                         </div>
                     </div>
                 </div>
             </div>

             <!-- Pagination -->
             <AdminPagination 
                v-if="!loading && filteredData.length > 0"
                :total="filteredData.length"
                :per-page="perPage"
                :current-page="currentPage"
                @prev="currentPage--"
                @next="currentPage++"
                @page="page => currentPage = page"
             />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import api from '../../../services/api';
import Alert from '../../../assets/alert';
import AdminPagination from '../../../components/admin/AdminPagination.vue';

const galleries = ref([]);
const loading = ref(true);
const search = ref('');
const perPage = ref(10);
const currentPage = ref(1);

const fetchGalleries = async () => {
    loading.value = true;
    try {
        // Client-side pagination logic for now (API returns all)
        const response = await api.get('/galleries');
        galleries.value = response.data;
    } catch (error) {
        console.error('Error fetching galleries:', error);
        Alert.error('Error', 'Failed to load gallery items');
    } finally {
        loading.value = false;
    }
};

const confirmDelete = async (id) => {
    const result = await Alert.confirm('Are you sure?', 'This action cannot be undone.');
    if (result.isConfirmed) {
        try {
            await api.delete(`/galleries/${id}`);
            Alert.success('Deleted!', 'Image has been deleted.');
            fetchGalleries();
        } catch (error) {
            console.error('Error deleting item:', error);
            Alert.error('Error', 'Failed to delete item');
        }
    }
};

// Filter & Search
const filteredData = computed(() => {
    if (!search.value) return galleries.value;
    const query = search.value.toLowerCase();
    return galleries.value.filter(item => 
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.website_category && item.website_category.name.toLowerCase().includes(query))
    );
});

// Pagination Logic
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return filteredData.value.slice(start, end);
});

// Reset page when filter changes
watch([search, perPage], () => {
    currentPage.value = 1;
});

const formatDate = (dateString) => {
    if(!dateString) return '';
    return new Date(dateString).toLocaleDateString();
};

onMounted(() => {
    fetchGalleries();
});
</script>
