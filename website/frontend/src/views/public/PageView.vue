<template>
    <div class="pt-32 pb-24 bg-slate-50 min-h-screen">
        <div class="max-w-4xl mx-auto px-6">
             <div v-if="loading" class="text-center py-20">
                <i class="fas fa-spinner fa-spin text-4xl text-brand-orange"></i>
                <p class="mt-4 text-slate-500">Memuat halaman...</p>
            </div>

            <div v-else-if="error" class="text-center py-20 bg-white rounded-3xl shadow-sm">
                 <h1 class="text-4xl font-serif font-bold text-dark mb-4">Page Not Found</h1>
                 <p class="text-slate-500">{{ error }}</p>
                 <router-link to="/" class="inline-block mt-6 px-6 py-2 bg-brand-orange text-white rounded-full font-bold hover:bg-brand-dark transition">Back to Home</router-link>
            </div>

            <div v-else>
                <div class="text-center mb-10" data-aos="fade-up">
                    <h1 class="text-3xl lg:text-4xl font-serif font-bold text-dark mt-2">{{ page.title }}</h1>
                </div>

                <div class="bg-white rounded-3xl shadow-sm p-8 md:p-12 prose max-w-none prose-orange" data-aos="fade-up" data-aos-delay="100">
                    <div v-html="page.content"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../services/websiteApi';

const route = useRoute();
const page = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchPage = async () => {
    loading.value = true;
    error.value = null;
    try {
        const slug = route.params.slug;
        const response = await api.get(`/pages/slug/${slug}`);
        if (response.data) {
            page.value = response.data;
        } else {
             error.value = 'Halaman tidak ditemukan.';
        }
    } catch (err) {
        console.error('Error fetching page:', err);
        error.value = 'Failed to load page content.';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchPage();
});

watch(() => route.params.slug, () => {
    if (route.name === 'public-page') {
        fetchPage();
    }
});
</script>

<style>
/* Responsive Prose */
.prose img {
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
