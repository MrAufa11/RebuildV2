<template>
    <div class="max-w mx-auto space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage system users and their roles.</p>
            </div>
            <router-link :to="{ name: 'user-create' }" class="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-brand-500/30">
                <i class="fas fa-plus mr-2"></i> Add New User
            </router-link>
        </div>


        <!-- Users Table -->
        <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-[500px]">
            <!-- Filter Bar -->
             <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                 <div class="flex items-center gap-2">
                     <span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
                     <select v-model="perPage" class="text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-darkbg dark:text-white focus:ring-brand-500 focus:border-brand-500">
                         <option :value="10">10</option>
                         <option :value="25">25</option>
                         <option :value="50">50</option>
                     </select>
                     <span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
                 </div>
                 <div class="relative">
                     <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                     <input v-model="searchQuery" type="text" placeholder="Search users..." class="pl-9 pr-4 py-2 text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-darkbg dark:text-white focus:ring-brand-500 focus:border-brand-500 w-full sm:w-64">
                 </div>
             </div>

            <div class="overflow-x-auto flex-1">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">No</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-if="loading">
                             <td colspan="5" class="px-6 py-10 text-center">
                                 <i class="fas fa-spinner fa-spin text-2xl text-brand-500"></i>
                             </td>
                        </tr>
                        <tr v-else-if="paginatedUsers.length === 0">
                             <td colspan="5" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                 No users found.
                             </td>
                        </tr>
                        <tr v-else v-for="(user, index) in paginatedUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ (currentPage - 1) * perPage + index + 1 }}</td>
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
                    </tbody>
                </table>
            </div>
            
            <AdminPagination 
                v-if="!loading && filteredUsers.length > 0"
                :total="filteredUsers.length"
                :per-page="perPage"
                :current-page="currentPage"
                @prev="currentPage--"
                @next="currentPage++"
                @page="page => currentPage = page"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../../../services/api';
import Alert from '../../../assets/alert';
import AdminPagination from '../../../components/admin/AdminPagination.vue';

const users = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const perPage = ref(10);
const currentPage = ref(1);

const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : '??';
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
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

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return filteredUsers.value.slice(start, end);
});

// Reset page when filter changes
watch([searchQuery, perPage], () => {
    currentPage.value = 1;
});

const fetchUsers = async () => {
    loading.value = true;
    try {
        const response = await api.get('/users');
        users.value = response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        Alert.error('Error', 'Failed to fetch users');
    } finally {
        loading.value = false;
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
});
</script>
