<template>
    <div class="max-w mx-auto space-y-8">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <router-link :to="{ name: 'fee-index' }" class="text-gray-500 hover:text-brand-600">
                    <i class="fas fa-arrow-left text-xl"></i>
                </router-link>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit' : 'Tambah' }} Fee</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Silakan isi formulir di bawah ini.</p>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <form @submit.prevent="submitForm">
                <div class="p-6 sm:p-8 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <label for="fee_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fee Type <span class="text-red-500">*</span></label>
                            <input type="text" id="fee_type" v-model="form.fee_type" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Code <span class="text-red-500">*</span></label>
                            <input type="text" id="code" v-model="form.code" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="fee_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fee Name <span class="text-red-500">*</span></label>
                            <input type="text" id="fee_name" v-model="form.fee_name" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount <span class="text-red-500">*</span></label>
                            <input type="text" id="amount" v-model="form.amount" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="education_level" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Education Level <span class="text-red-500">*</span></label>
                            <input type="text" id="education_level" v-model="form.education_level" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="batch" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch <span class="text-red-500">*</span></label>
                            <input type="text" id="batch" v-model="form.batch" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="path" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Path <span class="text-red-500">*</span></label>
                            <input type="text" id="path" v-model="form.path" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="sub_path" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Sub Path <span class="text-red-500">*</span></label>
                            <input type="text" id="sub_path" v-model="form.sub_path" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="path_level" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Path Level <span class="text-red-500">*</span></label>
                            <input type="text" id="path_level" v-model="form.path_level" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="sequence" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Sequence <span class="text-red-500">*</span></label>
                            <input type="number" id="sequence" v-model="form.sequence" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                    </div>
                </div>
                
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <router-link :to="{ name: 'fee-index' }" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-darkcard hover:bg-gray-50 dark:hover:bg-gray-700 transition">
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

const form = ref({
        fee_type: '',
        code: '',
        fee_name: '',
        amount: '',
        education_level: '',
        batch: '',
        path: '',
        sub_path: '',
        path_level: '',
        sequence: '',
});

const fetchData = async () => {
    if (!isEditing.value) return;
    try {
        const res = await api.get(`/fee/${route.params.id}`);
        const data = res.data;
        Object.keys(form.value).forEach(key => {
            if (data[key] !== undefined) form.value[key] = data[key] === null ? '' : data[key];
            if (form.value[key] && typeof form.value[key] === 'string' && form.value[key].match(/^\d{4}-\d{2}-\d{2}T/)) {
                form.value[key] = form.value[key].substring(0, 10);
            }
        });
    } catch (e) {
        Alert.error('Error', 'Gagal memuat data');
        router.push({ name: 'fee-index' });
    }
};

const submitForm = async () => {
    submitting.value = true;
    try {
        if (isEditing.value) {
            await api.put(`/fee/${route.params.id}`, form.value);
            Alert.success('Berhasil', 'Data berhasil diperbarui');
        } else {
            await api.post(`/fee`, form.value);
            Alert.success('Berhasil', 'Data berhasil ditambahkan');
        }
        router.push({ name: 'fee-index' });
    } catch (error) {
        Alert.error('Gagal', 'Terjadi kesalahan saat menyimpan data');
    } finally {
        submitting.value = false;
    }
};

onMounted(() => fetchData());
</script>