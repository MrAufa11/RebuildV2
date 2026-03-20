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

        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <!-- Gallery Grid View might be better than table here -->
             <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                 <div v-for="item in galleries" :key="item.id" class="group relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                     <div class="aspect-w-16 aspect-h-10 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                         <img :src="item.image_url" alt="Gallery Item" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300">
                     </div>
                     <div class="p-4">
                         <h4 class="font-bold text-gray-900 dark:text-white truncate" :title="item.title">{{ item.title }}</h4>
                         <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ item.category || 'General' }}</p>
                     </div>
                     
                     <!-- Overlay Actions -->
                     <div class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <router-link :to="{ name: 'gallery-edit', params: { id: item.id } }" class="p-1.5 bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 rounded shadow-sm hover:bg-brand-50 dark:hover:bg-brand-900/50" title="Edit">
                             <i class="fas fa-edit"></i>
                         </router-link>
                         <button @click="confirmDelete(item.id)" class="p-1.5 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 rounded shadow-sm hover:bg-red-50 dark:hover:bg-red-900/50" title="Delete">
                             <i class="fas fa-trash-alt"></i>
                         </button>
                     </div>
                 </div>

                 <!-- Empty State -->
                 <div v-if="galleries.length === 0" class="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                     <i class="fas fa-images text-4xl mb-3 text-gray-300 dark:text-gray-600 block"></i>
                     No images found.
                 </div>
             </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../../services/api';
import Alert from '../../../assets/alert';

const galleries = ref([]);

const fetchGalleries = async () => {
    try {
        const response = await api.get('/galleries');
        galleries.value = response.data;
    } catch (error) {
        console.error('Error fetching galleries:', error);
        Alert.error('Error', 'Failed to load gallery items');
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

onMounted(() => {
    fetchGalleries();
});
</script>
