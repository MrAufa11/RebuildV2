<template>
    <div class="bg-white dark:bg-darkcard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Data Pendaftar SPMB</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Kelola data calon santri baru</p>
            </div>
            <div class="flex gap-2">
                <button @click="fetchRegistrants" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium">
                    <i class="fas fa-sync-alt mr-1"></i> Refresh
                </button>
            </div>
        </div>

        <!-- Controls Section -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div class="flex items-center gap-3">
                <select v-model="limit" @change="changeLimit" class="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-darkcard text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <option :value="10">10 Baris</option>
                    <option :value="25">25 Baris</option>
                    <option :value="50">50 Baris</option>
                    <option :value="100">100 Baris</option>
                </select>
                <button @click="showFilters = !showFilters" 
                    :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2', 
                    showFilters ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600']">
                    <i class="fas fa-filter"></i> Filter
                    <span v-if="activeFiltersCount > 0" class="flex items-center justify-center w-5 h-5 bg-white text-primary rounded-full text-[10px] font-bold">
                        {{ activeFiltersCount }}
                    </span>
                </button>
            </div>

            <div class="relative w-full md:w-72">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <i class="fas fa-search"></i>
                </span>
                <input v-model="search" @input="debounceSearch" type="text" placeholder="Cari Nama/WA/Email..." 
                    class="w-full pl-10 pr-4 py-2 bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm">
            </div>
        </div>

        <!-- Advanced Filters Panel -->
        <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform -translate-y-2 opacity-0">
            <div v-if="showFilters" class="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Status Seleksi</label>
                        <select v-model="filterStatus" @change="fetchRegistrants" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-darkcard text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                            <option value="">Semua Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Diterima</option>
                            <option value="Graduated">Lulus</option>
                            <option value="Rejected">Ditolak</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Gelombang</label>
                        <select v-model="filterWave" @change="fetchRegistrants" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-darkcard text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                            <option value="">Semua Gelombang</option>
                            <option value="1">Gelombang 1</option>
                            <option value="2">Gelombang 2</option>
                            <option value="3">Gelombang 3</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Jalur Pendaftaran</label>
                        <select v-model="filterEntryPath" @change="fetchRegistrants" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-darkcard text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                            <option value="">Semua Jalur</option>
                            <option value="Reguler">Reguler</option>
                            <option value="Prestasi">Prestasi</option>
                            <option value="Indent">Indent</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button @click="resetFilters" class="text-sm text-red-500 hover:text-red-600 font-medium px-2 py-2 flex items-center gap-1 transition-colors">
                            <i class="fas fa-undo-alt text-xs"></i> Reset Filter
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Active Search/Filter Information -->
        <div v-if="activeFiltersCount > 0 || search" class="mb-6 flex flex-wrap items-center gap-2">
            <span v-if="search" class="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
                Cari: "{{ search }}" <button @click="search = ''; fetchRegistrants()" class="ml-2 hover:text-primary-focus"><i class="fas fa-times"></i></button>
            </span>
            <span v-if="filterStatus" class="inline-flex items-center px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium border border-secondary/20">
                Status: {{ filterStatus }} <button @click="filterStatus = ''; fetchRegistrants()" class="ml-2 hover:text-secondary-focus"><i class="fas fa-times"></i></button>
            </span>
            <span v-if="filterWave" class="inline-flex items-center px-3 py-1 bg-yellow-400/10 text-yellow-600 rounded-full text-xs font-medium border border-yellow-400/20">
                Gelombang: {{ filterWave }} <button @click="filterWave = ''; fetchRegistrants()" class="ml-2 hover:text-yellow-700"><i class="fas fa-times"></i></button>
            </span>
        </div>

        <!-- Table Container with Fixed Scroll -->
        <div class="overflow-x-auto max-h-[calc(100vh-420px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                        <th class="p-4 font-bold">No</th>
                        <th class="p-4 font-bold">Nama Lengkap</th>
                        <th class="p-4 font-bold">Jalur</th>
                        <th class="p-4 font-bold">Asal Sekolah</th>
                        <th class="p-4 font-bold">Kontak</th>
                        <th class="p-4 font-bold">Dokumen & Pembayaran</th>
                        <th class="p-4 font-bold">Status</th>
                        <th class="p-4 font-bold text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="text-sm text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-gray-700">
                    <tr v-if="isLoading" class="animate-pulse">
                        <td colspan="7" class="p-4 text-center text-gray-400">Memuat data...</td>
                    </tr>
                    <tr v-else-if="filteredRegistrants.length === 0">
                        <td colspan="7" class="p-8 text-center text-gray-400">
                            <i class="fas fa-inbox text-4xl mb-2 block"></i>
                            Belum ada pendaftar
                        </td>
                    </tr>
                    <tr v-for="(item, index) in filteredRegistrants" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                        <td class="p-4 text-gray-400 dark:text-gray-500">{{ (page - 1) * limit + index + 1 }}</td>
                        <td class="p-4 font-medium text-gray-900 dark:text-gray-100">{{ item.fullName }}</td>
                        <td class="p-4">
                            <span class="inline-block px-2 py-1 rounded text-xs font-bold"
                                :class="{
                                    'bg-blue-100 text-blue-700': item.entryPath === 'Reguler',
                                    'bg-purple-100 text-purple-700': item.entryPath === 'Prestasi',
                                    'bg-yellow-100 text-yellow-700': item.entryPath === 'Indent'
                                }">
                                {{ item.entryPath || 'Reguler' }}
                            </span>
                        </td>
                        <td class="p-4">{{ item.schoolOrigin }}</td>
                        <td class="p-4">
                            <div class="flex flex-col gap-1">
                                <span class="text-xs text-gray-500 dark:text-gray-400"><i class="fas fa-envelope mr-1"></i> {{ item.email }}</span>
                                <span class="text-xs text-gray-500 dark:text-gray-400"><i class="fas fa-phone mr-1"></i> {{ item.phone }}</span>
                            </div>
                        </td>
                        <td class="p-4 text-xs">
                            <div class="mb-1">
                                <span class="font-bold">Doc:</span>
                                <a v-if="item.documentUrl" :href="item.documentUrl" target="_blank" class="text-blue-500 underline ml-1">Lihat</a>
                                <span v-else class="text-red-500 ml-1">Belum</span>
                            </div>
                            <div>
                                <span class="font-bold">Bayar:</span>
                                <span v-if="item.paymentStatus === 'Verified'" class="text-green-600 dark:text-green-400 ml-1">Terverifikasi</span>
                                <template v-else-if="item.paymentProof">
                                    <a :href="item.paymentProof" target="_blank" class="text-blue-500 dark:text-blue-400 underline ml-1">Bukti</a>
                                    <button @click="verifyPayment(item.id)" class="ml-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold">Verif?</button>
                                </template>
                                <span v-else class="text-red-500 dark:text-red-400 ml-1">Belum</span>
                            </div>
                            <div v-if="item.nisn" class="mt-1 font-bold text-blue-800 dark:text-blue-300">
                                NISN: {{ item.nisn }}
                            </div>
                        </td>
                        <td class="p-4">
                            <span class="px-2 py-1 rounded-full text-[10px] font-bold capitalize tracking-wider"
                                :class="{
                                    'bg-yellow-100 text-yellow-800 border border-yellow-200': item.status === 'Pending',
                                    'bg-blue-100 text-blue-800 border border-blue-200': item.status === 'Approved',
                                    'bg-indigo-100 text-indigo-800 border border-indigo-200': item.status === 'Exam',
                                    'bg-green-100 text-green-800 border border-green-200': item.status === 'Graduated',
                                    'bg-brand-100 text-brand-800 border border-brand-200': item.status === 'Re-registered',
                                    'bg-red-100 text-red-800 border border-red-200': item.status === 'Rejected'
                                }">
                                <i v-if="item.status === 'Graduated'" class="fas fa-check-circle mr-1"></i>
                                {{ 
                                    item.status === 'Approved' ? 'Diterima' : 
                                    item.status === 'Exam' ? 'Ikut Ujian' :
                                    item.status === 'Graduated' ? 'Lulus' :
                                    item.status === 'Re-registered' ? 'Daftar Ulang' :
                                    item.status === 'Rejected' ? 'Ditolak' : 'Menunggu' 
                                }}
                            </span>
                        </td>
                        <td class="p-4 text-center">
                            <div class="flex justify-center flex-wrap gap-2">
                                <a v-if="item.documentUrl" :href="item.documentUrl" target="_blank" 
                                    class="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition" 
                                    title="Lihat Dokumen">
                                    <i class="fas fa-file-alt"></i>
                                </a>
                                <a v-if="item.paymentProof" :href="item.paymentProof" target="_blank" 
                                    class="w-8 h-8 flex items-center justify-center bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition" 
                                    title="Bukti Pembayaran">
                                    <i class="fas fa-receipt"></i>
                                </a>
                                
                                <!-- Workflow Actions -->
                                <button v-if="item.status === 'Pending'" @click="updateStatus(item.id, 'Approved')" 
                                    class="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-focus transition text-xs font-bold">
                                    Approve
                                </button>
                                <button v-if="item.status === 'Approved'" @click="updateStatus(item.id, 'Exam')" 
                                    class="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs font-bold">
                                    Ikut Ujian
                                </button>
                                <button v-if="item.status === 'Exam'" @click="updateStatus(item.id, 'Graduated')" 
                                    class="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs font-bold">
                                    Luluskan
                                </button>
                                <button v-if="item.status === 'Graduated'" @click="updateStatus(item.id, 'Re-registered')" 
                                    class="px-3 py-1 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition text-xs font-bold">
                                    Daftar Ulang
                                </button>
                                
                                <div class="relative group">
                                    <button class="w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-lg hover:text-gray-600">
                                        <i class="fas fa-ellipsis-v"></i>
                                    </button>
                                    <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-darkcard border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                        <div class="p-2">
                                            <button v-if="item.status === 'Pending'" @click="updateStatus(item.id, 'Rejected')" class="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2">
                                                <i class="fas fa-times"></i> Tolak Pendaftaran
                                            </button>
                                            <button @click="deleteRegistrant(item.id)" class="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                                                <i class="fas fa-trash-alt"></i> Hapus Permanen
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <div class="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 py-4 border-t border-gray-50 dark:border-gray-700/50">
            <div class="text-sm text-gray-500 dark:text-gray-400">
                Menampilkan <span class="font-bold text-gray-800 dark:text-gray-200">{{ registrants.length }}</span> data dari <span class="font-bold text-gray-800 dark:text-gray-200">{{ totalItems }}</span> total
            </div>
            
            <div class="flex items-center gap-1">
                <!-- Previous Button -->
                <button @click="prevPage" :disabled="page <= 1" 
                    class="p-2 w-9 h-9 flex items-center justify-center bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <i class="fas fa-chevron-left text-xs"></i>
                </button>

                <!-- Page Numbers -->
                <div class="flex items-center gap-1 mx-2">
                    <template v-for="p in visiblePages" :key="p">
                        <button v-if="p !== '...'" 
                            @click="page = p; fetchRegistrants()" 
                            :class="['w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all', 
                            page === p ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary']">
                            {{ p }}
                        </button>
                        <span v-else class="px-2 text-gray-400">...</span>
                    </template>
                </div>

                <!-- Next Button -->
                <button @click="nextPage" :disabled="page >= totalPages" 
                    class="p-2 w-9 h-9 flex items-center justify-center bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <i class="fas fa-chevron-right text-xs"></i>
                </button>

                <!-- Go To Page (Optional functionality but requested style in image) -->
                <div class="flex items-center gap-2 ml-4">
                    <span class="text-xs text-gray-400">Ke:</span>
                    <input type="number" v-model.number="jumpToPage" @keyup.enter="handleJumpPage"
                        class="w-12 h-9 px-1 text-center bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition-all">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../../services/api';
