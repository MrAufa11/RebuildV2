<template>
    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h3 class="font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit User' : 'Create New User' }}</h3>
            <span class="text-xs text-gray-500">Fill in the details below</span>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <input 
                            v-model="form.username" 
                            type="text" 
                            id="username" 
                            required 
                            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:focus:border-gray-500 dark:focus:ring-gray-700 sm:text-sm px-4 py-2.5 transition-colors" 
                            placeholder="e.g. johndoe"
                        >
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input 
                        v-model="form.email" 
                        type="email" 
                        id="email" 
                        required 
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:focus:border-gray-500 dark:focus:ring-gray-700 sm:text-sm px-4 py-2.5 transition-colors" 
                        placeholder="john@example.com"
                    >
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ isEditing ? 'Password (Leave blank to keep current)' : 'Password' }}</label>
                    <input 
                        v-model="form.password" 
                        type="password" 
                        id="password" 
                        :required="!isEditing" 
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:focus:border-gray-500 dark:focus:ring-gray-700 sm:text-sm px-4 py-2.5 transition-colors" 
                        placeholder="••••••••"
                    >
                </div>

                <div>
                    <BaseSelect
                        input-label="Role"
                        v-model="form.role_id"
                        :options="roles"
                        :reduce="role => role.id"
                        label="name"
                        placeholder="Select Role"
                        required
                    />
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" @click="goBack" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all cursor-pointer">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all shadow-gray-500/30 cursor-pointer">
                    <i class="fas fa-save mr-2"></i> {{ isEditing ? 'Update User' : 'Create User' }}
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
import BaseSelect from '../../../components/BaseSelect.vue';

const route = useRoute();
const router = useRouter();

const roles = ref([]);
const isEditing = computed(() => !!route.params.id);

const form = ref({
    username: '',
    email: '',
    password: '',
    role_id: ''
});

const fetchRoles = async () => {
    try {
        const response = await api.get('/roles');
        roles.value = response.data;
        console.log('Fetched Roles:', roles.value);
        if (roles.value.length > 0) {
            console.log('Role ID Data Type:', typeof roles.value[0].id);
        }
    } catch (error) {
        console.error('Error fetching roles:', error);
        Alert.error('Error', 'Failed to load roles');
    }
};

const fetchUser = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        const user = response.data;
        
        console.log('Fetched User:', user);
        console.log('User Role ID:', user.role_id, typeof user.role_id);
        
        form.value = {
            username: user.username,
            email: user.email,
            role_id: user.role_id ? user.role_id : (user.role_id || ''),
            password: '' // Don't fill password
        };
        console.log('Form Role ID set to:', form.value.role_id);
    } catch (error) {
        console.error('Error fetching user:', error);
        Alert.error('Error', 'Failed to load user data');
        router.push({ name: 'user-index' });
    }
};

const handleSubmit = async () => {
    try {
        if (isEditing.value) {
            const updateData = { ...form.value };
            if (!updateData.password) delete updateData.password;
            
            await api.put(`/users/${route.params.id}`, updateData);
            Alert.success('Success', 'User updated successfully');
        } else {
            await api.post('/users', form.value);
            Alert.success('Success', 'User created successfully');
        }
        router.push({ name: 'user-index' });
    } catch (error) {
        console.error('Error saving user:', error);
        Alert.error('Error', error.response?.data?.message || 'Failed to save user');
    }
};

const goBack = () => {
    router.push({ name: 'user-index' });
};

onMounted(() => {
    fetchRoles();
    if (isEditing.value) {
        fetchUser(route.params.id);
    }
});
</script>