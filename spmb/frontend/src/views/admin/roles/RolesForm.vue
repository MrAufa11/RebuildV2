<template>
    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h3 class="font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit Role' : 'Create New Role' }}</h3>
            <span class="text-xs text-gray-500">Manage role details and permissions</span>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6">
            <div class="space-y-6">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Name</label>
                    <input 
                        v-model="form.name" 
                        type="text" 
                        id="name" 
                        required 
                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white shadow-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:focus:border-gray-500 dark:focus:ring-gray-700 sm:text-sm px-4 py-2.5 transition-colors" 
                        placeholder="e.g. Administrator"
                    >
                </div>

                <div>
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</h4>
                        <div class="flex gap-4">
                            <button type="button" @click="toggleAllPermissions" class="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium cursor-pointer">
                                {{ allPermissionsSelected ? 'Unselect All' : 'Select All Permissions' }}
                            </button>
                            <button type="button" @click="toggleAllAccordions" class="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium cursor-pointer">
                                {{ allAccordionsOpen ? 'Collapse All' : 'Expand All' }}
                            </button>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <div v-for="menu in menus" :key="menu.id" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <div 
                                @click="toggleAccordion(menu.id)" 
                                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                            >
                                <div class="flex items-center gap-3">
                                    <i :class="[menu.icon || 'fas fa-circle', 'text-gray-400 w-5 text-center']"></i>
                                    <span class="font-semibold text-sm text-gray-900 dark:text-white">{{ menu.label }}</span>
                                </div>
                                <i 
                                    class="fas fa-chevron-down text-gray-400 text-xs transition-transform duration-200"
                                    :class="{ 'rotate-180': activeAccordions.includes(menu.id) }"
                                ></i>
                            </div>

                            <div v-show="activeAccordions.includes(menu.id)" class="bg-white dark:bg-darkcard border-t border-gray-100 dark:border-gray-700">
                                <table class="min-w-full divide-y divide-gray-100 dark:divide-gray-700/50">
                                    <thead class="bg-gray-50/50 dark:bg-gray-800/30">
                                        <tr>
                                            <th scope="col" class="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Feature</th>
                                            <th scope="col" class="px-6 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">All</th>
                                            <th scope="col" class="px-6 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Read</th>
                                            <th scope="col" class="px-6 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Create</th>
                                            <th scope="col" class="px-6 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Update</th>
                                            <th scope="col" class="px-6 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
                                        <template v-if="menu.children && menu.children.length > 0">
                                            <tr v-for="child in menu.children" :key="child.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 pl-8">
                                                    {{ child.label }}
                                                </td>
                                                <td class="px-6 py-3 whitespace-nowrap text-center">
                                                    <input type="checkbox" 
                                                        :checked="isRowSelected(child.id)" 
                                                        @change="toggleRow(child.id, $event.target.checked)"
                                                        class="rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                                    >
                                                </td>
                                                <td class="px-6 py-3 whitespace-nowrap text-center">
                                                    <input type="checkbox" v-model="permissionsState[child.id].read" class="rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
                                                </td>
                                                <td class="px-6 py-3 whitespace-nowrap text-center">
                                                    <input type="checkbox" v-model="permissionsState[child.id].create" class="rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
                                                </td>
                                                <td class="px-6 py-3 whitespace-nowrap text-center">
                                                    <input type="checkbox" v-model="permissionsState[child.id].update" class="rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
                                                </td>
                                                <td class="px-6 py-3 whitespace-nowrap text-center">
                                                    <input type="checkbox" v-model="permissionsState[child.id].delete" class="rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
                                                </td>
                                            </tr>
                                        </template>
                                        
                                        <template v-else>
                                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                                    {{ menu.label }}
                                                </td>
                                                <td class="px-6 py-3 whitespace-nowrap text-center">
                                                    <input type="checkbox" 
                                                        :checked="isRowSelected(menu.id)" 
                                                        @change="toggleRow(menu.id, $event.target.checked)"
                                                        class="rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                                    >
                                                </td>
                                                <td class="px-6 py-3 whitespace-nowrap text-center">
                                                    <input type="checkbox" v-model="permissionsState[menu.id].read" class="rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
                                                </td>
                                                <td class="px-6 py-3 whitespace-nowrap text-center">
                                                    <input type="checkbox" v-model="permissionsState[menu.id].create" class="rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
                                                </td>
                                                <td class="px-6 py-3 whitespace-nowrap text-center">
                                                    <input type="checkbox" v-model="permissionsState[menu.id].update" class="rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
                                                </td>
                                                <td class="px-6 py-3 whitespace-nowrap text-center">
                                                    <input type="checkbox" v-model="permissionsState[menu.id].delete" class="rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div v-if="menus.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            Loading menus...
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
                <button type="button" @click="goBack" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-darkbg border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all cursor-pointer">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all shadow-gray-500/30 cursor-pointer">
                    <i class="fas fa-save mr-2"></i> {{ isEditing ? 'Update Role' : 'Create Role' }}
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

const route = useRoute();
const router = useRouter();

