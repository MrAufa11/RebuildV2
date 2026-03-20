<template>
    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h3 class="font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit Teacher' : 'Add New Teacher' }}</h3>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Name -->
                <div class="md:col-span-2">
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input v-model="form.name" type="text" id="name" required class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors" placeholder="e.g. Dr. John Doe">
                </div>

                <!-- Position -->
                <div class="md:col-span-2">
                    <label for="position" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position / Title</label>
                    <input v-model="form.position" type="text" id="position" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors" placeholder="e.g. Mathematics Teacher">
                </div>

                <!-- Image URL -->
                <div class="md:col-span-2">
                     <ImageUpload v-model="form.image_url" label="Photo Image" id="teacher-photo" />
                </div>

                <!-- Quote -->
                <div class="md:col-span-2">
                    <label for="quote" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quote / Bio</label>
                    <textarea v-model="form.quote" id="quote" rows="3" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors" placeholder="Short bio or quote..."></textarea>
                </div>

                <!-- Status -->
                <div class="flex items-center h-full pt-6">
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="form.is_active" class="sr-only peer">
                        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                        <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Active</span>
                    </label>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
                <button type="button" @click="goBack" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all cursor-pointer">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-lg shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all shadow-brand-500/30 cursor-pointer">
                    <i class="fas fa-save mr-2"></i> {{ isEditing ? 'Update Teacher' : 'Create Teacher' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';
import Alert from '../../../assets/alert';
import ImageUpload from '../../../components/admin/ImageUpload.vue';

const route = useRoute();
const router = useRouter();

const isEditing = computed(() => !!route.params.id);

const form = ref({
    name: '',
    position: '',
    image_url: '',
    quote: '',
    order: 0,
    is_active: true
});

const fetchTeacher = async (id) => {
    try {
        const response = await api.get(`/teachers/${id}`);
        form.value = response.data;
    } catch (error) {
        console.error('Error fetching teacher:', error);
        Alert.error('Error', 'Failed to load teacher data');
        router.push({ name: 'teacher-index' });
    }
};

const handleSubmit = async () => {
    try {
        if (isEditing.value) {
            await api.put(`/teachers/${route.params.id}`, form.value);
            Alert.success('Success', 'Teacher updated successfully');
        } else {
            await api.post('/teachers', form.value);
            Alert.success('Success', 'Teacher created successfully');
        }
        router.push({ name: 'teacher-index' });
    } catch (error) {
        console.error('Error saving teacher:', error);
        Alert.error('Error', error.response?.data?.message || 'Failed to save teacher');
    }
};

const goBack = () => {
    router.push({ name: 'teacher-index' });
};

onMounted(async () => {
    if (isEditing.value) {
        await fetchTeacher(route.params.id);
    }
});
</script>
