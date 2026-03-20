<template>
    <div class="pt-32 pb-24 bg-slate-50 min-h-screen">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-12" data-aos="fade-up">
                <span class="text-brand-orange font-bold tracking-widest uppercase text-xs">Tenaga Pendidik</span>
                <h1 class="text-4xl lg:text-5xl font-serif font-bold text-dark mt-2">Daftar Guru & Staf Pengajar</h1>
                <p class="text-slate-500 mt-4 max-w-2xl mx-auto">Kami memiliki tenaga pengajar yang berkompeten dan berdedikasi tinggi dalam mendidik santri.</p>
            </div>

            <!-- Search Filter -->
             <div class="max-w-xl mx-auto mb-16 relative" data-aos="fade-up" data-aos-delay="100">
                <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Cari guru berdasarkan nama atau jabatan..." 
                    class="w-full pl-12 pr-4 py-4 rounded-full bg-white shadow-lg shadow-brand-orange/5 border-none focus:ring-2 focus:ring-brand-orange/30 transition placeholder-slate-400 text-lg"
                >
                <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-brand-orange text-xl"></i>
            </div>

            <!-- Loading State -->
             <div v-if="loading" class="text-center py-20">
                <i class="fas fa-spinner fa-spin text-4xl text-brand-orange"></i>
                <p class="mt-4 text-slate-500">Memuat data guru...</p>
            </div>

            <!-- Teachers Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                <div v-for="(teacher, index) in filteredTeachers" :key="teacher.id" 
                     class="text-center group bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100" 
                     data-aos="fade-up" :data-aos-delay="index * 50">
                     <div class="relative w-32 h-32 mx-auto mb-6">
                        <div class="absolute inset-0 bg-brand-orange/10 rounded-full scale-110 group-hover:scale-125 transition duration-500"></div>
                        <img :src="teacher.image_url || 'https://via.placeholder.com/150'" loading="lazy" class="relative w-full h-full rounded-full object-cover border-4 border-white shadow-lg">
                    </div>
                    <h3 class="text-xl font-bold text-dark group-hover:text-brand-orange transition mb-1">{{ teacher.name }}</h3>
                    <p class="text-brand-orange font-bold text-xs tracking-wider uppercase mb-4">{{ teacher.position }}</p>
                    <div class="w-8 h-1 bg-brand-orange/20 mx-auto mb-4 rounded-full group-hover:w-16 transition-all duration-300"></div>
                    <p class="text-slate-500 text-sm italic leading-relaxed">"{{ teacher.quote || 'Berbakti untuk negeri, mengabdi untuk ilahi.' }}"</p>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="!loading && filteredTeachers.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-search text-3xl text-slate-300"></i>
                </div>
                <h3 class="text-xl font-bold text-dark mb-2">Guru tidak ditemukan</h3>
                <p class="text-slate-500 font-medium">Tidak ada guru dengan nama atau jabatan tersebut.</p>
                <button @click="searchQuery = ''" class="mt-4 text-brand-orange font-bold hover:underline">Hapus Pencarian</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../services/api';

const teachers = ref([]);
const loading = ref(true);
const searchQuery = ref('');

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

const filteredTeachers = computed(() => {
    if (!searchQuery.value) return teachers.value;
    
    const query = searchQuery.value.toLowerCase();
    return teachers.value.filter(teacher => 
        teacher.name.toLowerCase().includes(query) || 
        teacher.position.toLowerCase().includes(query)
    );
});

onMounted(() => {
    fetchTeachers();
});
</script>
