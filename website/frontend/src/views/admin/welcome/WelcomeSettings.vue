<template>
    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <h3 class="font-bold text-gray-900 dark:text-white">Pengaturan Sambutan Kepala Madrasah</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Atur konten sambutan yang tampil di halaman depan.</p>
        </div>
        
        <form @submit.prevent="saveSettings" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Column: Content -->
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Sambutan</label>
                        <input v-model="form.welcome_title" type="text" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" placeholder="Contoh: Membangun Generasi Qur'ani">
                        <p class="mt-1 text-xs text-gray-500">Mendukung HTML sederhana untuk styling (misal: &lt;br&gt;, &lt;span&gt;).</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Isi Sambutan</label>
                        <textarea v-model="form.welcome_message" rows="6" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" placeholder="Tuliskan isi sambutan di sini..."></textarea>
                    </div>

                    <div class="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Profil Kepala Madrasah</h4>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                                <input v-model="form.principal_name" type="text" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" placeholder="Contoh: Drs. H. Ahmad Fauzi">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kutipan / Quote</label>
                                <textarea v-model="form.principal_quote" rows="2" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" placeholder="Contoh: Pendidikan adalah senjata paling mematikan..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Images -->
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Foto Utama (Background/Side Image)</label>
                        <ImageUpload 
                            v-model="form.welcome_image" 
                            folder="settings"
                            class="aspect-[4/3] w-full"
                        />
                        <p class="mt-1 text-xs text-gray-500">Disarankan ukuran 1200x800px.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Foto Kepala Madrasah</label>
                        <div class="flex items-start gap-4">
                            <div class="w-32 h-32 flex-shrink-0">
                                <ImageUpload 
                                    v-model="form.principal_image" 
                                    folder="settings"
                                    class="h-full w-full rounded-full overflow-hidden"
                                />
                            </div>
                            <div class="text-sm text-gray-500 pt-2">
                                <p>Upload foto profil resmi kepala madrasah.</p>
                                <p class="mt-1">Disarankan rasio 1:1, minimal 200x200px.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end pt-6 mt-8 border-t border-gray-100 dark:border-gray-700">
                <button type="submit" :disabled="loading" class="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-sm shadow-brand-500/30 transition-all flex items-center gap-2">
                    <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                    <i v-else class="fas fa-save"></i>
                    <span>Simpan Perubahan</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../../services/api';
import Alert from '../../../assets/alert';
import ImageUpload from '../../../components/admin/ImageUpload.vue'; // Check path is correct

const loading = ref(false);
const form = ref({
    welcome_title: '',
    welcome_message: '',
    welcome_image: '',
    principal_name: '',
    principal_image: '',
    principal_quote: ''
});

const fetchSettings = async () => {
    try {
        const response = await api.get('/settings'); // Protected route
        const data = response.data;
        // Map keys to form
        form.value.welcome_title = data.welcome_title || '';
        form.value.welcome_message = data.welcome_message || '';
        form.value.welcome_image = data.welcome_image || '';
        form.value.principal_name = data.principal_name || '';
        form.value.principal_image = data.principal_image || '';
        form.value.principal_quote = data.principal_quote || '';
    } catch (error) {
        console.error('Error fetching settings:', error);
        Alert.error('Gagal memuat pengaturan');
    }
};

const saveSettings = async () => {
    loading.value = true;
    try {
        await api.put('/settings', form.value);
        Alert.success('Berhasil', 'Pengaturan sambutan berhasil disimpan');
    } catch (error) {
        console.error('Error saving settings:', error);
        Alert.error('Gagal menyimpan pengaturan');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchSettings();
});
</script>
