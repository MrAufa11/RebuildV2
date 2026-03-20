<template>
  <section class="py-24 bg-white overflow-hidden" id="galeri">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16" data-aos="fade-up">
        <span class="text-brand-orange font-bold tracking-widest uppercase text-xs">Dokumentasi</span>
        <h2 class="text-4xl font-serif font-bold text-dark mt-2">Galeri Aktivitas</h2>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[500px]">
        <!-- Big Item (Index 0) -->
        <div v-if="items[0]" @click="openPreview(items[0])" class="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer" data-aos="zoom-in">
          <img :src="items[0].image_url" loading="lazy"
               class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
          <div class="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition duration-500 translate-y-4 group-hover:translate-y-0 font-bold text-lg">
              {{ items[0].title }}
          </div>
        </div>

        <!-- Small Item (Index 1) -->
        <div v-if="items[1]" @click="openPreview(items[1])" class="relative rounded-3xl overflow-hidden group cursor-pointer" data-aos="fade-up" data-aos-delay="100">
          <img :src="items[1].image_url" loading="lazy"
               class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
            <div class="absolute bottom-4 left-4 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition">{{ items[1].title }}</div>
        </div>

        <!-- Small Item (Index 2) -->
        <div v-if="items[2]" @click="openPreview(items[2])" class="relative rounded-3xl overflow-hidden group cursor-pointer" data-aos="fade-up" data-aos-delay="200">
          <img :src="items[2].image_url" loading="lazy"
               class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
             <div class="absolute bottom-4 left-4 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition">{{ items[2].title }}</div>
        </div>

        <!-- Wide Item (Index 3) - Link to All -->
        <div v-if="items[3]" class="col-span-2 relative rounded-3xl overflow-hidden group cursor-pointer" data-aos="fade-up" data-aos-delay="300">
          <img :src="items[3].image_url" loading="lazy"
               class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
          <div class="absolute inset-0 bg-brand-orange/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <router-link to="/galeri" class="text-white font-bold border border-white px-6 py-2 rounded-full hover:bg-white hover:text-brand-orange transition">Lihat Semua Galeri</router-link>
          </div>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-opacity" @click.self="closePreview">
            <button @click="closePreview" class="absolute top-6 right-6 text-white/70 hover:text-white text-4xl transition focus:outline-none">&times;</button>
            <div class="max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-2xl relative" @click.stop>
                <img :src="selectedImage?.image_url" loading="lazy" class="w-full h-full object-contain max-h-[85vh]">
                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                    <h3 class="text-white text-xl font-bold">{{ selectedImage?.title }}</h3>
                    <p class="text-white/80 mt-1">{{ selectedImage?.description }}</p>
                </div>
            </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';

const galleries = ref([]);
const staticGalleries = [
    { id: 'g1', title: 'Upacara Kemerdekaan RI', description: 'Upacara bendera memperingati HUT RI ke-79 di lapangan utama.', image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 'g2', title: 'Kegiatan Belajar', description: 'Suasana belajar mengajar di kelas VII.', image_url: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'g3', title: 'Ekstrakurikuler', description: 'Latihan rutin pramuka santri Al-Mawahib.', image_url: 'https://images.unsplash.com/photo-1427504746696-ea5ca7f04800?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'g4', title: 'Wisuda Santri', description: 'Prosesi wisuda angkatan ke-10.', image_url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
];

const showModal = ref(false);
const selectedImage = ref(null);

const items = computed(() => {
    return galleries.value.length > 0 ? galleries.value : staticGalleries;
});

const openPreview = (item) => {
    selectedImage.value = item;
    showModal.value = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
};

const closePreview = () => {
    showModal.value = false;
    selectedImage.value = null;
    document.body.style.overflow = ''; // Restore scrolling
};

const fetchGalleries = async () => {
    try {
        const response = await api.get('/public/galleries');
        if (response.data && response.data.length > 0) {
            galleries.value = response.data;
        }
    } catch (error) {
        console.error('Error fetching galleries:', error);
    }
};

onMounted(() => {
    fetchGalleries();
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && showModal.value) closePreview();
    });
});
</script>