const isEditing = computed(() => !!route.params.id);
const menus = ref([]);
const flattenedMenus = ref([]);
const permissionsState = ref({}); 
const activeAccordions = ref([]); 

const form = ref({
    name: '',
    permissions: []
});

const allAccordionsOpen = computed(() => {
    return menus.value.length > 0 && activeAccordions.value.length === menus.value.length;
});

const allPermissionsSelected = computed(() => {
    if (flattenedMenus.value.length === 0) return false;
    return flattenedMenus.value.every(menu => {
        const p = permissionsState.value[menu.id];
        return p && p.read && p.create && p.update && p.delete;
    });
});

const toggleAccordion = (id) => {
    if (activeAccordions.value.includes(id)) {
        activeAccordions.value = activeAccordions.value.filter(item => item !== id);
    } else {
        activeAccordions.value.push(id);
    }
};

const toggleAllAccordions = () => {
    if (allAccordionsOpen.value) {
        activeAccordions.value = [];
    } else {
        activeAccordions.value = menus.value.map(m => m.id);
    }
};

const toggleAllPermissions = () => {
    const newState = !allPermissionsSelected.value;
    flattenedMenus.value.forEach(menu => {
        if (permissionsState.value[menu.id]) {
            toggleRow(menu.id, newState);
        }
    });
};

const isRowSelected = (id) => {
    const p = permissionsState.value[id];
    return p && p.read && p.create && p.update && p.delete;
};

const toggleRow = (id, checked) => {
    if (permissionsState.value[id]) {
        permissionsState.value[id].read = checked;
        permissionsState.value[id].create = checked;
        permissionsState.value[id].update = checked;
        permissionsState.value[id].delete = checked;
    }
};

const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           
        .replace(/[^\w\-]+/g, '')       
        .replace(/\-\-+/g, '-')         
        .replace(/^-+/, '')             
        .replace(/-+$/, '');            
};

const flattenMenusList = (items, isChild = false) => {
    let flat = [];
    items.forEach(item => {
        flat.push({ ...item, isChild });
        if (!permissionsState.value[item.id]) {
            permissionsState.value[item.id] = { read: false, create: false, update: false, delete: false };
        }
        
        if (item.children && item.children.length > 0) {
            flat = flat.concat(flattenMenusList(item.children, true));
        }
    });
    return flat;
};

const fetchMenus = async () => {
    try {
        const response = await api.get('/menus');
        menus.value = response.data;
        flattenedMenus.value = flattenMenusList(menus.value);
    } catch (error) {
        console.error('Error fetching menus:', error);
        Alert.error('Error', 'Failed to load menus');
    }
};

const fetchRole = async (id) => {
    try {
        const response = await api.get(`/roles/${id}`);
        const role = response.data;
        
        form.value.name = role.name;
        
        if (role.permissions && Array.isArray(role.permissions)) {
            role.permissions.forEach(perm => {
                const [menuSlug, action] = perm.name ? perm.name.split('.') : perm.split('.'); 
                
                const menu = flattenedMenus.value.find(m => slugify(m.label) === menuSlug);
                if (menu && permissionsState.value[menu.id] && permissionsState.value[menu.id][action]) {
                    permissionsState.value[menu.id] = { ...permissionsState.value[menu.id], [action]: true };
                    
                    const parentMenu = menus.value.find(m => m.id === menu.id || (m.children && m.children.some(c => c.id === menu.id)));
                    if (parentMenu && !activeAccordions.value.includes(parentMenu.id)) {
                         activeAccordions.value.push(parentMenu.id);
                    }
                } else if (menu && permissionsState.value[menu.id]) {
                     permissionsState.value[menu.id][action] = true;
                }
            });
        }
    } catch (error) {
        console.error('Error fetching role:', error);
        Alert.error('Error', 'Failed to load role data');
        router.push({ name: 'role-index' });
    }
};

const handleSubmit = async () => {
    try {
        const selectedPermissions = [];
        flattenedMenus.value.forEach(menu => {
            const perms = permissionsState.value[menu.id];
            const menuSlug = slugify(menu.label);
            
            if (perms.read) selectedPermissions.push(`${menuSlug}.read`);
            if (perms.create) selectedPermissions.push(`${menuSlug}.create`);
            if (perms.update) selectedPermissions.push(`${menuSlug}.update`);
            if (perms.delete) selectedPermissions.push(`${menuSlug}.delete`);
        });

        const payload = {
            name: form.value.name,
            permissions: selectedPermissions
        };

        if (isEditing.value) {
            await api.put(`/roles/${route.params.id}`, payload);
            Alert.success('Success', 'Role updated successfully');
        } else {
            await api.post('/roles', payload);
            Alert.success('Success', 'Role created successfully');
        }
        router.push({ name: 'role-index' });
    } catch (error) {
        console.error('Error saving role:', error);
        Alert.error('Error', error.response?.data?.message || 'Failed to save role');
    }
};

const goBack = () => {
    router.push({ name: 'role-index' });
};

onMounted(async () => {
    await fetchMenus();
    if (isEditing.value) {
        await fetchRole(route.params.id);
    }
});
</script>