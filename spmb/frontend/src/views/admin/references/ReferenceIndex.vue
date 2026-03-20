<template>
    <div class="max-w mx-auto space-y-8">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white capitalize">Referensi {{ formatLabel(tableName) }}</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Kelola data untuk tabel master ini.</p>
            </div>
            
            <router-link :to="{ name: 'reference-create', params: { table: tableName } }" class="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-lg shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all shadow-brand-500/30 cursor-pointer">
                <i class="fas fa-plus mr-2"></i> Tambah Data
            </router-link>
        </div>

        <div v-if="loading" class="flex justify-center py-10">
            <i class="fas fa-spinner fa-spin text-4xl text-brand-600"></i>
        </div>

        <!-- Data Table -->
        <div v-else class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="font-bold text-lg text-gray-900 dark:text-white">Daftar {{ formatLabel(tableName) }}</h3>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <i class="fas fa-search text-gray-400 text-sm"></i>
                        </span>
                        <input type="text" v-model="searchQuery" placeholder="Cari data..." class="pl-9 pr-4 py-2 w-full sm:w-64 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all">
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th v-for="col in displayColumns" :key="col.Field" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {{ formatLabel(col.Field) }}
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="record in filteredRecords" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td v-for="col in displayColumns" :key="col.Field" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {{ record[col.Field] }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex items-center justify-end gap-2">
                                    <router-link :to="{ name: 'reference-edit', params: { table: tableName, id: record.id } }" class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors cursor-pointer" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </router-link>
                                    <button @click="deleteRecord(record.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer" title="Delete">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredRecords.length === 0">
                            <td :colspan="displayColumns.length + 1" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                Belum ada data atau tidak ditemukan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">Menampilkan {{ filteredRecords.length }} data</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';
import Alert from '../../../assets/alert';

const route = useRoute();
const router = useRouter();
const tableName = ref(route.params.table);

const columns = ref([]);
const records = ref([]);
const loading = ref(true);
const searchQuery = ref('');

const IGNORED_COLUMNS = ['created_at', 'updated_at'];

const displayColumns = computed(() => {
    return columns.value.filter(c => !IGNORED_COLUMNS.includes(c.Field));
});

const formatLabel = (str) => {
    if (!str) return '';
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const fetchData = async () => {
    loading.value = true;
    try {
        const response = await api.get(`/references/${tableName.value}`);
        columns.value = response.data.columns; 
        records.value = response.data.records;
    } catch (error) {
        console.error('Error fetching table data:', error);
        Alert.error('Gagal', 'Gagal memuat data master ini.');
    } finally {
        loading.value = false;
    }
};

const filteredRecords = computed(() => {
    if (!searchQuery.value) return records.value;
    const q = searchQuery.value.toLowerCase();
    return records.value.filter(record => {
        // Search through all stringifiable fields
        return displayColumns.value.some(col => {
            const val = record[col.Field];
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(q);
        });
    });
});

const deleteRecord = (id) => {
    Alert.confirm('Yakin ingin menghapus?', 'Data ini akan dihapus secara permanen.')
        .then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/references/${tableName.value}/${id}`);
                    Alert.success('Terhapus!', 'Data berhasil dihapus.');
                    fetchData();
                } catch (error) {
                    console.error('Error deleteing:', error);
                    Alert.error('Gagal', 'Terjadi kesalahan saat menghapus data.');
                }
            }
        });
};

watch(() => route.params.table, (newTable) => {
    if (newTable) {
        tableName.value = newTable;
        searchQuery.value = '';
        fetchData();
    }
});

onMounted(() => {
    fetchData();
});
</script>
