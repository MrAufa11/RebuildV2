<template>
  <nav id="navbar" :class="['w-full z-50 transition-all duration-300', (isScrolled || !isHome) ? 'fixed top-0 scrolled' : 'absolute top-0 py-6 border-b border-white/10']">
    <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
      
      <router-link to="/" class="flex items-center gap-3 transition-colors duration-300" :class="(isScrolled || !isHome) ? 'text-dark' : 'text-white'">
        <template v-if="settings && settings.site_logo">
            <img :src="settings.site_logo" alt="Logo" class="h-10 w-auto object-contain">
        </template>
        <div v-else class="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-orange-500/30 backdrop-blur-sm">
          <i class="fas fa-book-open"></i>
        </div>
        
        <span v-if="settings && settings.site_title" class="font-bold text-xl tracking-wide font-serif drop-shadow-md">{{ settings.site_title }}</span>
        <span v-else class="font-bold text-xl tracking-wide font-serif drop-shadow-md">Al-Mawahib<span class="text-brand-orange">.sch</span></span>
      </router-link>
      
      <div class="hidden md:flex items-center space-x-10 font-medium drop-shadow-sm">
        <template v-for="menu in menus" :key="menu.id">
            <!-- Has Dropdown -->
            <div v-if="menu.children && menu.children.length > 0" class="relative group h-full flex items-center">
                <router-link :to="menu.url" class="flex items-center gap-1 pb-1 border-b-2 border-transparent hover:border-brand-orange transition-all duration-300 cursor-pointer" :class="(isScrolled || !isHome) ? 'text-dark hover:text-brand-orange' : 'text-white hover:text-brand-orange'">
                    {{ menu.label }}
                    <i class="fas fa-chevron-down text-xs transition-transform duration-300 group-hover:rotate-180 ml-1"></i>
                </router-link>

                <!-- Level 2 Dropdown -->
                <div class="absolute top-10 left-0 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left z-50 overflow-hidden border border-gray-100">
                    <div class="py-2">
                        <template v-for="child in menu.children" :key="child.id">
                            <!-- Level 3 Dropdown Container -->
                            <div v-if="child.children && child.children.length > 0" class="relative group/sub w-full">
                                <router-link :to="child.url" class="px-5 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-orange transition-colors flex justify-between items-center w-full">
                                    {{ child.label }}
                                    <i class="fas fa-chevron-right text-xs"></i>
                                </router-link>

                                <!-- Level 3 Dropdown -->
                                <div class="absolute top-0 left-full ml-2 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300 transform origin-top-left border border-gray-100">
                                    <div class="py-2">
                                        <router-link v-for="grand in child.children" :key="grand.id" :to="grand.url" class="px-5 py-2.5 block text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-orange transition-colors">
                                            {{ grand.label }}
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                            <!-- Single Level 2 Item -->
                            <router-link v-else :to="child.url" class="px-5 py-2.5 block text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-orange transition-colors">
                                {{ child.label }}
                            </router-link>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Standard Link (No Dropdown) -->
            <template v-else>
                 <template v-if="isHome && menu.url.startsWith('#')">
                      <a :href="menu.url" class="border-b-2 border-transparent hover:border-brand-orange pb-1 transition-colors duration-300" :class="(isScrolled || !isHome) ? 'text-dark' : 'text-white'" @click.prevent="scrollTo(menu.url)">{{ menu.label }}</a>
                 </template>
                 <template v-else>
                      <router-link v-if="!menu.url.startsWith('http')" :to="menu.url" class="border-b-2 border-transparent hover:border-brand-orange pb-1 transition-colors duration-300" :class="(isScrolled || !isHome) ? 'text-dark' : 'text-white'">{{ menu.label }}</router-link>
                      <a v-else :href="menu.url" target="_blank" class="border-b-2 border-transparent hover:border-brand-orange pb-1 transition-colors duration-300" :class="(isScrolled || !isHome) ? 'text-dark' : 'text-white'">{{ menu.label }}</a>
                 </template>
            </template>
        </template>
      </div>
      
      <a href="#" class="hidden md:inline-block bg-brand-orange text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-green transition shadow-lg transform hover:-translate-y-0.5">
        PPDB Online
      </a>
      
      <button class="md:hidden mobile-btn text-2xl transition-colors duration-300" :class="(isScrolled || !isHome) ? 'text-dark' : 'text-white'">
          <i class="fas fa-bars"></i>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import { useSettings } from '../composables/useSettings';

const { settings } = useSettings();
const route = useRoute();
const isScrolled = ref(false);
const menus = ref([]);

// Check if we are on the home page
const isHome = computed(() => route.path === '/');

const fetchMenus = async () => {
    try {
        const response = await api.get('/public/menus');
        menus.value = response.data;
    } catch (error) {
        console.error('Failed to fetch menus:', error);
        // Fallback menus if API fails
        menus.value = [
            { id: 1, label: 'Beranda', url: '/' },
            { id: 2, label: 'Profil', url: '#sambutan' },
            { id: 3, label: 'Artikel', url: '#berita' },
            { id: 4, label: 'Galeri', url: '#galeri' }
        ];
    }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const scrollTo = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return;
    
    // Custom smooth scroll logic for consistent feeling with the original request
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    const duration = 1500;

    function easeInOutCubic(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  fetchMenus();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
