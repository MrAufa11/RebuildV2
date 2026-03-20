<template>
    <div class="pt-32 pb-24 bg-slate-50 min-h-screen">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16" data-aos="fade-up">
                <span class="text-brand-orange font-bold tracking-widest uppercase text-xs">Dokumentasi</span>
                <h1 class="text-4xl lg:text-5xl font-serif font-bold text-dark mt-2">Galeri Al-Mawahib</h1>
            </div>

            <!-- Loading State -->
             <div v-if="loading" class="text-center py-20">
                <i class="fas fa-spinner fa-spin text-4xl text-brand-orange"></i>
                <p class="mt-4 text-slate-500">Memuat galeri...</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                <div v-for="(item, index) in galleries" :key="item.id" 
                    class="group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                    :class="{ 'md:col-span-2': index % 6 === 0 || index % 6 === 4 }"
                    data-aos="fade-up" 
                    :data-aos-delay="(index % 3) * 100"
                    @click="openPreview(item)"
                >
                    <img :src="item.image_url" loading="lazy" class="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    
                    <div class="absolute bottom-0 left-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <span class="inline-block px-3 py-1 bg-brand-orange/90 text-white text-xs font-bold rounded-full mb-2 backdrop-blur-sm">
                            {{ item.category || 'Kegiatan' }}
                        </span>
                        <h3 class="text-white text-xl font-bold leading-tight">{{ item.title }}</h3>
                        <p class="text-white/80 text-sm mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{{ item.description }}</p>
                    </div>

                    <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-45 group-hover:rotate-0">
                        <i class="fas fa-expand text-white"></i>
                    </div>
                </div>
            </div>

            <div v-if="!loading && galleries.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm">
                <i class="far fa-images text-6xl text-slate-200 mb-4"></i>
                <p class="text-slate-500 font-medium">Belum ada foto galeri yang ditampilkan.</p>
            </div>
        </div>

        <!-- Lightbox -->
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm transition-opacity" @click.self="closePreview">
            <button @click="closePreview" class="absolute top-6 right-6 text-white/50 hover:text-white text-5xl transition focus:outline-none">&times;</button>
            
            <div class="max-w-6xl w-full max-h-[90vh] flex flex-col items-center relative" @click.stop>
                <div class="relative w-full flex justify-center items-center bg-black/50 rounded-lg overflow-hidden">
                     <img :src="selectedItem?.image_url" loading="lazy" class="max-w-full max-h-[80vh] object-contain shadow-2xl">
                </div>
                
                <div class="mt-4 text-center text-white max-w-2xl px-4">
                    <h3 class="text-2xl font-bold mb-2">{{ selectedItem?.title }}</h3>
                    <p class="text-white/70">{{ selectedItem?.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const galleries = ref([]);
const loading = ref(true);
const showModal = ref(false);
const selectedItem = ref(null);

const fetchGalleries = async () => {
    try {
        const response = await api.get('/public/galleries');
        galleries.value = response.data;
    } catch (error) {
        console.error('Failed to fetch galleries:', error);
    } finally {
        loading.value = false;
    }
};

const openPreview = (item) => {
    selectedItem.value = item;
    showModal.value = true;
    document.body.style.overflow = 'hidden';
};

const closePreview = () => {
    showModal.value = false;
    selectedItem.value = null;
    document.body.style.overflow = '';
};

onMounted(() => {
    fetchGalleries();
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && showModal.value) closePreview();
    });
});
</script>
