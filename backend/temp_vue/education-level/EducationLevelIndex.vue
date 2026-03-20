<template>
    <div class="max-w mx-auto space-y-8">
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Education Level</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Manajemen data referensi Education Level.</p>
            </div>
            
            <router-link :to="{ name: 'education-level-create' }" class="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-lg shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all shadow-brand-500/30">
                <i class="fas fa-plus mr-2"></i> Tambah Data
            </router-link>
        </div>

        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-end gap-4">
                <div class="relative w-full sm:w-64">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i class="fas fa-search text-gray-400 text-sm"></i>
                    </span>
                    <input type="text" v-model="searchQuery" placeholder="Cari data Education Level..." class="pl-9 pr-4 py-2 w-full border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 outline-none">
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Level Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Abbreviation</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quota</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="(record, index) in filteredRecords" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ index + 1 }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ record.level_name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ record.abbreviation }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ record.quota }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end gap-2">
                                    <router-link :to="{ name: 'education-level-edit', params: { id: record.id } }" class="text-brand-600 hover:text-brand-900 p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-900/20"><i class="fas fa-edit"></i></router-link>
                                    <button @click="deleteRecord(record.id)" class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"><i class="fas fa-trash-alt"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredRecords.length === 0">
                            <td colspan="100%" class="px-6 py-4 text-center text-gray-500">Belum ada data.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-t border-gray-100 dark:border-gray-700">
                <div class="text-xs text-gray-500">Total {{ filteredRecords.length }} data</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../../services/api';
import Alert from '../../../assets/alert';

const records = ref([]);
const searchQuery = ref('');

const fetchData = async () => {
    try {
        const response = await api.get('/education-level');
        records.value = response.data;
    } catch (error) {
        Alert.error('Error', 'Gagal memuat data');
    }
};

const filteredRecords = computed(() => {
    if (!searchQuery.value) return records.value;
    const q = searchQuery.value.toLowerCase();
    return records.value.filter(record => {
        return String(record.level_name).toLowerCase().includes(q) || String(record.abbreviation).toLowerCase().includes(q) || String(record.quota).toLowerCase().includes(q);
    });
});

const deleteRecord = (id) => {
    Alert.confirm('Yakin ingin menghapus?', 'Data akan dihapus permanen.').then(async (res) => {
        if (res.isConfirmed) {
            try {
                await api.delete(`/education-level/${id}`);
                Alert.success('Terhapus', 'Data berhasil dihapus');
                fetchData();
            } catch (err) {
                Alert.error('Gagal', 'Gagal menghapus data');
            }
        }
    });
};

onMounted(() => fetchData());
</script>