<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Article Management</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage news and articles.</p>
            </div>
            <router-link :to="{ name: 'article-create' }" class="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-brand-500/30">
                <i class="fas fa-plus mr-2"></i>
                Write New Article
            </router-link>
        </div>

        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Published Date</th>
                            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                         <tr v-for="article in articles" :key="article.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs" :title="article.title">{{ article.title }}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ article.excerpt }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                     {{ article.category ? article.category.name : 'Uncategorized' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {{ formatDate(article.published_at) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                <span :class="[
                                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase',
                                    article.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                    article.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                ]">
                                    {{ article.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex items-center justify-end gap-2">
                                    <router-link :to="{ name: 'article-edit', params: { id: article.id } }" class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </router-link>
                                    <button @click="confirmDelete(article.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="articles.length === 0">
                            <td colspan="5" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                No articles found.
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

const articles = ref([]);

const fetchArticles = async () => {
    try {
        const response = await api.get('/articles');
        articles.value = response.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        Alert.error('Error', 'Failed to load articles');
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

const confirmDelete = async (id) => {
    const result = await Alert.confirm('Are you sure?', 'This action cannot be undone.');
    if (result.isConfirmed) {
        try {
            await api.delete(`/articles/${id}`);
            Alert.success('Deleted!', 'Article has been deleted.');
            fetchArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
            Alert.error('Error', 'Failed to delete article');
        }
    }
};

onMounted(() => {
    fetchArticles();
});
</script>
