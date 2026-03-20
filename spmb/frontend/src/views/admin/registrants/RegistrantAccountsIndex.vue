<template>
    <div class="bg-white dark:bg-darkcard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Data Leads (Akun Baru)</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Pendaftar yang baru membuat akun dan belum mengisi formulir</p>
            </div>
            <div class="flex gap-2">
                <button @click="fetchLeads" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium">
                    <i class="fas fa-sync-alt mr-1"></i> Refresh
                </button>
            </div>
        </div>

        <!-- Controls Section -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div class="flex items-center gap-3">
                <select v-model="limit" @change="changeLimit" class="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-darkcard text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm">
                    <option :value="10">10 Baris</option>
                    <option :value="25">25 Baris</option>
                    <option :value="50">50 Baris</option>
                    <option :value="100">100 Baris</option>
                </select>
                <button @click="showFilters = !showFilters" 
                    :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2', 
                    showFilters ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600']">
                    <i class="fas fa-filter"></i> Filter
                </button>
            </div>

            <div class="relative w-full md:w-72">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <i class="fas fa-search"></i>
                </span>
                <input v-model="search" @input="debounceSearch" type="text" placeholder="Cari Username/Email..." 
                    class="w-full pl-10 pr-4 py-2 bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm">
            </div>
        </div>

        <!-- Filters Panel -->
        <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform -translate-y-2 opacity-0">
            <div v-if="showFilters" class="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Status Akun</label>
                        <select v-model="filterStatus" @change="fetchLeads" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-darkcard text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-all">
                            <option value="">Semua Status</option>
                            <option value="1">Aktif</option>
                            <option value="0">Tidak Aktif</option>
                        </select>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Table Container with Fixed Scroll -->
        <div class="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            <table class="w-full text-left border-collapse font-sans">
                <thead>
                    <tr class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[11px] uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                        <th class="p-4 font-bold w-16">No</th>
                        <th class="p-4 font-bold">Informasi Akun</th>
                        <th class="p-4 font-bold">Email</th>
                        <th class="p-4 font-bold">Status</th>
                        <th class="p-4 font-bold">Terdaftar Pada</th>
                    </tr>
                </thead>
                <tbody class="text-sm text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-gray-700">
                    <tr v-if="isLoading" class="animate-pulse">
                        <td colspan="5" class="p-4 text-center text-gray-400 font-medium font-medium">Memuat data...</td>
                    </tr>
                    <tr v-else-if="leads.length === 0">
                        <td colspan="5" class="p-12 text-center text-gray-400">
                            <div class="flex flex-col items-center">
                                <i class="fas fa-user-slash text-5xl mb-4 opacity-20"></i>
                                <p class="text-lg font-medium">Belum ada data leads</p>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(item, index) in leads" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group">
                        <td class="p-4 text-gray-400 dark:text-gray-500 font-medium leading-none">{{ (page - 1) * limit + index + 1 }}</td>
                        <td class="p-4">
                            <div class="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors flex items-center gap-2">
                                <i class="fas fa-user-circle text-gray-300 group-hover:text-primary/50"></i>
                                {{ item.username }}
                            </div>
                        </td>
                        <td class="p-4">
                            <span class="text-gray-600 dark:text-gray-400">{{ item.email }}</span>
                        </td>
                        <td class="p-4">
                             <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" 
                                :class="item.isActive == 1 ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'">
                                <i :class="['fas fa-circle text-[6px] mr-1.5', item.isActive == 1 ? 'text-green-500' : 'text-red-500']"></i>
                                {{ item.isActive == 1 ? 'Aktif' : 'Nonaktif' }}
                            </span>
                        </td>
                        <td class="p-4">
                            <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                <i class="far fa-calendar-alt mr-1"></i> {{ new Date(item.createdAt).toLocaleDateString() }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <div class="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 py-4 border-t border-gray-50 dark:border-gray-700/50">
            <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Ditemukan <span class="text-gray-800 dark:text-gray-200 font-bold">{{ totalItems }}</span> akun
            </div>
            
            <div class="flex items-center gap-1">
                <button @click="prevPage" :disabled="page <= 1" 
                    class="p-2 w-9 h-9 flex items-center justify-center bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-all shadow-sm">
                    <i class="fas fa-chevron-left text-xs"></i>
                </button>

                <!-- Page Dots -->
                <div class="flex items-center gap-1 mx-2">
                    <template v-for="p in visiblePages" :key="p">
                        <button v-if="p !== '...'" 
                            @click="page = p; fetchLeads()" 
                            :class="['w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all', 
                            page === p ? 'bg-primary text-white shadow-lg shadow-primary/30 border-primary' : 'bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary']">
                            {{ p }}
                        </button>
                        <span v-else class="px-2 text-gray-400 font-bold">...</span>
                    </template>
                </div>

                <button @click="nextPage" :disabled="page >= totalPages" 
                    class="p-2 w-9 h-9 flex items-center justify-center bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-all shadow-sm">
                    <i class="fas fa-chevron-right text-xs"></i>
                </button>

                <div class="flex items-center gap-2 ml-4">
                    <span class="text-[10px] font-bold text-gray-400 uppercase">Ke:</span>
                    <input type="number" v-model.number="jumpToPage" @keyup.enter="handleJumpPage"
                        class="w-12 h-9 px-1 text-center bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../../services/api';
import Swal from 'sweetalert2';

const leads = ref([]);
const isLoading = ref(false);
const showFilters = ref(false);

const search = ref('');
const filterStatus = ref('');

const page = ref(1);
const limit = ref(10);
const totalPages = ref(1);
const totalItems = ref(0);
const jumpToPage = ref(1);

const fetchLeads = async () => {
    isLoading.value = true;
    try {
        const query = new URLSearchParams({
            page: page.value,
            limit: limit.value,
            search: search.value,
            status: filterStatus.value
        }).toString();

        const response = await api.get(`/data-leads?${query}`);
        leads.value = response.data.data;
        totalPages.value = response.data.totalPages;
        totalItems.value = response.data.total;
        jumpToPage.value = page.value;
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Gagal memuat data leads', 'error');
    } finally {
        isLoading.value = false;
    }
};

let searchDebounce = null;
const debounceSearch = () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
        page.value = 1;
        fetchLeads();
    }, 500);
};

const changeLimit = () => {
    page.value = 1;
    fetchLeads();
};

const handleJumpPage = () => {
    if (jumpToPage.value >= 1 && jumpToPage.value <= totalPages.value) {
        page.value = jumpToPage.value;
        fetchLeads();
    } else {
        jumpToPage.value = page.value;
    }
};

const prevPage = () => {
    if (page.value > 1) {
        page.value--;
        fetchLeads();
    }
};

const nextPage = () => {
    if (page.value < totalPages.value) {
        page.value++;
        fetchLeads();
    }
};

const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = page.value;
    const delta = 2; 
    const range = [];
    if (total <= 1) return [1];
    
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
            range.push(i);
        } else if (range[range.length - 1] !== '...') {
            range.push('...');
        }
    }
    return range;
});

onMounted(() => {
    fetchLeads();
});
</script>
