<template>
    <div class="max-w mx-auto space-y-8">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <router-link :to="{ name: 'registration-sub-path-index', query: { path_id: route.query.path_id } }" class="text-gray-500 hover:text-brand-600">
                    <i class="fas fa-arrow-left text-xl"></i>
                </router-link>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit' : 'Tambah' }} Registration Sub Path</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Silakan isi formulir di bawah ini.</p>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <form @submit.prevent="submitForm">
                <div class="p-6 sm:p-8 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Jalur Pendaftaran (Path) <span class="text-red-500">*</span></label>
                            <v-select
                                v-model="form.registration_path_id"
                                :options="pathOptions"
                                :reduce="path => path.id"
                                label="path_name"
                                placeholder="Pilih Jalur..."
                                class="bg-white dark:bg-darkbg text-sm"
                            />
                        </div>
                        <div class="space-y-1">
                            <label for="sub_path_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Sub Jalur <span class="text-red-500">*</span></label>
                            <input type="text" id="sub_path_name" v-model="form.sub_path_name" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" placeholder="Contoh: Prestasi Tahfidz">
                        </div>
                    </div>
                </div>
                
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <router-link :to="{ name: 'registration-sub-path-index', query: { path_id: route.query.path_id } }" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-darkcard hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        Batal
                    </router-link>
                    <button type="submit" :disabled="submitting" class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm shadow-sm transition-all focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                        {{ submitting ? 'Menyimpan...' : 'Simpan Data' }}
                    </button>
                </div>
            </form>
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

const isEditing = computed(() => !!route.params.id);
const submitting = ref(false);
const pathOptions = ref([]);

const form = ref({
    registration_path_id: route.query.path_id ? parseInt(route.query.path_id) : '',
    sub_path_name: '',
});

const fetchData = async () => {
    try {
        const pathRes = await api.get('/registration-path');
        pathOptions.value = pathRes.data;
        
        if (isEditing.value) {
            const res = await api.get(`/registration-sub-path/${route.params.id}`);
            const data = res.data;
            Object.keys(form.value).forEach(key => {
                if (data[key] !== undefined) form.value[key] = data[key] === null ? '' : data[key];
            });
        }
    } catch (e) {
        Alert.error('Error', 'Gagal memuat data');
    }
};

const submitForm = async () => {
    if (!form.value.registration_path_id) {
        Alert.error('Gagal', 'Silakan pilih Jalur Pendaftaran');
        return;
    }
    submitting.value = true;
    try {
        if (isEditing.value) {
            await api.put(`/registration-sub-path/${route.params.id}`, form.value);
            Alert.success('Berhasil', 'Data berhasil diperbarui');
        } else {
            await api.post(`/registration-sub-path`, form.value);
            Alert.success('Berhasil', 'Data berhasil ditambahkan');
        }
        router.push({ name: 'registration-sub-path-index', query: { path_id: route.query.path_id } });
    } catch (error) {
        Alert.error('Gagal', 'Terjadi kesalahan saat menyimpan data');
    } finally {
        submitting.value = false;
    }
};

onMounted(() => fetchData());
</script>