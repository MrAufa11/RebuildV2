<template>
    <div class="bg-[#F8F9FC] dark:bg-darkbg text-gray-800 dark:text-gray-200 h-screen w-full flex items-center justify-center relative overflow-hidden transition-colors duration-300">

        <div class="absolute top-0 -left-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:opacity-10 dark:mix-blend-normal"></div>
        <div class="absolute bottom-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:opacity-10 dark:mix-blend-normal" style="animation-delay: 2s;"></div>

        <button @click="toggleTheme" class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white dark:bg-darkcard rounded-full shadow-md text-gray-400 hover:text-yellow-500 transition-colors z-20 border border-gray-100 dark:border-gray-700 cursor-pointer">
            <i class="fas fa-sun theme-icon-sun"></i>
            <i class="fas fa-moon theme-icon-moon"></i>
        </button>

        <div class="bg-white dark:bg-darkcard p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700 relative z-10 transition-colors duration-300">
            
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center h-12 w-12 bg-brand-600 rounded-xl text-white text-xl shadow-lg shadow-brand-500/30 mb-4">
                    <i class="fas fa-bolt"></i>
                </div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Admin SPMB</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Please enter your details to sign in.</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">
                
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <i class="far fa-envelope"></i>
                        </span>
                        <input v-model="form.username" type="text" id="username" class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all shadow-sm" placeholder="Enter your Username" required>
                    </div>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <i class="fas fa-lock text-xs"></i>
                        </span>
                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'" id="password" class="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all shadow-sm" placeholder="Enter your password" required>
                        
                        <button type="button" @click="togglePassword" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none transition-colors cursor-pointer">
                            <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
                        </button>
                    </div>
                </div>


                <button type="submit" :disabled="isLoading" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all shadow-brand-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    <span v-if="isLoading">Signing in...</span>
                    <span v-else>Sign in</span>
                </button>
                <div v-if="errorMessage" class="text-sm text-red-600 text-center mt-2">
                    {{ errorMessage }}
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
// Assuming you have an alert asset. If not, it falls back gracefully or you can remove Alert calls.
// Since spmb/frontend might not have Alert properly mapped, we'll keep errorMessage handling like before,
// but with the aesthetic UI.

const router = useRouter();

const form = reactive({
    username: '',
    password: ''
});
const showPassword = ref(false);

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
};

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
            login_type: 'admin'
        });
        
        const { accessToken, user } = response.data;
        
        // Save user to localStorage for profile display logic
        if (user) {
            localStorage.setItem('adminUser', JSON.stringify(user));
        }

        router.push('/admin');
    } catch (error) {
        console.error('Login error:', error);
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage.value = error.response.data.message;
        } else {
            errorMessage.value = 'Login failed. Please check your credentials.';
        }
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    const html = document.documentElement;
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
});
</script>

<style scoped>
/* Blob classes since tailwind config in spmb might not have these custom classes */
.animate-blob {
    animation: blob 7s infinite;
}
.animation-delay-2000 {
    animation-delay: 2s;
}
@keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
}
</style>
