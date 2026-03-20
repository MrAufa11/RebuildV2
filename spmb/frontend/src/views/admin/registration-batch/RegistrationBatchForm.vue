<template>
    <div class="max-w mx-auto space-y-8">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <router-link :to="{ name: 'registration-batch-index' }" class="text-gray-500 hover:text-brand-600">
                    <i class="fas fa-arrow-left text-xl"></i>
                </router-link>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit' : 'Tambah' }} Registration Batch</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Silakan isi formulir di bawah ini.</p>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <form @submit.prevent="submitForm">
                <div class="p-6 sm:p-8 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <label for="batch_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch Code </label>
                            <input type="text" id="batch_code" v-model="form.batch_code" :required="false" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="batch_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch Name <span class="text-red-500">*</span></label>
                            <input type="text" id="batch_name" v-model="form.batch_name" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="academic_year" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Academic Year <span class="text-red-500">*</span></label>
                            <input type="text" id="academic_year" v-model="form.academic_year" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="education_level" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Education Level <span class="text-red-500">*</span></label>
                            <input type="text" id="education_level" v-model="form.education_level" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date <span class="text-red-500">*</span></label>
                            <input type="date" id="start_date" v-model="form.start_date" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="end_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date <span class="text-red-500">*</span></label>
                            <input type="date" id="end_date" v-model="form.end_date" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="registration_path" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Path </label>
                            <input type="text" id="registration_path" v-model="form.registration_path" :required="false" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="selection_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Selection Type <span class="text-red-500">*</span></label>
                            <input type="number" id="selection_type" v-model="form.selection_type" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="selection_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Selection Date </label>
                            <input type="date" id="selection_date" v-model="form.selection_date" :required="false" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="selection_end_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Selection End Date </label>
                            <input type="date" id="selection_end_date" v-model="form.selection_end_date" :required="false" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="selection_result_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Selection Result Date </label>
                            <input type="date" id="selection_result_date" v-model="form.selection_result_date" :required="false" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="re_registration_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Re Registration Date <span class="text-red-500">*</span></label>
                            <input type="date" id="re_registration_date" v-model="form.re_registration_date" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="re_registration_end_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Re Registration End Date </label>
                            <input type="date" id="re_registration_end_date" v-model="form.re_registration_end_date" :required="false" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                    </div>
                </div>
                
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <router-link :to="{ name: 'registration-batch-index' }" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-darkcard hover:bg-gray-50 dark:hover:bg-gray-700 transition">
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
        batch_code: '',
        batch_name: '',
        academic_year: '',
        education_level: '',
        start_date: '',
        end_date: '',
        registration_path: '',
        selection_type: '',
        selection_date: '',
        selection_end_date: '',
        selection_result_date: '',
        re_registration_date: '',
        re_registration_end_date: '',
});

const fetchData = async () => {
    if (!isEditing.value) return;
    try {
        const res = await api.get(`/registration-batch/${route.params.id}`);
        const data = res.data;
        Object.keys(form.value).forEach(key => {
            if (data[key] !== undefined) form.value[key] = data[key] === null ? '' : data[key];
            if (form.value[key] && typeof form.value[key] === 'string' && form.value[key].match(/^\d{4}-\d{2}-\d{2}T/)) {
                form.value[key] = form.value[key].substring(0, 10);
            }
        });
    } catch (e) {
        Alert.error('Error', 'Gagal memuat data');
        router.push({ name: 'registration-batch-index' });
    }
};

const submitForm = async () => {
    submitting.value = true;
    try {
        if (isEditing.value) {
            await api.put(`/registration-batch/${route.params.id}`, form.value);
            Alert.success('Berhasil', 'Data berhasil diperbarui');
        } else {
            await api.post(`/registration-batch`, form.value);
            Alert.success('Berhasil', 'Data berhasil ditambahkan');
        }
        router.push({ name: 'registration-batch-index' });
    } catch (error) {
        Alert.error('Gagal', 'Terjadi kesalahan saat menyimpan data');
    } finally {
        submitting.value = false;
    }
};

onMounted(() => fetchData());
</script>