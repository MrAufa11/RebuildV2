<template>
    <div class="max-w mx-auto space-y-8">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <router-link :to="{ name: 'reference-index', params: { table: tableName } }" class="text-gray-500 hover:text-brand-600 transition-colors">
                    <i class="fas fa-arrow-left text-xl"></i>
                </router-link>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                        {{ isEditing ? 'Edit' : 'Tambah' }} {{ formatLabel(tableName) }}
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Isi form di bawah untuk menyimpan data.
                    </p>
                </div>
            </div>
            
            <div class="flex gap-3">
                <router-link :to="{ name: 'reference-index', params: { table: tableName } }" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-darkcard hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors cursor-pointer">
                    Batal
                </router-link>
                <button @click="submitForm" :disabled="submitting || loading" class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all shadow-brand-500/30 cursor-pointer disabled:opacity-50">
                    <span v-if="submitting">Menyimpan...</span>
                    <span v-else>Simpan</span>
                </button>
            </div>
        </div>

        <div v-if="loading" class="flex justify-center py-10">
            <i class="fas fa-spinner fa-spin text-4xl text-brand-600"></i>
        </div>

        <!-- Form Card -->
        <div v-else class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="p-6 sm:p-8">
                <form @submit.prevent="submitForm" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div v-for="col in formColumns" :key="col.Field" class="space-y-1">
                            <label :for="col.Field" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {{ formatLabel(col.Field) }} <span v-if="col.Null === 'NO'" class="text-red-500">*</span>
                            </label>
                            
                            <textarea 
                                v-if="col.Type.includes('text')" 
                                :id="col.Field" 
                                v-model="formData[col.Field]" 
                                :required="col.Null === 'NO'"
                                class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white resize-y"
                                rows="3"
                            ></textarea>
                            
                            <input 
                                v-else-if="col.Type.includes('date')" 
                                type="date"
                                :id="col.Field" 
                                v-model="formData[col.Field]" 
                                :required="col.Null === 'NO'"
                                class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                            >

                            <input 
                                v-else-if="col.Type.includes('time')" 
                                type="time"
                                :id="col.Field" 
                                v-model="formData[col.Field]" 
                                :required="col.Null === 'NO'"
                                class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                            >
                            
                            <select 
                                v-else-if="col.Type.includes('enum')"
                                :id="col.Field" 
                                v-model="formData[col.Field]" 
                                :required="col.Null === 'NO'"
                                class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                            >
                                <option value="" disabled>-- Pilih {{ formatLabel(col.Field) }} --</option>
                                <option v-for="opt in extractEnum(col.Type)" :key="opt" :value="opt">{{ opt }}</option>
                            </select>
                            
                            <input 
                                v-else-if="col.Type.includes('int') || col.Type.includes('decimal') || col.Type.includes('float')" 
                                type="number"
                                :id="col.Field" 
                                v-model="formData[col.Field]" 
                                :required="col.Null === 'NO'"
                                class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                            >

                            <input 
                                v-else 
                                type="text"
                                :id="col.Field" 
                                v-model="formData[col.Field]" 
                                :required="col.Null === 'NO'"
                                class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                            >
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';
import Alert from '../../../assets/alert';

const route = useRoute();
const router = useRouter();
const tableName = ref(route.params.table);
const recordId = ref(route.params.id || null);

const isEditing = computed(() => !!recordId.value);
const columns = ref([]);
const formData = ref({});
const loading = ref(true);
const submitting = ref(false);

const IGNORED_COLUMNS = ['created_at', 'updated_at'];

const formColumns = computed(() => {
    return columns.value.filter(c => c.Extra !== 'auto_increment' && c.Field !== 'id' && !IGNORED_COLUMNS.includes(c.Field));
});

const formatLabel = (str) => {
    if (!str) return '';
    return str.split('_').map(word => {
        // Leave words like 'id' alone or uppercase them properly
        if (word.toLowerCase() === 'id') return 'ID';
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
};

const extractEnum = (typeStr) => {
    try {
        const match = typeStr.match(/enum\((.*)\)/);
        if (match) {
            return match[1].split(',').map(v => v.replace(/'/g, '').trim());
        }
    } catch(e){}
    return [];
};

const fetchColumnsAndData = async () => {
    loading.value = true;
    try {
        // Fetch columns
        const colRes = await api.get(`/references/${tableName.value}/columns`);
        columns.value = colRes.data.columns;

        // Initialize empty reactive properties mapped to columns
        formColumns.value.forEach(col => {
            formData.value[col.Field] = col.Default !== null ? col.Default : '';
        });

        // If Editing, Fetch Row Data and override defaults
        if (isEditing.value) {
            const rowRes = await api.get(`/references/${tableName.value}/row/${recordId.value}`);
            const rowData = rowRes.data;
            formColumns.value.forEach(col => {
                // Formatting specific fields if needed
                if (col.Type.includes('date') && rowData[col.Field]) {
                     // Slice to yyyy-MM-dd if it comes back as ISO datetime
                     formData.value[col.Field] = String(rowData[col.Field]).slice(0, 10);
                } else {
                     formData.value[col.Field] = rowData[col.Field] || '';
                }
            });
            formData.value.id = rowData.id;
        }

    } catch (error) {
        console.error('Error fetching requirements:', error);
        Alert.error('Gagal', 'Gagal memuat struktur formulir atau data referensi ini.');
        router.push({ name: 'reference-index', params: { table: tableName.value }});
    } finally {
        loading.value = false;
    }
};

const submitForm = async () => {
    // Simple frontend validation
    const missingFields = formColumns.value.filter(col => col.Null === 'NO' && (formData.value[col.Field] === '' || formData.value[col.Field] === null));
    if (missingFields.length > 0) {
        Alert.error('Validasi', 'Mohon lengkapi semua field yang wajib diisi.');
        return;
    }

    submitting.value = true;
    try {
        if (isEditing.value) {
            await api.put(`/references/${tableName.value}/${recordId.value}`, formData.value);
            Alert.success('Berhasil', 'Data berhasil diperbarui.');
        } else {
            await api.post(`/references/${tableName.value}`, formData.value);
            Alert.success('Berhasil', 'Data berhasil ditambahkan.');
        }
        
        router.push({ name: 'reference-index', params: { table: tableName.value } });
    } catch (error) {
        console.error('Submit execution error:', error);
        Alert.error('Gagal', 'Terjadi kesalahan saat menyimpan data.');
    } finally {
        submitting.value = false;
    }
};

onMounted(() => {
    fetchColumnsAndData();
});
</script>
