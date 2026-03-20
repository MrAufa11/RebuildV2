<template>
    <div class="bg-gray-50 flex items-center justify-center min-h-screen py-8 px-4 font-sans text-slate-800">

        <div class="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

            <!-- Left Side (Brand Green) -->
            <div class="w-full md:w-1/2 bg-brand-green p-10 flex flex-col justify-between relative overflow-hidden text-white">
                
                <div class="absolute -left-10 -top-10 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
                <div class="absolute -right-10 bottom-0 w-80 h-80 rounded-full bg-brand-orange opacity-10 blur-3xl"></div>
                
                <div class="relative z-10 flex items-center gap-3 mb-8">
                    <div class="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span class="font-serif font-bold text-xl tracking-wide">Al-Mawahib.sch</span>
                </div>

                <div class="relative z-10 my-auto">
                    <h2 class="text-4xl lg:text-5xl font-serif font-medium leading-tight mb-4">
                        Ahlan Wa Sahlan.
                    </h2>
                    <p class="text-green-100/80 font-light text-lg leading-relaxed max-w-sm">
                        "Menuntut ilmu adalah takwa. Menyampaikan ilmu adalah ibadah. Mengulang-ulang ilmu adalah zikir."
                    </p>
                    <div class="mt-4 h-1 w-20 bg-brand-orange rounded-full"></div>
                </div>

                <div class="relative z-10 text-xs text-green-100/50 mt-8 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    Portal Resmi SPMB Online
                </div>
            </div>

            <!-- Right Side (Form) -->
            <div class="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
                
                <div class="mb-10">
                    <h3 class="text-3xl font-serif font-bold text-brand-green mb-2">Masuk Akun</h3>
                    <p class="text-slate-500 text-sm">Lanjutkan proses pendaftaran atau cek status kelulusan Anda.</p>
                </div>

                <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3 animate-fade-in text-sm">
                     <i class="fas fa-exclamation-circle text-lg"></i>
                     <p class="font-medium">{{ errorMessage }}</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    
                    <div>
                        <label for="identity" class="block text-sm font-medium text-slate-700 mb-2">Email atau Username</label>
                        <div class="relative">
                            <input v-model="form.username" type="text" id="identity" placeholder="Contoh: santri@email.com" required
                                class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all placeholder:text-slate-400 text-sm font-medium text-brand-green">
                            <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
                            <a href="#" class="text-xs font-semibold text-brand-orange hover:text-brand-orangeHover hover:underline">Lupa Password?</a>
                        </div>
                        <div class="relative">
                            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" id="password" placeholder="Masukkan password Anda" required
                                class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all placeholder:text-slate-400 text-sm font-medium text-brand-green">
                            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-brand-green cursor-pointer transition-colors focus:outline-none">
                                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded cursor-pointer">
                        <label for="remember-me" class="ml-2 block text-sm text-slate-600 cursor-pointer select-none">Ingat saya di perangkat ini</label>
                    </div>

                    <button type="submit" :disabled="isLoading" class="w-full py-4 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-base rounded-xl shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-0.5 focus:ring-4 focus:ring-orange-100 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                        <span v-if="isLoading">
                            <i class="fas fa-spinner fa-spin animate-spin"></i> Memproses...
                        </span>
                        <span v-else>
                            Masuk Sekarang
                        </span>
                    </button>

                </form>

                <div class="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p class="text-sm text-slate-500">
                        Belum punya akun pendaftaran? 
                        <router-link to="/register" class="font-bold text-brand-green hover:underline">Daftar Santri Baru</router-link>
                    </p>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const form = reactive({
    username: '',
    password: ''
});

const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
        const response = await api.post('/auth/login', {
            username: form.username,
            password: form.password,
            app_type: 'spmb',
            login_type: 'student'
        });

        const { accessToken, user } = response.data;
        
        // Save user info to localStorage for non-sensitive data display
        localStorage.setItem('studentUser', JSON.stringify(user));

        // Redirect to dashboard
        router.push('/dashboard');
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage.value = error.response.data.message;
        } else {
            errorMessage.value = 'Gagal masuk. Periksa kembali email dan password Anda.';
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:ital,wght@0,500;0,600;0,700;1,500&display=swap');

/* Fallback if Tailwind config not loaded */
.font-sans { font-family: 'Inter', sans-serif; }
.font-serif { font-family: 'Lora', serif; }
</style>
