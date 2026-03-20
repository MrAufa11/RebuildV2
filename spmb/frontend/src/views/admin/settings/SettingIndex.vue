<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">General Settings</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage site configuration and content.</p>
            </div>
        </div>

        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <form @submit.prevent="handleSubmit">
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <!-- General Info -->
                     <div class="space-y-6">
                         <h4 class="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Application Info</h4>
                         
                         <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">App Name</label>
                            <input v-model="form.app_name" type="text" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Footer Text</label>
                            <input v-model="form.footer_text" type="text" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors">
                        </div>
                     </div>

                     <!-- Welcome Section -->
                     <div class="space-y-6">
                         <h4 class="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Welcome Section</h4>
                         
                         <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Welcome Title</label>
                            <input v-model="form.welcome_title" type="text" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Welcome Message</label>
                            <textarea v-model="form.welcome_message" rows="4" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors"></textarea>
                        </div>
                     </div>

                     <!-- Contact Info -->
                     <div class="space-y-6 md:col-span-2">
                         <h4 class="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Contact Information</h4>
                         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                <input v-model="form.contact_email" type="email" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                <input v-model="form.contact_phone" type="text" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors">
                            </div>

                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                <input v-model="form.contact_address" type="text" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors">
                            </div>
                         </div>
                     </div>

                     <!-- Social Media -->
                     <div class="space-y-6 md:col-span-2">
                         <h4 class="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Social Media</h4>
                         <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><i class="fab fa-facebook mr-1"></i> Facebook URL</label>
                                <input v-model="form.social_facebook" type="text" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><i class="fab fa-instagram mr-1"></i> Instagram URL</label>
                                <input v-model="form.social_instagram" type="text" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><i class="fab fa-twitter mr-1"></i> Twitter/X URL</label>
                                <input v-model="form.social_twitter" type="text" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:text-sm px-4 py-2.5 transition-colors">
                            </div>
                         </div>
                     </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex items-center justify-end border-t border-gray-100 dark:border-gray-700">
                    <button type="submit" class="px-6 py-2.5 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-lg shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all shadow-brand-500/30 cursor-pointer">
                        <i class="fas fa-save mr-2"></i> Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../../services/api';
import Alert from '../../../assets/alert';

const form = ref({
    app_name: '',
    footer_text: '',
    welcome_title: '',
    welcome_message: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    social_facebook: '',
    social_instagram: '',
    social_twitter: ''
});

const fetchSettings = async () => {
    try {
        const response = await api.get('/settings'); // Returns object { key: value } via getAllPublic which is routed via admin route too?
        // Wait, backend/routes/settings.js currently only has one route or none?
        // Let's check backend/routes/settings.js
        // If it's missing, I need to add it.
        Object.assign(form.value, response.data);
    } catch (error) {
        console.error('Error fetching settings:', error);
        Alert.error('Error', 'Failed to load settings');
    }
};

const handleSubmit = async () => {
    try {
        await api.put('/settings', form.value); // Expecting bulk update
        Alert.success('Success', 'Settings saved successfully');
    } catch (error) {
        console.error('Error saving settings:', error);
        Alert.error('Error', 'Failed to save settings');
    }
};

onMounted(() => {
    fetchSettings();
});
</script>
