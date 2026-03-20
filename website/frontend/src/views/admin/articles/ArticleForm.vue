<template>
    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h3 class="font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit Article' : 'Compose New Article' }}</h3>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6">
            <div class="space-y-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Title -->
                        <div>
                            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input v-model="form.title" type="text" id="title" required class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors" placeholder="Article Headline">
                        </div>

                         <!-- Excerpt -->
                        <div>
                            <label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
                            <textarea v-model="form.excerpt" id="excerpt" rows="2" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors" placeholder="Short summary..."></textarea>
                        </div>

                        <!-- Content -->
                        <div>
                            <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                            <textarea v-model="form.content" id="content" rows="12" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors font-mono" placeholder="Write your article content here... (HTML or Markdown supported depending on implementation)"></textarea>
                        </div>
                    </div>

                    <div class="space-y-6">
                         <!-- Status -->
                        <div>
                            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select v-model="form.status" id="status" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <!-- Category -->
                        <div>
                            <label for="category_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select v-model="form.category_id" id="category_id" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors">
                                <option :value="null">Select Category</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                            </select>
                        </div>

                        <!-- Image Upload -->
                        <div>
                             <ImageUpload v-model="form.image_url" label="Featured Image" id="article-image" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
                <button type="button" @click="goBack" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all cursor-pointer">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-lg shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all shadow-brand-500/30 cursor-pointer">
                    <i class="fas fa-save mr-2"></i> {{ isEditing ? 'Update Article' : 'Publish Article' }}
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
const categories = ref([]);

const form = ref({
    title: '',
    excerpt: '',
    content: '',
    status: 'draft',
    category_id: null,
    image_url: ''
});

const fetchCategories = async () => {
    try {
        const response = await api.get('/categories');
        categories.value = response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

const fetchArticle = async (id) => {
    try {
        const response = await api.get(`/articles/${id}`);
        const article = response.data;
        form.value = {
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            status: article.status,
            category_id: article.category_id,
            image_url: article.image_url
        };
    } catch (error) {
        console.error('Error fetching article:', error);
        Alert.error('Error', 'Failed to load article data');
        router.push({ name: 'article-index' });
    }
};

const handleSubmit = async () => {
    try {
        if (isEditing.value) {
            await api.put(`/articles/${route.params.id}`, form.value);
            Alert.success('Success', 'Article updated successfully');
        } else {
            await api.post('/articles', form.value);
            Alert.success('Success', 'Article created successfully');
        }
        router.push({ name: 'article-index' });
    } catch (error) {
        console.error('Error saving article:', error);
        Alert.error('Error', error.response?.data?.message || 'Failed to save article');
    }
};

const goBack = () => {
    router.push({ name: 'article-index' });
};

onMounted(async () => {
    await fetchCategories();
    if (isEditing.value) {
        await fetchArticle(route.params.id);
    }
});
</script>
