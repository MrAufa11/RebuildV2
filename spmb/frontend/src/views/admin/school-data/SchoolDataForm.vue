<template>
    <div class="max-w mx-auto space-y-8">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <router-link :to="{ name: 'school-data-index' }" class="text-gray-500 hover:text-brand-600">
                    <i class="fas fa-arrow-left text-xl"></i>
                </router-link>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit' : 'Tambah' }} School Data</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Silakan isi formulir di bawah ini.</p>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <form @submit.prevent="submitForm">
                <div class="p-6 sm:p-8 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <label for="province_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Province Code <span class="text-red-500">*</span></label>
                            <input type="text" id="province_code" v-model="form.province_code" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="city_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">City Code <span class="text-red-500">*</span></label>
                            <input type="text" id="city_code" v-model="form.city_code" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="district_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">District Code <span class="text-red-500">*</span></label>
                            <input type="text" id="district_code" v-model="form.district_code" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="school_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">School Code <span class="text-red-500">*</span></label>
                            <input type="text" id="school_code" v-model="form.school_code" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="school_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">School Name <span class="text-red-500">*</span></label>
                            <input type="text" id="school_name" v-model="form.school_name" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Address <span class="text-red-500">*</span></label>
                            <input type="text" id="address" v-model="form.address" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="sub_district" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Sub District <span class="text-red-500">*</span></label>
                            <input type="text" id="sub_district" v-model="form.sub_district" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status <span class="text-red-500">*</span></label>
                            <input type="text" id="status" v-model="form.status" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="education_level" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Education Level <span class="text-red-500">*</span></label>
                            <input type="text" id="education_level" v-model="form.education_level" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="latitude" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Latitude <span class="text-red-500">*</span></label>
                            <input type="text" id="latitude" v-model="form.latitude" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="longitude" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Longitude <span class="text-red-500">*</span></label>
                            <input type="text" id="longitude" v-model="form.longitude" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="member_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Member Id <span class="text-red-500">*</span></label>
                            <input type="number" id="member_id" v-model="form.member_id" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="member_status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Member Status <span class="text-red-500">*</span></label>
                            <input type="number" id="member_status" v-model="form.member_status" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="admission_status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Admission Status <span class="text-red-500">*</span></label>
                            <input type="number" id="admission_status" v-model="form.admission_status" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="logo" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo <span class="text-red-500">*</span></label>
                            <input type="text" id="logo" v-model="form.logo" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="principal_photo" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Principal Photo <span class="text-red-500">*</span></label>
                            <input type="text" id="principal_photo" v-model="form.principal_photo" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="principal_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Principal Name <span class="text-red-500">*</span></label>
                            <input type="text" id="principal_name" v-model="form.principal_name" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                        <div class="space-y-1">
                            <label for="keywords" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Keywords <span class="text-red-500">*</span></label>
                            <input type="text" id="keywords" v-model="form.keywords" :required="true" class="w-full px-4 py-2 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                        </div>
                    </div>
                </div>
                
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <router-link :to="{ name: 'school-data-index' }" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-darkcard hover:bg-gray-50 dark:hover:bg-gray-700 transition">
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
        province_code: '',
        city_code: '',
        district_code: '',
        school_code: '',
        school_name: '',
        address: '',
        sub_district: '',
        status: '',
        education_level: '',
        latitude: '',
        longitude: '',
        member_id: '',
        member_status: '',
        admission_status: '',
        logo: '',
        principal_photo: '',
        principal_name: '',
        keywords: '',
});

const fetchData = async () => {
    if (!isEditing.value) return;
    try {
        const res = await api.get(`/school-data/${route.params.id}`);
        const data = res.data;
        Object.keys(form.value).forEach(key => {
            if (data[key] !== undefined) form.value[key] = data[key] === null ? '' : data[key];
            if (form.value[key] && typeof form.value[key] === 'string' && form.value[key].match(/^\d{4}-\d{2}-\d{2}T/)) {
                form.value[key] = form.value[key].substring(0, 10);
            }
        });
    } catch (e) {
        Alert.error('Error', 'Gagal memuat data');
        router.push({ name: 'school-data-index' });
    }
};

const submitForm = async () => {
    submitting.value = true;
    try {
        if (isEditing.value) {
            await api.put(`/school-data/${route.params.id}`, form.value);
            Alert.success('Berhasil', 'Data berhasil diperbarui');
        } else {
            await api.post(`/school-data`, form.value);
            Alert.success('Berhasil', 'Data berhasil ditambahkan');
        }
        router.push({ name: 'school-data-index' });
    } catch (error) {
        Alert.error('Gagal', 'Terjadi kesalahan saat menyimpan data');
    } finally {
        submitting.value = false;
    }
};

onMounted(() => fetchData());
</script>