<template>
    <div class="max-w mx-auto space-y-8">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <router-link :to="{ name: 'selection-schedule-index' }" class="text-gray-500 hover:text-brand-600">
                    <i class="fas fa-arrow-left text-xl"></i>
                </router-link>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit' : 'Tambah' }} Selection Schedule</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Silakan isi formulir di bawah ini.</p>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <form @submit.prevent="submitForm">
                <div class="p-6 sm:p-8 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <label for="schedule_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Schedule Code <span class="text-red-500">*</span></label>
                            <input type="text" id="schedule_code" v-model="form.schedule_code" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
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
                            <label for="supervisor" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Supervisor <span class="text-red-500">*</span></label>
                            <input type="text" id="supervisor" v-model="form.supervisor" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="path" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Path <span class="text-red-500">*</span></label>
                            <input type="text" id="path" v-model="form.path" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="selection_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Selection Type <span class="text-red-500">*</span></label>
                            <input type="text" id="selection_type" v-model="form.selection_type" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="selection_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Selection Date <span class="text-red-500">*</span></label>
                            <input type="date" id="selection_date" v-model="form.selection_date" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="start_time" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time <span class="text-red-500">*</span></label>
                            <input type="text" id="start_time" v-model="form.start_time" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="end_time" class="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time <span class="text-red-500">*</span></label>
                            <input type="text" id="end_time" v-model="form.end_time" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="session" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Session <span class="text-red-500">*</span></label>
                            <input type="text" id="session" v-model="form.session" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="room" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Room <span class="text-red-500">*</span></label>
                            <input type="text" id="room" v-model="form.room" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="uniform_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Uniform Date <span class="text-red-500">*</span></label>
                            <input type="date" id="uniform_date" v-model="form.uniform_date" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="selection_result_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Selection Result Date <span class="text-red-500">*</span></label>
                            <input type="date" id="selection_result_date" v-model="form.selection_result_date" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                    </div>
                </div>
                
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <router-link :to="{ name: 'selection-schedule-index' }" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-darkcard hover:bg-gray-50 dark:hover:bg-gray-700 transition">
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
        schedule_code: '',
        education_level: '',
        batch: '',
        supervisor: '',
        path: '',
        selection_type: '',
        selection_date: '',
        start_time: '',
        end_time: '',
        session: '',
        room: '',
        uniform_date: '',
        selection_result_date: '',
});

const fetchData = async () => {
    if (!isEditing.value) return;
    try {
        const res = await api.get(`/selection-schedule/${route.params.id}`);
        const data = res.data;
        Object.keys(form.value).forEach(key => {
            if (data[key] !== undefined) form.value[key] = data[key] === null ? '' : data[key];
            if (form.value[key] && typeof form.value[key] === 'string' && form.value[key].match(/^\d{4}-\d{2}-\d{2}T/)) {
                form.value[key] = form.value[key].substring(0, 10);
            }
        });
    } catch (e) {
        Alert.error('Error', 'Gagal memuat data');
        router.push({ name: 'selection-schedule-index' });
    }
};

const submitForm = async () => {
    submitting.value = true;
    try {
        if (isEditing.value) {
            await api.put(`/selection-schedule/${route.params.id}`, form.value);
            Alert.success('Berhasil', 'Data berhasil diperbarui');
        } else {
            await api.post(`/selection-schedule`, form.value);
            Alert.success('Berhasil', 'Data berhasil ditambahkan');
        }
        router.push({ name: 'selection-schedule-index' });
    } catch (error) {
        Alert.error('Gagal', 'Terjadi kesalahan saat menyimpan data');
    } finally {
        submitting.value = false;
    }
};

onMounted(() => fetchData());
</script>