<template>
  <section class="pb-24 pt-24" id="sambutan">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col lg:flex-row gap-16 items-center">
        <div class="lg:w-1/2 relative" data-aos="fade-right">
          <div class="absolute -top-10 -left-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl -z-10"></div>
          <img :src="settings.welcome_image || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'" 
               class="rounded-[2.5rem] shadow-2xl shadow-slate-200 w-full object-cover h-[500px]">
          <div class="absolute bottom-8 right-8 bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/50 max-w-xs">
            <div class="flex items-center gap-3 mb-2">
              <img :src="settings.principal_image || 'https://randomuser.me/api/portraits/men/32.jpg'" class="w-8 h-8 rounded-full object-cover">
              <span class="text-xs font-bold text-slate-600">{{ settings.principal_name || 'Drs. H. Ahmad Fauzi' }}</span>
            </div>
            <p class="text-sm font-serif italic text-slate-800">"{{ settings.principal_quote || 'Pendidikan adalah senjata paling mematikan untuk mengubah dunia.' }}"</p>
          </div>
        </div>
        
        <div class="lg:w-1/2" data-aos="fade-left">
          <span class="text-brand-orange font-bold tracking-widest uppercase text-xs mb-2 block">Sambutan Kepala Madrasah</span>
          <!-- Dynamic Title -->
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-dark mb-6 leading-[1.15]" v-html="formattedTitle"></h2>
          
          <!-- Dynamic Message -->
          <p class="text-lg text-slate-500 mb-8 leading-relaxed">
            {{ settings.welcome_message || defaultMessage }}
          </p>
          
          <div class="grid grid-cols-3 gap-8 border-t border-slate-100 pt-8 mb-8">
            <div><span class="block text-3xl font-bold text-dark">232</span><span class="text-xs text-slate-400 uppercase tracking-wide">Siswa</span></div>
            <div><span class="block text-3xl font-bold text-dark">52</span><span class="text-xs text-slate-400 uppercase tracking-wide">Guru</span></div>
            <div><span class="block text-3xl font-bold text-dark">A</span><span class="text-xs text-slate-400 uppercase tracking-wide">Akreditasi</span></div>
          </div>
          <a href="#" class="inline-flex items-center gap-2 text-brand-orange font-bold hover:text-brand-green transition group">
            Baca Selengkapnya <i class="fas fa-arrow-right transform group-hover:translate-x-1 transition"></i>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/websiteApi';

const settings = ref({});
const defaultTitle = 'Membangun Fondasi <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-500">Karakter Qur\'ani</span> di Era Digital';
const defaultMessage = 'Selamat datang di MA Bina Insan Mulia Al-Mawahib. Kami percaya bahwa kecerdasan intelektual harus berjalan beriringan dengan kematangan spiritual. Kurikulum kami dirancang untuk menjawab tantangan zaman tanpa mencabut akar tradisi keislaman.';

const formattedTitle = computed(() => {
    if (settings.value.welcome_title) {
        return settings.value.welcome_title;
    }
    return defaultTitle;
});

const fetchSettings = async () => {
    try {
        const response = await api.get('/settings');
        settings.value = response.data;
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
};

onMounted(() => {
    fetchSettings();
});
</script>
