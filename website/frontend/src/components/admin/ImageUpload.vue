<template>
    <div class="mb-4">
        <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ label }}
        </label>
        
        <div 
            class="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center transition-colors hover:border-brand-500 hover:bg-gray-50 dark:hover:bg-gray-800"
            :class="{ 'opacity-50 pointer-events-none': uploading }"
        >
            <input 
                :id="id" 
                type="file" 
                accept="image/jpeg,image/png,image/webp" 
                @change="onFileSelected" 
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            >
            
            <div v-if="previewUrl || modelValue" class="relative group w-full flex justify-center">
                 <img 
                    :src="previewUrl || modelValue" 
                    alt="Preview" 
                    class="max-h-64 object-contain rounded-lg shadow-sm"
                >
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <span class="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                        Click to change
                    </span>
                </div>
            </div>
            
            <div v-else class="text-center">
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Click to upload image</p>
                <p class="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Max 5MB)</p>
            </div>

            <!-- Loading Overlay -->
            <div v-if="uploading" class="absolute inset-0 bg-white/80 dark:bg-darkcard/80 flex flex-col items-center justify-center z-20">
                <i class="fas fa-spinner fa-spin text-brand-500 text-2xl mb-2"></i>
                <span class="text-sm font-medium text-gray-600">Uploading...</span>
            </div>
        </div>

        <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from '../../services/api';
import Alert from '../../assets/alert';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: 'Image'
    },
    id: {
        type: String,
        default: 'image-upload'
    },
    error: String
});

const emit = defineEmits(['update:modelValue']);

const uploading = ref(false);
const previewUrl = ref('');

// Watch props to sync simple string changes if external updates happen (e.g. edit mode load)
watch(() => props.modelValue, (newVal) => {
    // If incoming value is empty, clear preview? Or just rely on template checking modelValue
    // Usually fine to just rely on template :src="previewUrl || modelValue"
});

const onFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Frontend validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        Alert.error('Invalid File', 'Only JPG, PNG and WEBP files are allowed.');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        Alert.error('File Too Large', 'Maximum file size is 5MB.');
        return;
    }

    // Create local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
        previewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);

    // Upload
    uploading.value = true;
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // The backend returns { message, url, filename }
        // url is roughly /api/uploads/filename
        emit('update:modelValue', response.data.url);
        Alert.success('Success', 'Image uploaded successfully');
    } catch (err) {
        console.error('Upload error:', err);
        const msg = err.response?.data?.message || 'Failed to upload image';
        Alert.error('Upload Failed', msg);
        // Clear preview on failure
        previewUrl.value = '';
    } finally {
        uploading.value = false;
        // Reset input value so same file can be selected again if needed?
        event.target.value = ''; 
    }
};
</script>
