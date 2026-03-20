<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Teacher Management</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage teachers and staff.</p>
            </div>
            <router-link :to="{ name: 'teacher-create' }" class="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-brand-500/30">
                <i class="fas fa-plus mr-2"></i>
                Add New Teacher
            </router-link>
        </div>

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
                     <input v-model="searchQuery" type="text" placeholder="Search teachers..." class="pl-9 pr-4 py-2 text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-darkbg dark:text-white focus:ring-brand-500 focus:border-brand-500 w-full sm:w-64">
                 </div>
             </div>

            <div class="overflow-x-auto flex-1">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">No</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profile</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Info</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                         <tr v-if="loading">
                             <td colspan="6" class="px-6 py-10 text-center">
                                 <i class="fas fa-spinner fa-spin text-2xl text-brand-500"></i>
                             </td>
                        </tr>
                        <tr v-else-if="paginatedTeachers.length === 0">
                             <td colspan="6" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                 No teachers found.
                             </td>
                        </tr>
                         <tr v-else v-for="(teacher, index) in paginatedTeachers" :key="teacher.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <img :src="teacher.image_url || 'https://via.placeholder.com/150'" alt="Teacher" class="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-600">
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ teacher.name }}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">{{ teacher.position }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {{ teacher.order }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                <span :class="[
                                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                    teacher.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                ]">
                                    {{ teacher.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex items-center justify-end gap-2">
                                    <router-link :to="{ name: 'teacher-edit', params: { id: teacher.id } }" class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </router-link>
                                    <button @click="confirmDelete(teacher.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <AdminPagination 
                v-if="!loading && filteredTeachers.length > 0"
                :total="filteredTeachers.length"
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
import { ref, onMounted, computed, watch } from 'vue';
import api from '../../../services/api';
import Alert from '../../../assets/alert';
import AdminPagination from '../../../components/admin/AdminPagination.vue';

const teachers = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const perPage = ref(10);
const currentPage = ref(1);

const fetchTeachers = async () => {
    loading.value = true;
    try {
        const response = await api.get('/teachers');
        teachers.value = response.data;
    } catch (error) {
        console.error('Error fetching teachers:', error);
        Alert.error('Error', 'Failed to load teachers');
    } finally {
        loading.value = false;
    }
};

const confirmDelete = async (id) => {
    const result = await Alert.confirm('Are you sure?', 'This action cannot be undone.');
    if (result.isConfirmed) {
        try {
            await api.delete(`/teachers/${id}`);
            Alert.success('Deleted!', 'Teacher has been deleted.');
            fetchTeachers();
        } catch (error) {
            console.error('Error deleting teacher:', error);
            Alert.error('Error', 'Failed to delete teacher');
        }
    }
};

const filteredTeachers = computed(() => {
    if (!searchQuery.value) return teachers.value;
    const query = searchQuery.value.toLowerCase();
    return teachers.value.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.position.toLowerCase().includes(query)
    );
});

const paginatedTeachers = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return filteredTeachers.value.slice(start, end);
});

watch([searchQuery, perPage], () => {
    currentPage.value = 1;
});

onMounted(() => {
    fetchTeachers();
});
</script>
