<template>
    <div class="max-w mx-auto space-y-8">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Manage system users and their roles.</p>
            </div>
            <router-link :to="{ name: 'user-create' }" class="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-lg shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all shadow-brand-500/30 cursor-pointer">
                <i class="fas fa-plus mr-2"></i> Add New User
            </router-link>
        </div>


        <!-- Users Table -->
        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="font-bold text-lg text-gray-900 dark:text-white">All Users</h3>
                    <p class="text-sm text-gray-500">List of all registered users.</p>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <i class="fas fa-search text-gray-400 text-sm"></i>
                        </span>
                        <input type="text" v-model="searchQuery" placeholder="Search users..." class="pl-9 pr-4 py-2 w-full sm:w-64 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all">
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="(user, index) in filteredUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ index + 1 }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xs mr-3">
                                        {{ getInitials(user.username) }}
                                    </div>
                                    <div>
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.username }}</div>
                                        <div class="text-xs text-gray-500">{{ user.email }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                    {{ user.role ? user.role.name : 'No Role' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {{ formatDate(user.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex items-center justify-end gap-2">
                                    <router-link :to="{ name: 'user-edit', params: { id: user.id } }" class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </router-link>
                                    <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredUsers.length === 0">
                            <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                No users found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                    Total {{ filteredUsers.length }} users
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../../services/api';
import Alert from '../../../assets/alert';

const users = ref([]);
const roles = ref([]);
const showForm = ref(false);
const isEditing = ref(false);
const searchQuery = ref('');

const form = ref({
    id: null,
    username: '',
    email: '',
    password: '',
    role_id: ''
});

const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : '??';
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value;
    const q = searchQuery.value.toLowerCase();
    return users.value.filter(user => 
        user.username.toLowerCase().includes(q) || 
        user.email.toLowerCase().includes(q)
    );
});

const resetForm = () => {
    form.value = { id: null, username: '', email: '', password: '', role_id: '' };
    isEditing.value = false;
};

const fetchUsers = async () => {
    try {
        const response = await api.get('/users');
        users.value = response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        Alert.error('Error', 'Failed to fetch users');
    }
};

const fetchRoles = async () => {
    try {
        const response = await api.get('/roles');
        roles.value = response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
};

const editUser = (user) => {
    form.value = { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        password: '', // Don't show password
        role_id: user.role ? user.role.id : (user.role_id || '')
    };
    isEditing.value = true;
    showForm.value = true;
};

const handleSubmit = async () => {
    try {
        if (isEditing.value) {
            const updateData = { ...form.value };
            if (!updateData.password) delete updateData.password; // Only send password if changed
            
            await api.put(`/users/${form.value.id}`, updateData);
            Alert.success('Success', 'User updated successfully');
        } else {
            await api.post('/users', form.value);
            Alert.success('Success', 'User created successfully');
        }
        showForm.value = false;
        fetchUsers();
    } catch (error) {
        console.error('Error saving user:', error);
        Alert.error('Error', error.response?.data?.message || 'Failed to save user');
    }
};

const deleteUser = (id) => {
    Alert.confirm('Are you sure?', 'This action cannot be undone.')
        .then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/users/${id}`);
                    Alert.success('Deleted!', 'User has been deleted.');
                    fetchUsers();
                } catch (error) {
                    console.error('Error deleting user:', error);
                    Alert.error('Error', 'Failed to delete user');
                }
            }
        });
};

onMounted(() => {
    fetchUsers();
    fetchRoles();
});
</script>
