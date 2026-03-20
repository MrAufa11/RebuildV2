<template>
    <div class="pt-32 pb-24 bg-slate-50 min-h-screen">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16" data-aos="fade-up">
                <span class="text-brand-orange font-bold tracking-widest uppercase text-xs">Tenaga Pendidik</span>
                <h1 class="text-4xl lg:text-5xl font-serif font-bold text-dark mt-2">Daftar Guru & Staf Pengajar</h1>
                <p class="text-slate-500 mt-4 max-w-2xl mx-auto">Kami memiliki tenaga pengajar yang berkompeten dan berdedikasi tinggi dalam mendidik santri.</p>
            </div>

            <!-- Loading State -->
             <div v-if="loading" class="text-center py-20">
                <i class="fas fa-spinner fa-spin text-4xl text-brand-orange"></i>
                <p class="mt-4 text-slate-500">Memuat data guru...</p>
            </div>

            <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                <div v-for="(teacher, index) in teachers" :key="teacher.id" class="text-center group" data-aos="fade-up" :data-aos-delay="index * 50">
                     <div class="relative w-48 h-48 mx-auto mb-6">
                        <div class="absolute inset-0 bg-brand-orange/20 rounded-full blur-xl group-hover:blur-2xl transition duration-500"></div>
                        <img :src="teacher.image_url || 'https://via.placeholder.com/150'" loading="lazy" class="relative w-full h-full rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition duration-500">
                    </div>
                    <h3 class="text-xl font-bold text-dark group-hover:text-brand-orange transition">{{ teacher.name }}</h3>
                    <p class="text-brand-orange font-medium text-sm mb-3">{{ teacher.position }}</p>
                    <p class="text-slate-500 text-sm line-clamp-3 italic">"{{ teacher.quote || 'Berbakti untuk negeri, mengabdi untuk ilahi.' }}"</p>
                </div>
            </div>

            <div v-if="!loading && teachers.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm">
                <i class="fas fa-users-slash text-6xl text-slate-200 mb-4"></i>
                <p class="text-slate-500 font-medium">Belum ada data guru yang ditampilkan.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';

const teachers = ref([]);
const loading = ref(true);

const fetchTeachers = async () => {
    try {
        const response = await api.get('/public/teachers');
        teachers.value = response.data;
    } catch (error) {
        console.error('Error fetching teachers:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchTeachers();
});
</script>
