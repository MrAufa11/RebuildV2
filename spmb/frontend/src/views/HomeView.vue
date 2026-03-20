<template>
    <div class="bg-slate-50 text-slate-600 antialiased font-sans min-h-screen">
        
        <!-- Navigation -->
        <nav class="fixed w-full z-50 top-0 start-0 py-4 transition-all duration-300" :class="{ 'bg-brand-dark/95 backdrop-blur-md shadow-lg py-3': isScrolled }">
            <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6">
                
                <a href="#" class="flex items-center gap-2 group">
                    <div class="w-8 h-8 bg-brand-orange rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12 shadow-lg shadow-orange-500/30">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <span class="text-xl font-serif font-bold text-white tracking-wide drop-shadow-md">Al-Mawahib<span class="text-brand-orange">.sch</span></span>
                </a>

                <div class="hidden md:flex items-center gap-8 text-white/90 font-medium text-sm drop-shadow-sm">
                    <a href="#" class="hover:text-brand-orange transition relative group">
                        Beranda
                        <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#jalur" class="hover:text-brand-orange transition relative group">
                        Jalur Pendaftaran
                        <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all group-hover:w-full"></span>
                    </a>
                    <router-link to="/login" class="hover:text-brand-orange transition relative group">
                        Login Santri
                        <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all group-hover:w-full"></span>
                    </router-link>
                    <router-link to="/register" class="px-6 py-2 bg-brand-orange text-white font-bold rounded-full hover:bg-orange-600 transition shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5">
                        Daftar Sekarang
                    </router-link>
                </div>
                
                <!-- Mobile Menu Button -->
                <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-white focus:outline-none hover:text-brand-orange transition">
                     <i class="fas fa-bars text-2xl"></i>
                </button>
            </div>
            
            <!-- Mobile Menu -->
            <div v-show="mobileMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-brand-dark shadow-xl py-4 flex flex-col items-center gap-4 text-white border-t border-white/10">
                 <a href="#" @click="mobileMenuOpen = false" class="hover:text-brand-orange transition">Beranda</a>
                 <a href="#jalur" @click="mobileMenuOpen = false" class="hover:text-brand-orange transition">Jalur Pendaftaran</a>
                 <router-link to="/login" @click="mobileMenuOpen = false" class="hover:text-brand-orange transition">Login</router-link>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="hero-gradient pt-40 pb-24 px-6 text-center relative overflow-hidden min-h-[85vh] flex flex-col justify-center">
            
            <!-- Decorative Background Text -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[16rem] font-serif font-bold text-white/5 select-none pointer-events-none z-0 leading-none whitespace-nowrap">
                SPMB 2026
            </div>

            <div class="max-w-3xl mx-auto relative z-10" data-aos="fade-up">
                <span class="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm border border-white/20 shadow-sm animate-pulse">
                    Penerimaan Santri Baru
                </span>

                <h1 class="text-4xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
                    Membangun Generasi <br> <span class="text-brand-orange italic">Rabbani</span> & Berprestasi
                </h1>

                <p class="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
                    Bergabunglah bersama kami di Pondok Pesantren Al-Mawahib. Memadukan kurikulum nasional dengan nilai-nilai pesantren salafiyah modern.
                </p>

                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <router-link to="/register" class="inline-flex px-8 py-3.5 text-base font-bold text-white bg-brand-orange rounded-full hover:bg-orange-600 transition shadow-xl shadow-orange-900/20 transform hover:-translate-y-1 border border-brand-orange">
                        Daftar Online
                    </router-link>
                    <a href="#syarat" class="inline-flex px-8 py-3.5 text-base font-bold text-white bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition border border-white/30 hover:border-white/50 shadow-lg">
                        Syarat Pendaftaran
                    </a>
                </div>
            </div>

            <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group text-slate-400/80 hover:text-brand-orange transition z-20" @click="scrollToContent">
                <span class="tracking-[0.2em] uppercase text-[10px] font-bold group-hover:translate-y-1 transition text-white/70 group-hover:text-brand-orange">Scroll Down</span>
                <div class="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1 group-hover:border-brand-orange transition">
                    <div class="w-1 h-3 bg-white/50 rounded-full animate-bounce group-hover:bg-brand-orange"></div>
                </div>
            </div>
        </section>

        <!-- Info Cards Section -->
        <section class="py-16 bg-slate-50 px-6 relative z-20 -mt-20" id="jalur">
            <div class="max-w-6xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <!-- Card 1 -->
                    <div class="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/80 transform hover:-translate-y-1 transition-all duration-300 group border-b-4 border-brand-orange" data-aos="fade-up" data-aos-delay="0">
                        <div class="flex items-start justify-between mb-6">
                            <div>
                                 <h3 class="text-lg font-serif font-bold text-brand-dark">Jalur Reguler</h3>
                                 <p class="text-sm font-medium text-slate-400 mt-1">Umum</p>
                            </div>
                            <div class="p-3 bg-orange-50 text-brand-orange rounded-xl group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                <i class="fas fa-users text-xl"></i>
                            </div>
                        </div>
                        <p class="text-sm text-slate-600 leading-relaxed mb-4">Tes seleksi akademik dan wawancara santri & wali.</p>
                        <span class="text-brand-orange font-bold text-sm group-hover:underline cursor-pointer flex items-center gap-1">Lihat Detail <i class="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i></span>
                    </div>

                    <!-- Card 2 -->
                    <div class="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/80 transform hover:-translate-y-1 transition-all duration-300 group border-b-4 border-brand-dark" data-aos="fade-up" data-aos-delay="100">
                        <div class="flex items-start justify-between mb-6">
                            <div>
                                 <h3 class="text-lg font-serif font-bold text-brand-dark">Jalur Prestasi</h3>
                                 <p class="text-sm font-medium text-slate-400 mt-1">Beasiswa</p>
                            </div>
                            <div class="p-3 bg-slate-100 text-brand-dark rounded-xl group-hover:bg-brand-dark group-hover:text-white transition-colors">
                                 <i class="fas fa-trophy text-xl"></i>
                            </div>
                        </div>
                        <p class="text-sm text-slate-600 leading-relaxed mb-4">Untuk santri dengan prestasi akademik atau tahfidz minimal 5 juz.</p>
                         <span class="text-brand-dark font-bold text-sm group-hover:underline cursor-pointer flex items-center gap-1">Lihat Detail <i class="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i></span>
                    </div>

                    <!-- Card 3 -->
                    <div class="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/80 transform hover:-translate-y-1 transition-all duration-300 group border-b-4 border-blue-500" data-aos="fade-up" data-aos-delay="200">
                        <div class="flex items-start justify-between mb-6">
                            <div>
                                 <h3 class="text-lg font-serif font-bold text-brand-dark">Jalur Indent</h3>
                                 <p class="text-sm font-medium text-slate-400 mt-1">Booking</p>
                            </div>
                            <div class="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                 <i class="fas fa-bookmark text-xl"></i>
                            </div>
                        </div>
                        <p class="text-sm text-slate-600 leading-relaxed mb-4">Daftar lebih awal untuk mengamankan kuota tahun depan.</p>
                        <span class="text-blue-600 font-bold text-sm group-hover:underline cursor-pointer flex items-center gap-1">Lihat Detail <i class="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i></span>
                    </div>
                    
                    <!-- Status Card -->
                     <div class="bg-gradient-to-br from-brand-dark to-slate-800 p-8 rounded-2xl shadow-xl shadow-slate-900/20 text-white transform hover:-translate-y-1 transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
                        <div class="flex flex-col h-full justify-between">
                            <div>
                                <div class="flex items-center gap-2 mb-4">
                                    <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    <span class="text-xs font-bold uppercase tracking-wider text-green-400">Status Pendaftaran</span>
                                </div>
                                <h3 class="text-2xl font-serif font-bold mb-1">Gelombang 1</h3>
                                <p class="text-slate-400 text-sm">Dibuka s.d 20 Feb 2026</p>
                            </div>
                            <div class="mt-6">
                                <div class="w-full bg-white/10 rounded-full h-1.5 mb-2 overflow-hidden">
                                    <div class="bg-brand-orange h-1.5 rounded-full" style="width: 65%"></div>
                                </div>
                                <p class="text-xs text-slate-400 text-right">Sisa Kuota: 35%</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-brand-dark text-white py-12 px-6 mt-12 border-t border-white/5">
            <div class="max-w-7xl mx-auto text-center">
                 <h2 class="text-2xl font-serif font-bold mb-4">Pondok Pesantren Al-Mawahib</h2>
                 <p class="text-slate-400 text-sm mb-8 max-w-lg mx-auto">Mencetak generasi yang berilmu amaliah dan beramal ilmiah berlandaskan Al-Qur'an dan As-Sunnah.</p>
                 <div class="flex justify-center gap-6 text-slate-400 mb-8">
                     <a href="#" class="hover:text-brand-orange transition scale-110"><i class="fab fa-facebook"></i></a>
                     <a href="#" class="hover:text-brand-orange transition scale-110"><i class="fab fa-instagram"></i></a>
                     <a href="#" class="hover:text-brand-orange transition scale-110"><i class="fab fa-youtube"></i></a>
                 </div>
                 <p class="text-xs text-slate-600">&copy; 2026 Al-Mawahib.sch. All rights reserved. SPMB System v2.0</p>
            </div>
        </footer>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AOS from 'aos';
import 'aos/dist/aos.css';

const isScrolled = ref(false);
const mobileMenuOpen = ref(false);

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
};

const scrollToContent = () => {
    const el = document.getElementById('jalur');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });
});
</script>

<style scoped>
/* Gradient matching brand colors */
.hero-gradient {
    /* Using brand-dark (#022c22) and lighter variant */
    background: linear-gradient(180deg, #022c22 0%, #115e59 70%, #f1f5f9 100%);
    /* Fallback/Alternative: more gentle green */
    /* background: linear-gradient(180deg, #0f172a 0%, #059669 80%, #f8fafc 100%); */
}
</style>
