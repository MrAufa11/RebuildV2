<template>
    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h3 class="font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit Photo' : 'Upload New Photo' }}</h3>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6">
            <div class="space-y-6">
                <!-- Title -->
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input v-model="form.title" type="text" id="title" required class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors" placeholder="e.g. School Event 2024">
                </div>

                <!-- Description -->
                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea v-model="form.description" id="description" rows="3" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors" placeholder="Details about this photo..."></textarea>
                </div>

                <!-- Category -->
                <div>
                    <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select v-model="form.category_id" id="category" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors">
                        <option :value="null" disabled>Select Category</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                </div>

                <!-- Image Upload -->
                <div>
                     <ImageUpload v-model="form.image_url" label="Gallery Image" id="gallery-image" />
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
                <button type="button" @click="goBack" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all cursor-pointer">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-lg shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all shadow-brand-500/30 cursor-pointer">
                    <i class="fas fa-save mr-2"></i> {{ isEditing ? 'Update Photo' : 'Save Photo' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';
import Alert from '../../../assets/alert';
import ImageUpload from '../../../components/admin/ImageUpload.vue';

const route = useRoute();
const router = useRouter();

const isEditing = computed(() => !!route.params.id);

const form = ref({
    title: '',
    description: '',
    category_id: null,
    image_url: ''
});

const categories = ref([]);

const fetchCategories = async () => {
    try {
        const response = await api.get('/categories?type=gallery');
        categories.value = response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

const fetchGallery = async (id) => {
    try {
        const response = await api.get(`/galleries/${id}`);
        form.value = response.data;
    } catch (error) {
        console.error('Error fetching gallery item:', error);
        Alert.error('Error', 'Failed to load item data');
        router.push({ name: 'gallery-index' });
    }
};

const handleSubmit = async () => {
    try {
        if (isEditing.value) {
            await api.put(`/galleries/${route.params.id}`, form.value);
            Alert.success('Success', 'Item updated successfully');
        } else {
            await api.post('/galleries', form.value);
            Alert.success('Success', 'Item created successfully');
        }
        router.push({ name: 'gallery-index' });
    } catch (error) {
        console.error('Error saving item:', error);
        Alert.error('Error', error.response?.data?.message || 'Failed to save item');
    }
};

const goBack = () => {
    router.push({ name: 'gallery-index' });
};

onMounted(async () => {
    await fetchCategories();
    if (isEditing.value) {
        await fetchGallery(route.params.id);
    }
});
</script>