import Swal from 'sweetalert2';

const registrants = ref([]);
const isLoading = ref(false);
const showFilters = ref(false);

const filterStatus = ref('');
const filterWave = ref('');
const filterEntryPath = ref('');
const search = ref('');

const page = ref(1);
const limit = ref(10);
const totalPages = ref(1);
const totalItems = ref(0);
const jumpToPage = ref(1);

const activeFiltersCount = computed(() => {
    let count = 0;
    if (filterStatus.value) count++;
    if (filterWave.value) count++;
    if (filterEntryPath.value) count++;
    return count;
});

const fetchRegistrants = async () => {
    isLoading.value = true;
    try {
        const query = new URLSearchParams({
            page: page.value,
            limit: limit.value,
            search: search.value,
            status: filterStatus.value,
            wave: filterWave.value,
            entryPath: filterEntryPath.value
        }).toString();
        
        const response = await api.get(`/spmb?${query}`);
        registrants.value = response.data.data;
        totalPages.value = response.data.totalPages;
        totalItems.value = response.data.total;
        jumpToPage.value = page.value;
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Gagal memuat data pendaftar', 'error');
    } finally {
        isLoading.value = false;
    }
};

let searchDebounce = null;
const debounceSearch = () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
        page.value = 1;
        fetchRegistrants();
    }, 500);
};

