<template>
  <nav id="navbar" :class="['w-full z-50 transition-all duration-300', (isScrolled || !isHome) ? 'fixed top-0 scrolled' : 'absolute top-0 py-6 border-b border-white/10']">
    <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
      
      <router-link to="/" class="flex items-center gap-3 transition-colors duration-300" :class="(isScrolled || !isHome) ? 'text-dark' : 'text-white'">
        <template v-if="settings && settings.site_logo">
            <img :src="settings.site_logo + (settings.site_logo.includes('?') ? '&' : '?') + 't=' + Date.now()" alt="Logo" class="h-10 w-auto object-contain">
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
      
      <button @click="toggleMobileMenu" class="md:hidden mobile-btn text-2xl transition-colors duration-300 focus:outline-none" :class="(isScrolled || !isHome) ? 'text-dark' : 'text-white'">
          <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden mobile-menu bg-white border-t border-gray-100 shadow-2xl">
        <div class="px-6 py-4 space-y-1 max-h-[75vh] overflow-y-auto">
          <!-- Menu Header -->
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Menu</span>
            <button @click="closeMobileMenu" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <i class="fas fa-times text-gray-500"></i>
            </button>
          </div>
          
          <template v-for="menu in menus" :key="menu.id">
            <!-- Simple Link -->
            <div v-if="!menu.children || menu.children.length === 0">
              <router-link 
                v-if="isHome && menu.url.startsWith('#')"
                :to="menu.url" 
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-brand-50 hover:text-brand-orange transition-all duration-200"
                @click="closeMobileMenu"
              >
                <i class="fas fa-chevron-right text-xs opacity-50"></i>
                <span class="font-medium">{{ menu.label }}</span>
              </router-link>
              <router-link 
                v-else-if="!menu.url.startsWith('http')"
                :to="menu.url" 
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-brand-50 hover:text-brand-orange transition-all duration-200"
                @click="closeMobileMenu"
              >
                <i class="fas fa-chevron-right text-xs opacity-50"></i>
                <span class="font-medium">{{ menu.label }}</span>
              </router-link>
              <a 
                v-else 
                :href="menu.url" 
                target="_blank"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-brand-50 hover:text-brand-orange transition-all duration-200"
              >
                <i class="fas fa-external-link-alt text-xs opacity-50"></i>
                <span class="font-medium">{{ menu.label }}</span>
              </a>
            </div>
            
            <!-- Dropdown Menu (Collapsible on Mobile) -->
            <div v-else class="mb-2">
              <button 
                @click="toggleDropdown(menu.id)"
                class="w-full flex justify-between items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-brand-50 hover:text-brand-orange transition-all duration-200"
              >
                <div class="flex items-center gap-3">
                  <i class="fas fa-folder text-xs opacity-50"></i>
                  <span class="font-medium">{{ menu.label }}</span>
                </div>
                <i :class="openDropdown === menu.id ? 'fas fa-chevron-up rotate-180' : 'fas fa-chevron-down'" class="text-xs transition-transform duration-300"></i>
              </button>
              <transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-96"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 max-h-96"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-show="openDropdown === menu.id" class="pl-4 ml-4 mt-2 space-y-1 border-l-2 border-brand-orange/20">
                  <template v-for="child in menu.children" :key="child.id">
                    <!-- Nested Dropdown -->
                    <div v-if="child.children && child.children.length > 0" class="mb-1">
                      <button 
                        @click="toggleSubDropdown(child.id)"
                        class="w-full flex justify-between items-center px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-orange transition-all duration-200"
                      >
                        <div class="flex items-center gap-2">
                          <i class="fas fa-folder-open text-xs opacity-40"></i>
                          <span>{{ child.label }}</span>
                        </div>
                        <i :class="openSubDropdown === child.id ? 'fas fa-chevron-up rotate-180' : 'fas fa-chevron-right'" class="text-xs transition-transform duration-300"></i>
                      </button>
                      <transition
                        enter-active-class="transition duration-300 ease-out"
                        enter-from-class="opacity-0 max-h-0"
                        enter-to-class="opacity-100 max-h-96"
                        leave-active-class="transition duration-200 ease-in"
                        leave-from-class="opacity-100 max-h-96"
                        leave-to-class="opacity-0 max-h-0"
                      >
                        <div v-show="openSubDropdown === child.id" class="pl-4 ml-3 mt-1 space-y-1 border-l-2 border-brand-orange/10">
                          <router-link 
                            v-for="grand in child.children" 
                            :key="grand.id"
                            :to="grand.url"
                            class="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-orange transition-all duration-200"
                            @click="closeMobileMenu"
                          >
                            <i class="fas fa-file text-xs opacity-30"></i>
                            <span>{{ grand.label }}</span>
                          </router-link>
                        </div>
                      </transition>
                    </div>
                    <!-- Simple Child Link -->
                    <router-link 
                      v-else
                      :to="child.url"
                      class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-orange transition-all duration-200"
                      @click="closeMobileMenu"
                    >
                      <i class="fas fa-file text-xs opacity-30"></i>
                      <span>{{ child.label }}</span>
                    </router-link>
                  </template>
                </div>
              </transition>
            </div>
          </template>
          
          <!-- CTA Button -->
          <div class="pt-4 mt-4 border-t border-gray-100">
            <a href="#" class="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white px-6 py-4 rounded-xl font-bold text-sm hover:from-brand-orange hover:to-brand-orange transition-all duration-300 shadow-lg shadow-orange-500/30 transform hover:-translate-y-0.5">
              <i class="fas fa-user-plus"></i>
              <span>PPDB Online</span>
            </a>
          </div>
        </div>
      </div>
    </transition>
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

// Mobile menu state
const isMobileMenuOpen = ref(false);
const openDropdown = ref(null);
const openSubDropdown = ref(null);

// Check if we are on the home page
const isHome = computed(() => route.path === '/');

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
  } else {
    document.body.style.overflow = '';
    openDropdown.value = null;
    openSubDropdown.value = null;
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = '';
  openDropdown.value = null;
  openSubDropdown.value = null;
};

const toggleDropdown = (menuId) => {
  openDropdown.value = openDropdown.value === menuId ? null : menuId;
};

const toggleSubDropdown = (childId) => {
  openSubDropdown.value = openSubDropdown.value === childId ? null : childId;
};

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
