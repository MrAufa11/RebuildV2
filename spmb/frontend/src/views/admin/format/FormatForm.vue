<template>
    <div class="max-w mx-auto space-y-8">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <router-link :to="{ name: 'format-index' }" class="text-gray-500 hover:text-brand-600">
                    <i class="fas fa-arrow-left text-xl"></i>
                </router-link>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit' : 'Tambah' }} Format</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Silakan isi formulir di bawah ini.</p>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <form @submit.prevent="submitForm">
                <div class="p-6 sm:p-8 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <label for="code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Code <span class="text-red-500">*</span></label>
                            <input type="text" id="code" v-model="form.code" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="table_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Table Name <span class="text-red-500">*</span></label>
                            <input type="text" id="table_name" v-model="form.table_name" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="field" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Field <span class="text-red-500">*</span></label>
                            <input type="text" id="field" v-model="form.field" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="relation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Relation <span class="text-red-500">*</span></label>
                            <input type="text" id="relation" v-model="form.relation" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="code_digit" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Code Digit <span class="text-red-500">*</span></label>
                            <input type="text" id="code_digit" v-model="form.code_digit" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="source" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Source <span class="text-red-500">*</span></label>
                            <input type="text" id="source" v-model="form.source" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="hardcode_content" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Hardcode Content <span class="text-red-500">*</span></label>
                            <input type="text" id="hardcode_content" v-model="form.hardcode_content" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                    </div>
                </div>
                
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <router-link :to="{ name: 'format-index' }" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-darkcard hover:bg-gray-50 dark:hover:bg-gray-700 transition">
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
        code: '',
        table_name: '',
        field: '',
        relation: '',
        code_digit: '',
        source: '',
        hardcode_content: '',
});

const fetchData = async () => {
    if (!isEditing.value) return;
    try {
        const res = await api.get(`/format/${route.params.id}`);
        const data = res.data;
        Object.keys(form.value).forEach(key => {
            if (data[key] !== undefined) form.value[key] = data[key] === null ? '' : data[key];
            if (form.value[key] && typeof form.value[key] === 'string' && form.value[key].match(/^\d{4}-\d{2}-\d{2}T/)) {
                form.value[key] = form.value[key].substring(0, 10);
            }
        });
    } catch (e) {
        Alert.error('Error', 'Gagal memuat data');
        router.push({ name: 'format-index' });
    }
};

const submitForm = async () => {
    submitting.value = true;
    try {
        if (isEditing.value) {
            await api.put(`/format/${route.params.id}`, form.value);
            Alert.success('Berhasil', 'Data berhasil diperbarui');
        } else {
            await api.post(`/format`, form.value);
            Alert.success('Berhasil', 'Data berhasil ditambahkan');
        }
        router.push({ name: 'format-index' });
    } catch (error) {
        Alert.error('Gagal', 'Terjadi kesalahan saat menyimpan data');
    } finally {
        submitting.value = false;
    }
};

onMounted(() => fetchData());
</script>