const resetFilters = () => {
    filterStatus.value = '';
    filterWave.value = '';
    filterEntryPath.value = '';
    search.value = '';
    page.value = 1;
    fetchRegistrants();
};

const changeLimit = () => {
    page.value = 1;
    fetchRegistrants();
};

const handleJumpPage = () => {
    if (jumpToPage.value >= 1 && jumpToPage.value <= totalPages.value) {
        page.value = jumpToPage.value;
        fetchRegistrants();
    } else {
        jumpToPage.value = page.value;
    }
};

const prevPage = () => {
    if (page.value > 1) {
        page.value--;
        fetchRegistrants();
    }
};

const nextPage = () => {
    if (page.value < totalPages.value) {
        page.value++;
        fetchRegistrants();
    }
};

// Advanced pagination visible pages logic
const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = page.value;
    const delta = 2; // Pages to show around current
    const range = [];
    
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
            range.push(i);
        } else if (range[range.length - 1] !== '...') {
            range.push('...');
        }
    }
    return range;
});

const filteredRegistrants = computed(() => {
    // Backend already filters by status/search, but we can do extra safety check here if needed
    return registrants.value;
});

const updateStatus = async (id, status) => {
    try {
        let title = 'Proses Pendaftaran?';
        let confirmText = 'Ya, Lanjutkan';
        let confirmColor = '#3B82F6';
        
        if (status === 'Approved') {
            title = 'Approve Pendaftaran?';
            confirmText = 'Ya, Approve';
            confirmColor = '#10B981';
        } else if (status === 'Exam') {
            title = 'Panggil Ujian?';
            confirmText = 'Ya, Set Ujian';
            confirmColor = '#4F46E5';
        } else if (status === 'Graduated') {
            title = 'Luluskan Calon Santri?';
            confirmText = 'Ya, Luluskan';
            confirmColor = '#059669';
        } else if (status === 'Re-registered') {
            title = 'Selesaikan Daftar Ulang?';
            confirmText = 'Ya, Selesai';
            confirmColor = '#7C3AED';
        } else if (status === 'Rejected') {
            title = 'Tolak Pendaftaran?';
            confirmText = 'Ya, Tolak';
            confirmColor = '#EF4444';
        }

        const result = await Swal.fire({
            title: title,
            text: `Status pendaftaran akan diubah menjadi ${status}.`,
            icon: status === 'Rejected' ? 'warning' : 'question',
            showCancelButton: true,
            confirmButtonColor: confirmColor,
            confirmButtonText: confirmText
        });

        if (result.isConfirmed) {
            await api.put(`/spmb/${id}/status`, { status });
            Swal.fire('Berhasil', 'Status pendaftaran diperbarui', 'success');
            fetchRegistrants();
        }
    } catch (error) {
        Swal.fire('Error', 'Gagal memperbarui status', 'error');
    }
};

const verifyPayment = async (id) => {
    try {
        const result = await Swal.fire({
            title: 'Verifikasi Pembayaran?',
            text: "Pembayaran akan ditandai lunas dan calon siswa dapat mencetak kartu ujian.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            confirmButtonText: 'Ya, Verifikasi'
        });

        if (result.isConfirmed) {
            await api.put(`/spmb/${id}`, { paymentStatus: 'Verified' });
            Swal.fire('Berhasil', 'Pembayaran terverifikasi', 'success');
            fetchRegistrants();
        }
    } catch (error) {
        Swal.fire('Error', 'Gagal memverifikasi pembayaran', 'error');
    }
};

const deleteRegistrant = async (id) => {
    try {
        const result = await Swal.fire({
            title: 'Hapus Data?',
            text: "Data pendaftar akan dihapus permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus'
        });

        if (result.isConfirmed) {
            await api.delete(`/spmb/${id}`);
            Swal.fire('Terhapus', 'Data berhasil dihapus', 'success');
            fetchRegistrants();
        }
    } catch (error) {
        Swal.fire('Error', 'Gagal menghapus data', 'error');
    }
};

onMounted(() => {
    fetchRegistrants();
});
</script>
