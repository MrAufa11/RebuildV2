<template>
  <section class="py-24 bg-slate-50/50" id="berita">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex justify-between items-end mb-16" data-aos="fade-up">
        <div>
          <h2 class="text-3xl font-serif font-bold text-dark">Kabar Al-Mawahib</h2>
          <div class="h-1 w-20 bg-brand-orange mt-4 rounded-full"></div>
        </div>
        <router-link to="/news" class="hidden md:flex items-center gap-2 text-slate-500 hover:text-brand-orange transition font-medium">
          Lihat Arsip Berita <i class="fas fa-external-link-alt text-xs"></i>
        </router-link>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
        <article v-for="(article, index) in displayArticles" :key="article.id" class="group cursor-pointer" data-aos="fade-up" :data-aos-delay="index * 100">
          <router-link :to="article.slug ? `/news/${article.slug}` : '#'">
            <div class="overflow-hidden rounded-[1.5rem] mb-6 relative">
              <img :src="article.image_url" 
                   class="w-full h-72 object-cover transform group-hover:scale-105 transition duration-700 ease-out">
              <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-orange uppercase tracking-wide shadow-sm">
                  {{ article.category }}
              </div>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-dark mb-3 group-hover:text-brand-orange transition leading-snug">{{ article.title }}</h3>
              <p class="text-slate-500 line-clamp-2 mb-4">{{ article.excerpt }}</p>
              <span class="text-sm text-slate-400 font-medium">{{ formatDate(article.published_at) }}</span>
            </div>
          </router-link>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';

const articles = ref([]);
const staticArticles = [
    {
        id: 'a1',
        title: 'Tim Robotik Raih Emas di Kompetisi Nasional',
        slug: 'tim-robotik-raih-emas',
        excerpt: 'Inovasi teknologi pertanian berbasis IoT karya santri Al-Mawahib berhasil memukau juri.',
        image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'Prestasi',
        published_at: '2026-01-20'
    },
    {
        id: 'a2',
        title: 'Peringatan Maulid Nabi: Meneladani Akhlak Rasulullah',
        slug: 'peringatan-maulid-nabi',
        excerpt: 'Ribuan santri dan wali murid hadir dalam pengajian akbar yang penuh khidmat.',
        image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'Kegiatan',
        published_at: '2026-01-18'
    },
    {
        id: 'a3',
        title: "Pentingnya Adab Sebelum Ilmu dalam Islam",
        slug: 'pentingnya-adab-sebelum-ilmu',
        excerpt: "Kajian rutin kitab Ta'lim Muta'allim bersama KH. Abdullah Gymnastiar.",
        image_url: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'Kajian',
        published_at: '2026-01-15'
    }
];

const displayArticles = computed(() => {
    const list = articles.value.length > 0 ? articles.value : staticArticles;
    return list.slice(0, 3);
});

const fetchArticles = async () => {
    try {
        const response = await api.get('/public/articles');
        if (response.data && response.data.length > 0) {
            articles.value = response.data.map(item => ({
                ...item,
                category: item.category ? item.category.name : 'Berita'
            }));
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
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
