<template>
     <section class="py-24 bg-white" id="guru">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16" data-aos="fade-up">
                <span class="text-brand-orange font-bold tracking-widest uppercase text-xs">Tenaga Pendidik</span>
                <h2 class="text-4xl font-serif font-bold text-dark mt-2">Guru & Staf Pengajar</h2>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
                <div v-for="(teacher, index) in displayTeachers" :key="teacher.id" class="text-center group cursor-pointer" data-aos="fade-up" :data-aos-delay="index * 100">
                    <div class="relative w-40 h-40 mx-auto mb-6">
                        <div class="absolute inset-0 bg-brand-orange/20 rounded-full blur-xl group-hover:blur-2xl transition duration-500"></div>
                        <img :src="getImageUrl(teacher.image_url)" class="relative w-full h-full rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition duration-500">
                    </div>
                    <h3 class="text-xl font-bold text-dark group-hover:text-brand-orange transition">{{ teacher.name }}</h3>
                    <p class="text-slate-500 text-sm font-medium">{{ teacher.position }}</p>
                </div>
            </div>

            <div class="text-center mt-12" data-aos="fade-up">
                <router-link to="/staff-guru" class="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-full font-bold hover:bg-brand-orange-dark transition shadow-lg shadow-brand-orange/30">
                    Lihat Semua Guru & Staf <i class="fas fa-arrow-right"></i>
                </router-link>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/websiteApi';
import { useImageUrl } from '../composables/useImageUrl';

const teachers = ref([]);
const staticTeachers = [
    { id: 's1', name: 'Hj. Siti Aminah', position: 'Kepala Madrasah', image_url: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 's2', name: 'Ust. Ahmad Fauzi', position: 'Waka Kurikulum', image_url: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 's3', name: 'Ratna Sari, S.Pd', position: 'Guru Matematika', image_url: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: 's4', name: 'Budi Santoso, S.Kom', position: 'Guru TIK', image_url: 'https://randomuser.me/api/portraits/men/86.jpg' }
];

const displayTeachers = computed(() => {
    const list = teachers.value.length > 0 ? teachers.value : staticTeachers;
    return list.slice(0, 4);
});

const fetchTeachers = async () => {
    try {
        const response = await api.get('/teachers');
        if (response.data && response.data.length > 0) {
            teachers.value = response.data;
        }
    } catch (error) {
        console.error('Error fetching teachers:', error);
    }
};

// Image URL helper
const { getFullImageUrl } = useImageUrl();
const getImageUrl = (imageUrl) => {
    return getFullImageUrl(imageUrl) || 'https://via.placeholder.com/150';
};

onMounted(() => {
    fetchTeachers();
});
</script>
