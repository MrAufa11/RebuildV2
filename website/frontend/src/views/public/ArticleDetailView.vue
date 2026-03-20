<template>
    <div class="pt-32 pb-24 bg-slate-50 min-h-screen">
        <div v-if="loading" class="text-center py-20">
            <i class="fas fa-spinner fa-spin text-4xl text-brand-orange"></i>
            <p class="mt-4 text-slate-500">Memuat artikel...</p>
        </div>

        <div v-else-if="article" class="max-w-4xl mx-auto px-6">
            <header class="mb-12 text-center" data-aos="fade-up">
                <span v-if="article.category" class="inline-block bg-brand-orange/10 text-brand-orange px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                    {{ article.category.name }}
                </span>
                <h1 class="text-4xl md:text-5xl font-serif font-bold text-dark leading-tight mb-8">{{ article.title }}</h1>
                <div class="flex items-center justify-center gap-6 text-slate-500 text-sm font-medium">
                    <span class="flex items-center gap-2"><i class="far fa-calendar"></i> {{ formatDate(article.published_at) }}</span>
                    <span class="flex items-center gap-2"><i class="far fa-user"></i> {{ article.author ? article.author.username : 'Admin' }}</span>
                </div>
            </header>

            <div class="rounded-3xl overflow-hidden shadow-2xl mb-12 relative w-full aspect-video" data-aos="fade-up" data-aos-delay="100">
                <img :src="article.image_url" loading="lazy" class="w-full h-full object-cover">
            </div>

            <article class="prose prose-lg prose-slate mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm" data-aos="fade-up" data-aos-delay="200">
                <div v-html="article.content"></div>
            </article>

            <div class="mt-16 text-center">
                 <router-link to="/news" class="inline-flex items-center gap-2 text-brand-orange font-bold hover:underline transition">
                    <i class="fas fa-arrow-left"></i> Kembali ke Berita
                </router-link>
            </div>
        </div>
        
        <div v-else class="text-center py-24">
            <h2 class="text-2xl font-bold text-dark">Artikel tidak ditemukan</h2>
            <router-link to="/news" class="text-brand-orange mt-4 inline-block hover:underline">Kembali ke Berita</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../services/api';

const route = useRoute();
const article = ref(null);
const loading = ref(true);

const fetchArticle = async () => {
    try {
        const slug = route.params.slug;
        const response = await api.get(`/public/articles/${slug}`);
        article.value = response.data;
    } catch (error) {
        console.error('Error fetching article:', error);
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
    fetchArticle();
});
</script>

<style scoped>
/* Basic typography for html content */
:deep(.prose h2) {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
    color: #111827;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}
:deep(.prose p) {
    margin-bottom: 1rem;
    color: #4b5563;
    line-height: 1.625;
}
:deep(.prose ul) {
    list-style-type: disc;
    list-style-position: inside;
    margin-bottom: 1rem;
    margin-left: 1rem;
    color: #4b5563;
}
:deep(.prose strong) {
    font-weight: 700;
    color: #1f2937;
}
</style>
