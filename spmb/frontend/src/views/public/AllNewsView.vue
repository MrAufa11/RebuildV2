<template>
    <div class="pt-32 pb-24 bg-slate-50 min-h-screen">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16" data-aos="fade-up">
                <span class="text-brand-orange font-bold tracking-widest uppercase text-xs">Informasi Terbaru</span>
                <h1 class="text-4xl lg:text-5xl font-serif font-bold text-dark mt-2">Kabar Al-Mawahib</h1>
            </div>

            <!-- Loading State -->
             <div v-if="loading" class="text-center py-20">
                <i class="fas fa-spinner fa-spin text-4xl text-brand-orange"></i>
                <p class="mt-4 text-slate-500">Memuat artikel...</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="(article, index) in articles" :key="article.id" class="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300" data-aos="fade-up" :data-aos-delay="index * 50">
                    <router-link :to="`/news/${article.slug}`" class="block">
                        <div class="overflow-hidden relative h-56">
                            <img :src="article.image_url || 'https://via.placeholder.com/800x600'" 
                                loading="lazy" class="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-out" />
                            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-orange uppercase tracking-wide shadow-sm">
                                {{ article.category ? article.category.name : 'Berita' }}
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold text-dark mb-3 group-hover:text-brand-orange transition leading-snug">{{ article.title }}</h3>
                            <p class="text-slate-500 line-clamp-3 mb-4 text-sm">{{ article.excerpt }}</p>
                            <div class="flex items-center justify-between text-xs text-slate-400 font-medium border-t border-slate-100 pt-4">
                                <span><i class="far fa-calendar mr-1"></i> {{ formatDate(article.published_at) }}</span>
                                <span class="group-hover:translate-x-1 transition-transform">Baca Selengkapnya <i class="fas fa-arrow-right ml-1"></i></span>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>

            <div v-if="!loading && articles.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm">
                <i class="fas fa-newspaper text-6xl text-slate-200 mb-4"></i>
                <p class="text-slate-500 font-medium">Belum ada berita yang ditampilkan.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const articles = ref([]);
const loading = ref(true);

const fetchArticles = async () => {
    try {
        const response = await api.get('/public/articles');
        articles.value = response.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
    } finally {
        loading.value = false;
    }
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
