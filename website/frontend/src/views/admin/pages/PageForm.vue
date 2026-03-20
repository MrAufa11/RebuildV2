<template>
    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 font-bold">
            {{ isEditing ? 'Edit Page' : 'Create New Page' }}
        </div>
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Title -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Page Title</label>
                    <input v-model="form.title" type="text" @input="generateSlug" required class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white px-4 py-2.5">
                </div>

                <!-- Slug -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL)</label>
                    <input v-model="form.slug" type="text" required class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed px-4 py-2.5" readonly>
                </div>
            </div>

            <!-- Content -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (HTML allowed)</label>
                
                <div class="mb-2">
                     <ImageUpload @update:modelValue="insertImage" label="Insert Image to Content" :preview="false" />
                </div>

                <textarea v-model="form.content" rows="10" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white px-4 py-2.5 font-mono text-sm"></textarea>
                <p class="text-xs text-gray-500 mt-1">You can use basic HTML tags.</p>
            </div>

            <!-- Status -->
            <div class="flex items-center">
                <input v-model="form.is_active" type="checkbox" id="is_active" class="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded">
                <label for="is_active" class="ml-2 block text-sm text-gray-900 dark:text-white">Active (Publish)</label>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <router-link :to="{ name: 'page-index' }" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</router-link>
                <button type="submit" class="px-4 py-2 text-white bg-brand-600 rounded-lg hover:bg-brand-700 flex items-center shadow-lg shadow-brand-500/30">
                    <i class="fas fa-save mr-2"></i> Save Page
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
    slug: '',
    content: '',
    is_active: true
});

const insertImage = (url) => {
    if (url) {
        const imgTag = `<img src="${url}" alt="Image" class="my-4 rounded-lg shadow-md max-w-full">`;
        form.value.content = (form.value.content || '') + `\n${imgTag}\n`;
        Alert.success('Image Inserted', 'Image tag added to content end.');
    }
};

const generateSlug = () => {
    if (!isEditing.value) { // Only auto-generate if creating
        form.value.slug = form.value.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
};

const fetchPage = async (id) => {
    try {
        const response = await api.get(`/pages/${id}`);
        form.value = response.data;
    } catch (error) {
        console.error('Error fetching page:', error);
        Alert.error('Error', 'Failed to load page');
    }
};

const handleSubmit = async () => {
    try {
        if (isEditing.value) {
            await api.put(`/pages/${route.params.id}`, form.value);
            Alert.success('Success', 'Page updated');
        } else {
            await api.post('/pages', form.value);
            Alert.success('Success', 'Page created');
        }
        router.push({ name: 'page-index' });
    } catch (error) {
        console.error('Error saving page:', error);
        Alert.error('Error', error.response?.data?.message || 'Failed to save');
    }
};

onMounted(async () => {
    if (isEditing.value) {
        await fetchPage(route.params.id);
    }
});
</script>
