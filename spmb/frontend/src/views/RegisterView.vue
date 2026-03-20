<template>
    <div class="bg-gray-50 flex items-center justify-center min-h-screen py-8 px-4 font-sans text-slate-800">

        <div class="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

            <!-- Left Side (Brand Green) -->
            <div class="w-full md:w-1/2 bg-brand-green p-10 flex flex-col justify-between relative overflow-hidden text-white">
                
                <div class="absolute -right-10 top-1/2 -translate-y-1/2 text-[15rem] font-serif font-bold text-white opacity-5 select-none pointer-events-none leading-none">
                    26
                </div>
                <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>

                <div class="relative z-10 flex items-center gap-3 mb-8">
                    <div class="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center text-white shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span class="font-serif font-bold text-xl tracking-wide">Al-Mawahib.sch</span>
                </div>

                <div class="relative z-10 my-auto">
                    <h2 class="text-4xl lg:text-5xl font-serif font-medium leading-tight mb-6">
                        Mulai Langkah <br>
                        <span class="text-brand-orange italic">Besar</span> Anda Disini.
                    </h2>
                    <p class="text-green-100/80 font-light text-lg leading-relaxed max-w-sm">
                        Bergabunglah bersama kami di Pondok Pesantren Al-Mawahib. Membangun generasi Rabbani & Berprestasi.
                    </p>
                </div>

                <div class="relative z-10 text-xs text-green-100/50 mt-8">
                    &copy; 2026 Al-Mawahib Boarding School.
                </div>
            </div>

            <!-- Right Side (Form) -->
            <div class="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
                
                <div class="mb-8">
                    <h3 class="text-2xl font-serif font-bold text-brand-green mb-2">Buat Akun Baru</h3>
                    <p class="text-slate-500 text-sm">Silakan lengkapi data diri untuk memulai pendaftaran SPMB.</p>
                </div>

                <!-- Alert Messages -->
                <div v-if="successMessage" class="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3 animate-fade-in text-sm">
                    <i class="fas fa-check-circle text-lg"></i>
                    <div>
                        <p class="font-bold">Pendaftaran Berhasil!</p>
                        <p>{{ successMessage }}</p>
                    </div>
                </div>

                <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3 animate-fade-in text-sm">
                     <i class="fas fa-exclamation-circle text-lg"></i>
                     <p class="font-medium">{{ errorMessage }}</p>
                </div>

                <form @submit.prevent="register" class="space-y-5">
                    
                    <div>
                        <label for="fullname" class="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                        <div class="relative">
                            <input v-model="form.fullName" type="text" id="fullname" placeholder="Sesuai Ijazah" required
                                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all placeholder:text-slate-400 text-sm">
                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input v-model="form.email" type="email" id="email" placeholder="nama@email.com" required
                                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all placeholder:text-slate-400 text-sm">
                        </div>
                        <div>
                            <label for="phone" class="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp</label>
                            <input v-model="form.phone" type="tel" id="phone" placeholder="0812..." required
                                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all placeholder:text-slate-400 text-sm">
                        </div>
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                        <div class="relative">
                            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" id="password" placeholder="Minimal 6 karakter" required minlength="6"
                                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all placeholder:text-slate-400 text-sm">
                             <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none">
                                <svg v-if="!showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1.5">Ulangi Password</label>
                        <div class="relative">
                            <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" placeholder="Minimal 6 karakter" required minlength="6"
                                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all placeholder:text-slate-400 text-sm">
                             <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none">
                                <svg v-if="!showConfirmPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                 <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button type="submit" :disabled="isLoading" class="w-full py-3.5 px-4 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-0.5 focus:ring-4 focus:ring-orange-100 mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                        <span v-if="isLoading">
                            <i class="fas fa-spinner fa-spin animate-spin"></i> Memproses...
                        </span>
                        <span v-else>
                            Daftar Sekarang
                        </span>
                    </button>

                </form>

                <div class="mt-8 text-center">
                    <p class="text-sm text-slate-500">
                        Sudah mendaftar sebelumnya? 
                        <router-link to="/login" class="font-bold text-brand-green hover:underline">Masuk disini</router-link>
                    </p>
                </div>

            </div>

        </div>

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import api from '../services/api';

const form = reactive({
    fullName: '',
    email: '',
    phone: '',
    schoolOrigin: '',
    password: '',
    confirmPassword: ''
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const register = async () => {
    if (form.password !== form.confirmPassword) {
        errorMessage.value = 'Password dan Konfirmasi Password tidak cocok.';
        return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
        const response = await api.post('/spmb/register', {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            schoolOrigin: form.schoolOrigin,
            password: form.password,
            confirmPassword: form.confirmPassword
        });
        successMessage.value = response.data.message;
        // Reset form
        Object.keys(form).forEach(key => form[key] = '');
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage.value = error.response.data.message;
        } else {
            errorMessage.value = 'Terjadi kesalahan saat mendaftar. Silahkan coba lagi.';
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
