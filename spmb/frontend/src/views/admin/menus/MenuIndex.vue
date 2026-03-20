<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Menu Management</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Create, edit, and organize application menus.</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
                 <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i class="fas fa-search text-gray-400"></i>
                    </span>
                    <input 
                        v-model="searchQuery" 
                        type="text" 
                        placeholder="Search menus..." 
                        class="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkcard text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-colors"
                    >
                </div>
                <router-link :to="{ name: 'menu-create' }" class="inline-flex items-center justify-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-brand-500/30 whitespace-nowrap">
                    <i class="fas fa-plus mr-2"></i>
                    Add New Menu
                </router-link>
            </div>
        </div>

        <div class="space-y-4">
            <!-- Loading State -->
             <div v-if="loading" class="text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-brand-500"></i>
                <p class="mt-2 text-gray-500">Loading menus...</p>
            </div>

            <!-- Drag and Drop List (Visible only when NOT searching) -->
            <draggable 
                v-else-if="!searchQuery && menus.length > 0"
                v-model="menus" 
                item-key="id" 
                handle=".drag-handle"
                @change="onDragChange"
                class="space-y-4"
            >
                <template #item="{ element: menu }">
                    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
                        <!-- Parent Menu Header -->
                        <div 
                            class="w-full px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors select-none group"
                            @click="toggleAccordion(menu.id)"
                        >
                            <div class="flex items-center gap-4 flex-1">
                                <!-- Drag Handle -->
                                <div class="drag-handle cursor-move text-gray-300 hover:text-gray-500 p-2 hidden group-hover:block transition-colors" title="Drag to reorder">
                                    <i class="fas fa-grip-vertical"></i>
                                </div>
                                <div class="h-10 w-10 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-sm">
                                    <i :class="[menu.icon || 'fas fa-circle', 'text-lg']"></i>
                                </div>
                                <div>
                                    <h4 class="text-base font-semibold text-gray-900 dark:text-white">{{ menu.label }}</h4>
                                    <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        <span class="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{{ menu.url }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-1 mr-2" @click.stop>
                                    <router-link :to="{ name: 'menu-edit', params: { id: menu.id } }" class="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </router-link>
                                    <button @click="confirmDelete(menu.id)" class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                                <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                                <i 
                                    class="fas fa-chevron-down text-gray-400 transition-transform duration-300 transform"
                                    :class="{ 'rotate-180': isExpanded(menu.id) }"
                                ></i>
                            </div>
                        </div>

                        <!-- Child Menus -->
                        <div 
                            v-show="isExpanded(menu.id)" 
                            class="bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-700/50"
                        >
                             <draggable 
                                v-if="menu.children && menu.children.length > 0"
                                v-model="menu.children" 
                                item-key="id"
                                handle=".child-drag-handle"
                                @change="onDragChange"
                                class="divide-y divide-gray-100 dark:divide-gray-700/50"
                            >
                                <template #item="{ element: child }">
                                    <div class="px-6 py-3 pl-12 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <div class="flex items-center gap-3">
                                            <!-- Child Drag Handle -->
                                            <div class="child-drag-handle cursor-move text-gray-300 hover:text-gray-500 p-2 hidden group-hover:block transition-colors">
                                                <i class="fas fa-grip-vertical text-xs"></i>
                                            </div>
                                            <span class="text-gray-300 dark:text-gray-600"><i class="fas fa-level-up-alt rotate-90"></i></span>
                                            <div>
                                                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ child.label }}</p>
                                                <p class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5 cursor-pointer">{{ child.url }}</p>
                                            </div>
                                            <span v-if="child.icon" class="ml-2 text-xs text-gray-400 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-1.5 py-0.5 rounded shadow-sm">
                                                <i :class="child.icon"></i>
                                            </span>
                                        </div>
                                        
                                        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <router-link :to="{ name: 'menu-edit', params: { id: child.id } }" class="text-brand-600 hover:text-brand-700 p-1.5 rounded hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                                                <i class="fas fa-edit"></i>
                                            </router-link>
                                            <button @click="confirmDelete(child.id)" class="text-red-500 hover:text-red-600 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </template>
                            </draggable>

                            <div v-else class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                                No submenus found.
                            </div>
                        </div>
                    </div>
                </template>
            </draggable>

            <!-- Fallback Static List when Searching -->
            <template v-else-if="filteredMenus.length > 0">
                 <div v-for="menu in filteredMenus" :key="menu.id" class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <!-- Standard (non-draggable) layout for search results -->
                    <div 
                        class="w-full px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors select-none"
                        @click="toggleAccordion(menu.id)"
                    >
                         <div class="flex items-center gap-4 flex-1">
                            <div class="h-10 w-10 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-sm">
                                <i :class="[menu.icon || 'fas fa-circle', 'text-lg']"></i>
                            </div>
                            <div>
                                <h4 class="text-base font-semibold text-gray-900 dark:text-white">{{ menu.label }}</h4>
                                <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    <span class="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{{ menu.url }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                             <div class="flex items-center gap-1 mr-2" @click.stop>
                                <router-link :to="{ name: 'menu-edit', params: { id: menu.id } }" class="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <i class="fas fa-edit"></i>
                                </router-link>
                                <button @click="confirmDelete(menu.id)" class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                            <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                            <i class="fas fa-chevron-down text-gray-400 transition-transform duration-300 transform" :class="{ 'rotate-180': isExpanded(menu.id) }"></i>
                        </div>
                    </div>
                     <div v-show="isExpanded(menu.id)" class="bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-700/50">
                        <div v-if="menu.children && menu.children.length > 0" class="divide-y divide-gray-100 dark:divide-gray-700/50">
                            <div v-for="child in menu.children" :key="child.id" class="px-6 py-3 pl-20 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                <div class="flex items-center gap-3">
                                    <span class="text-gray-300 dark:text-gray-600"><i class="fas fa-level-up-alt rotate-90"></i></span>
                                    <div>
                                        <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ child.label }}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{{ child.url }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <router-link :to="{ name: 'menu-edit', params: { id: child.id } }" class="text-brand-600 hover:text-brand-700 p-1.5 rounded hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                                        <i class="fas fa-edit"></i>
                                    </router-link>
                                    <button @click="confirmDelete(child.id)" class="text-red-500 hover:text-red-600 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            </template>

            <div v-if="(searchQuery && filteredMenus.length === 0) || (!searchQuery && menus.length === 0 && !loading)" class="text-center py-12 bg-white dark:bg-darkcard rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <i class="fas fa-search text-4xl text-gray-300 dark:text-gray-600 mb-3 block"></i>
                <p class="text-gray-500 dark:text-gray-400 font-medium">No menus found</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import draggable from 'vuedraggable';
import api from '../../../services/api';
import Alert from '../../../assets/alert';

const menus = ref([]);
const searchQuery = ref('');
const expandedMenus = ref([]);
const loading = ref(false);

const fetchMenus = async () => {
    loading.value = true;
    try {
        const response = await api.get('/menus', { params: { app_id: 2 } });
        menus.value = response.data;
    } catch (error) {
        console.error('Error fetching menus:', error);
        Alert.error('Error', 'Failed to load menus');
    } finally {
        loading.value = false;
    }
};

const confirmDelete = async (id) => {
    const result = await Alert.confirm('Are you sure?', 'This will permanently delete the menu and its submenus.');
    if (result.isConfirmed) {
        try {
            await api.delete(`/menus/${id}`);
            Alert.success('Deleted!', 'Menu has been deleted.');
            fetchMenus();
        } catch (error) {
            console.error('Error deleting menu:', error);
            Alert.error('Error', 'Failed to delete menu');
        }
    }
};

const toggleAccordion = (id) => {
    if (expandedMenus.value.includes(id)) {
        expandedMenus.value = expandedMenus.value.filter(itemId => itemId !== id);
    } else {
        expandedMenus.value.push(id);
    }
};

const isExpanded = (id) => {
    return expandedMenus.value.includes(id);
};

// Filter logic (used only for searching, NOT for displaying drag list)
const filteredMenus = computed(() => {
    if (!searchQuery.value) return menus.value;
    
    const query = searchQuery.value.toLowerCase();
    
    return menus.value.reduce((acc, menu) => {
        const menuLabel = menu.label ? menu.label.toLowerCase() : '';
        const menuUrl = menu.url ? menu.url.toLowerCase() : '';
        
        const parentMatches = menuLabel.includes(query) || menuUrl.includes(query);
                              
        const matchingChildren = menu.children ? menu.children.filter(child => {
            const childLabel = child.label ? child.label.toLowerCase() : '';
            const childUrl = child.url ? child.url.toLowerCase() : '';
            return childLabel.includes(query) || childUrl.includes(query);
        }) : [];
        
        if (parentMatches || matchingChildren.length > 0) {
            const menuCopy = { ...menu };
            // Auto expand matching items
             if (matchingChildren.length > 0) {
                // Since this computed property runs often, avoid infinite loops or side effects here ideally.
                // But for expanding, it's efficient enough if we check includes.
                // Careful: modifying expandedMenus here triggers re-render?
                // Actually better to not modify state in computed. 
                // But user expects search results to be open.
                // We'll skip auto-expanding in computed to be safe, or do it in a watcher?
                // Let's rely on user clicking or just expand all by default when searching?
            }
            // For now, let's keep it simple.
            acc.push(menuCopy);
        }
        return acc;
    }, []);
});

// Watch query to auto-expand all when searching
watch(searchQuery, (newVal) => {
    if (newVal) {
        // Expand all parents that have children
        expandedMenus.value = menus.value.map(m => m.id);
    } else {
        expandedMenus.value = [];
    }
});

const onDragChange = async () => {
    // We will build a list of {id, order} to send to backend
    const updates = [];
    
    menus.value.forEach((menu, index) => {
        updates.push({ id: menu.id, order: index });
        if (menu.children && menu.children.length > 0) {
             menu.children.forEach((child, childIndex) => {
                 updates.push({ id: child.id, order: childIndex });
             });
        }
    });

    try {
        await api.post('/menus/reorder', updates);
    } catch (error) {
        console.error('Error saving menu order:', error);
        Alert.error('Error', 'Failed to save menu order');
    }
};

onMounted(() => {
    fetchMenus();
});
</script>
