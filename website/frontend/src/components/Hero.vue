<template>
  <div class="swiper swiper-hero mySwiper relative z-0 h-screen min-h-[600px]">
    <div class="swiper-wrapper" v-if="loading">
        <!-- Loading Skeleton / Placeholder -->
        <div class="swiper-slide relative bg-gray-900 flex items-center justify-center">
            <div class="animate-pulse text-white text-xl">Loading Banners...</div>
        </div>
    </div>
    <div class="swiper-wrapper" v-else>
      <div v-for="banner in banners" :key="banner.id" class="swiper-slide relative">
        <img :src="getImageUrl(banner.image_url)" loading="lazy" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/40 to-white"></div>
        <div class="absolute inset-0 flex items-center justify-center text-center">
          <div class="max-w-4xl px-6 pt-20" data-aos="fade-up">
            <span v-if="banner.subtitle" class="inline-block py-1.5 px-4 border border-white/30 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
              {{ banner.subtitle }}
            </span>
            <h1 class="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-lg" v-html="formatTitle(banner.title)"></h1>
            <p v-if="banner.description" class="text-lg text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              {{ banner.description }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center" v-if="banner.button_text && banner.button_url">
              <a :href="banner.button_url" class="bg-brand-orange text-white px-8 py-4 rounded-full font-bold hover:bg-brand-dark-orange transition shadow-lg shadow-orange-500/30 transform hover:-translate-y-1">
                {{ banner.button_text }}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Fallback if no banners -->
      <div v-if="banners.length === 0" class="swiper-slide relative">
         <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" loading="lazy" class="w-full h-full object-cover">
         <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/40 to-white"></div>
         <div class="absolute inset-0 flex items-center justify-center text-center">
             <div class="max-w-4xl px-6 pt-20">
                 <h1 class="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-lg">
                   Welcome to School
                 </h1>
             </div>
         </div>
      </div>
    </div>
    
    <div class="swiper-pagination !bottom-24"></div>

    <a href="#sambutan" @click.prevent="scrollTo('#sambutan')" class="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 text-slate-400/80 hover:text-brand-orange transition flex flex-col items-center gap-2 cursor-pointer group">
      <span class="tracking-[0.2em] uppercase text-[10px] font-bold group-hover:translate-y-1 transition">Scroll Down</span>
      <div class="w-8 h-12 border-2 border-slate-400/50 rounded-full flex justify-center pt-2 group-hover:border-brand-orange transition">
        <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce-slow group-hover:bg-brand-orange"></div>
      </div>
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import api from '../services/api';
import { useImageUrl } from '../composables/useImageUrl';

const banners = ref([]);
const loading = ref(true);

const fetchBanners = async () => {
    try {
        const response = await api.get('/public/banners');
        banners.value = response.data;
    } catch (error) {
        console.error('Error fetching banners:', error);
    } finally {
        loading.value = false;
        initSwiper();
    }
};

const initSwiper = () => {
    nextTick(() => {
        new Swiper(".mySwiper", { 
            effect: "fade", 
            speed: 1500, 
            autoplay: { delay: 6000, disableOnInteraction: false }, 
            pagination: { el: ".swiper-pagination", clickable: true } 
        });
    });
};

const formatTitle = (title) => {
    // Simple logic to wrap likely emphasized text in span, currently just returning text
    // Can be enhanced to parse **bold** etc if needed.
    return title.replace(/\n/g, '<br>');
};

const scrollTo = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth' });
};

// Image URL helper
const { getFullImageUrl } = useImageUrl();
const getImageUrl = (imageUrl) => getFullImageUrl(imageUrl);

onMounted(() => {
    fetchBanners();
});
</script>
