<template>
    <div class="pt-32 pb-24 bg-slate-50 min-h-screen">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-12" data-aos="fade-up">
                <span class="text-brand-orange font-bold tracking-widest uppercase text-xs">Informasi Terbaru</span>
                <h1 class="text-4xl lg:text-5xl font-serif font-bold text-dark mt-2">Kabar Al-Mawahib</h1>
            </div>

            <!-- Filter Section -->
            <div class="bg-white rounded-2xl shadow-sm p-6 mb-12" data-aos="fade-up" data-aos-delay="100">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Search -->
                    <div class="md:col-span-2 relative">
                        <input 
                            v-model="filters.search" 
                            type="text" 
                            placeholder="Cari berita..." 
                            class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-orange/20 transition placeholder-slate-400"
                        >
                        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    </div>

                    <!-- Category Filter -->
                    <div class="relative">
                        <select 
                            v-model="filters.category" 
                            class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-orange/20 transition appearance-none cursor-pointer text-slate-600"
                        >
                            <option value="">Semua Kategori</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                        </select>
                        <i class="fas fa-tag absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                    </div>

                    <!-- Date Filter (Year/Month) -->
                    <div class="relative">
                        <input 
                            v-model="filters.date" 
                            type="month" 
                            class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-orange/20 transition text-slate-600"
                        >
                        <i class="far fa-calendar-alt absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
             <div v-if="loading" class="text-center py-20">
                <i class="fas fa-spinner fa-spin text-4xl text-brand-orange"></i>
                <p class="mt-4 text-slate-500">Memuat artikel...</p>
            </div>

            <!-- Articles Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="(article, index) in filteredArticles" :key="article.id" class="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300" data-aos="fade-up" :data-aos-delay="index * 50">
                    <router-link :to="`/news/${article.slug}`" class="block">
                        <div class="overflow-hidden relative h-56">
                            <img :src="article.image_url || 'https://via.placeholder.com/800x600'" loading="lazy" class="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-out" />
                            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-orange uppercase tracking-wide shadow-sm">
                                {{ article.category ? article.category.name : 'Berita' }}
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold text-dark mb-3 group-hover:text-brand-orange transition leading-snug line-clamp-2">{{ article.title }}</h3>
                            <p class="text-slate-500 line-clamp-3 mb-4 text-sm">{{ article.excerpt }}</p>
                            <div class="flex items-center justify-between text-xs text-slate-400 font-medium border-t border-slate-100 pt-4">
                                <span><i class="far fa-calendar mr-1"></i> {{ formatDate(article.published_at) }}</span>
                                <span class="group-hover:translate-x-1 transition-transform">Baca Selengkapnya <i class="fas fa-arrow-right ml-1"></i></span>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="!loading && filteredArticles.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 mt-8">
                <div class="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-search text-3xl text-brand-orange"></i>
                </div>
                <h3 class="text-xl font-bold text-dark mb-2">Tidak ada berita ditemukan</h3>
                <p class="text-slate-500 font-medium max-w-md mx-auto">Coba ubah kata kunci pencarian atau filter kategori Anda.</p>
                <button @click="resetFilters" class="mt-6 text-brand-orange font-bold hover:underline">Reset Filter</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../services/api';

const articles = ref([]);
const categories = ref([]); // To store unique categories
const loading = ref(true);

const filters = ref({
    search: '',
    category: '',
    date: '' // YYYY-MM
});

const fetchArticles = async () => {
    try {
        const response = await api.get('/public/articles');
        articles.value = response.data;
        
        // Extract unique categories from articles for the filter
        const uniqueCats = new Map();
        articles.value.forEach(article => {
            if (article.category) {
                uniqueCats.set(article.category.id, article.category);
            }
        });
        categories.value = Array.from(uniqueCats.values());

    } catch (error) {
        console.error('Error fetching articles:', error);
    } finally {
        loading.value = false;
    }
};

const filteredArticles = computed(() => {
    return articles.value.filter(article => {
        // 1. Search Filter
        const searchMatch = article.title.toLowerCase().includes(filters.value.search.toLowerCase()) || 
                            (article.excerpt && article.excerpt.toLowerCase().includes(filters.value.search.toLowerCase()));

        // 2. Category Filter
        const categoryMatch = filters.value.category === '' || (article.category && article.category.name === filters.value.category);

        // 3. Date Filter (YYYY-MM)
        let dateMatch = true;
        if (filters.value.date && article.published_at) {
            const articleDate = new Date(article.published_at);
            const [filterYear, filterMonth] = filters.value.date.split('-');
            const yearMatch = articleDate.getFullYear() === parseInt(filterYear);
            const monthMatch = (articleDate.getMonth() + 1) === parseInt(filterMonth);
            dateMatch = yearMatch && monthMatch;
        }

        return searchMatch && categoryMatch && dateMatch;
    });
});

const resetFilters = () => {
    filters.value = {
        search: '',
        category: '',
        date: ''
    };
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
};

onMounted(() => {
    fetchArticles();
});
</script>
