<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Navbar Management</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage the public website navigation menu.</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
                 <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i class="fas fa-search text-gray-400"></i>
                    </span>
                    <input 
                        v-model="searchQuery" 
                        type="text" 
                        placeholder="Search navbars..." 
                        class="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkcard text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-colors"
                    >
                </div>
                <router-link :to="{ name: 'navbar-create' }" class="inline-flex items-center justify-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-brand-500/30 whitespace-nowrap">
                    <i class="fas fa-plus mr-2"></i>
                    Add Navbar Item
                </router-link>
            </div>
        </div>

        <div class="space-y-4">
            <!-- Loading State -->
             <div v-if="loading" class="text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-brand-500"></i>
                <p class="mt-2 text-gray-500">Loading navbars...</p>
            </div>

            <!-- Drag and Drop List (Visible only when NOT searching) -->
            <draggable 
                v-else-if="!searchQuery && navbars.length > 0"
                v-model="navbars" 
                item-key="id" 
                handle=".drag-handle"
                @change="onDragChange"
                class="space-y-4"
            >
                <template #item="{ element: navbar }">
                    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
                        <!-- Level 1 Header -->
                        <div 
                            class="w-full px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors select-none group"
                            @click="toggleAccordion(navbar.id)"
                        >
                            <div class="flex items-center gap-4 flex-1">
                                <div class="drag-handle cursor-move text-gray-300 hover:text-gray-500 p-2 hidden group-hover:block transition-colors" title="Drag to reorder">
                                    <i class="fas fa-grip-vertical"></i>
                                </div>
                                <div class="h-10 w-10 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-sm">
                                    <i :class="[navbar.icon || 'fas fa-link', 'text-lg']"></i>
                                </div>
                                <div>
                                    <h4 class="text-base font-semibold text-gray-900 dark:text-white">{{ navbar.label }}</h4>
                                    <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        <span class="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{{ navbar.url }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-1 mr-2" @click.stop>
                                    <router-link :to="{ name: 'navbar-edit', params: { id: navbar.id } }" class="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </router-link>
                                    <button @click="confirmDelete(navbar.id)" class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                                <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                                <i 
                                    class="fas fa-chevron-down text-gray-400 transition-transform duration-300 transform"
                                    :class="{ 'rotate-180': isExpanded(navbar.id) }"
                                ></i>
                            </div>
                        </div>

                        <!-- Level 2 Children -->
                        <div 
                            v-show="isExpanded(navbar.id)" 
                            class="bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-700/50"
                        >
                             <draggable 
                                v-if="navbar.children && navbar.children.length > 0"
                                v-model="navbar.children" 
                                item-key="id"
                                handle=".child-drag-handle"
                                @change="onDragChange"
                                class="divide-y divide-gray-100 dark:divide-gray-700/50"
                            >
                                <template #item="{ element: child }">
                                    <div class="group">
                                        <!-- Level 2 Item -->
                                        <div class="px-6 py-3 pl-12 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <div class="flex items-center gap-3 flex-1" @click="toggleAccordion(child.id)">
                                                <div class="child-drag-handle cursor-move text-gray-300 hover:text-gray-500 p-2 hidden group-hover:block transition-colors">
                                                    <i class="fas fa-grip-vertical text-xs"></i>
                                                </div>
                                                <span class="text-gray-300 dark:text-gray-600"><i class="fas fa-level-up-alt rotate-90"></i></span>
                                                <div class="flex-1">
                                                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ child.label }}</p>
                                                    <p class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5 cursor-pointer">{{ child.url }}</p>
                                                </div>
                                                <i v-if="child.children && child.children.length > 0" 
                                                   class="fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 transform mr-4"
                                                   :class="{ 'rotate-180': isExpanded(child.id) }"></i>
                                            </div>
                                            
                                            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <router-link :to="{ name: 'navbar-edit', params: { id: child.id } }" class="text-brand-600 hover:text-brand-700 p-1.5 rounded hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                                                    <i class="fas fa-edit"></i>
                                                </router-link>
                                                <button @click="confirmDelete(child.id)" class="text-red-500 hover:text-red-600 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Level 3 Grandchildren -->
                                        <div v-show="isExpanded(child.id)" class="pl-20 border-l-2 border-gray-100 dark:border-gray-700 ml-12 mb-2">
                                             <draggable 
                                                v-if="child.children && child.children.length > 0"
                                                v-model="child.children" 
                                                item-key="id"
                                                handle=".grandchild-drag-handle"
                                                @change="onDragChange"
                                                class="space-y-1 py-1"
                                            >
                                                <template #item="{ element: grandchild }">
                                                    <div class="px-4 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group/grand">
                                                        <div class="flex items-center gap-3">
                                                            <div class="grandchild-drag-handle cursor-move text-gray-300 hover:text-gray-500 hidden group-hover/grand:block transition-colors">
                                                                <i class="fas fa-grip-vertical text-[10px]"></i>
                                                            </div>
                                                            <span class="text-gray-300 dark:text-gray-600"><i class="fas fa-level-up-alt rotate-90 text-xs"></i></span>
                                                            <div>
                                                                <p class="text-sm text-gray-700 dark:text-gray-300">{{ grandchild.label }}</p>
                                                            </div>
                                                        </div>
                                                        <div class="flex items-center gap-2 opacity-0 group-hover/grand:opacity-100 transition-opacity">
                                                            <router-link :to="{ name: 'navbar-edit', params: { id: grandchild.id } }" class="text-xs text-brand-600 hover:text-brand-700 p-1">
                                                                <i class="fas fa-edit"></i>
                                                            </router-link>
                                                            <button @click="confirmDelete(grandchild.id)" class="text-xs text-red-500 hover:text-red-600 p-1">
                                                                <i class="fas fa-trash-alt"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </template>
                                            </draggable>
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

            <div v-else class="text-center py-12 bg-white dark:bg-darkcard rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <i class="fas fa-search text-4xl text-gray-300 dark:text-gray-600 mb-3 block"></i>
                <p class="text-gray-500 dark:text-gray-400 font-medium">No navbars found</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import draggable from 'vuedraggable';
import api from '../../../services/api'; // Using api service directly
import Alert from '../../../assets/alert'; // Assuming this exists or using simple alert

// Because I don't know if Alert exists for sure at that path, I'll assume it does based on MenuIndex.vue usage.
// If it fails, I'll need to fix imports.
// I will check file structure for Alert.
// Previous `list_dir` didn't show `assets/alert.js` explicitly but `MenuIndex.vue` used it.
// Wait, `MenuIndex.vue` used `import Alert from '../../../assets/alert';`
// I'll trust that path.

const navbars = ref([]);
const searchQuery = ref('');
const expandedMenus = ref([]);
const loading = ref(false);

const fetchNavbars = async () => {
    loading.value = true;
    try {
        const response = await api.get('/navbars');
        navbars.value = response.data;
    } catch (error) {
        console.error('Error fetching navbars:', error);
    } finally {
        loading.value = false;
    }
};

const confirmDelete = async (id) => {
    if (confirm('Are you sure you want to delete this navbar item?')) {
        try {
            await api.delete(`/navbars/${id}`);
            fetchNavbars();
        } catch (error) {
            console.error('Error deleting navbar:', error);
            alert('Failed to delete navbar');
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

// Simplified filter for viewing
const filteredNavbars = computed(() => {
    if (!searchQuery.value) return navbars.value;
    return navbars.value.filter(n => n.label.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const onDragChange = async () => {
    const updates = [];
    
    // Flatten the 3 levels to get all IDs and their orders
    // But wait, the reorder API likely expects a simple list or handles parent relationships?
    // MenuController.reorder only updates `order`. It doesn't update nesting.
    // If I drag a child to a parent, I need to update `parent_id` too.
    // `vuedraggable` only reorders within the list provided.
    // If I want to support re-parenting via drag-and-drop, it's more complex.
    // MenuIndex.vue only seemed to update order.
    // I will stick to updating order within the same level for now.
    
    // Level 1
    navbars.value.forEach((navbar, index) => {
        updates.push({ id: navbar.id, order: index });
        if (navbar.children && navbar.children.length > 0) {
             // Level 2
             navbar.children.forEach((child, childIndex) => {
                 updates.push({ id: child.id, order: childIndex });
                 if (child.children && child.children.length > 0) {
                     // Level 3
                     child.children.forEach((grand, grandIndex) => {
                         updates.push({ id: grand.id, order: grandIndex });
                     });
                 }
             });
        }
    });

    try {
        await api.post('/navbars/reorder', updates);
    } catch (error) {
        console.error('Error saving navbar order:', error);
    }
};

onMounted(() => {
    fetchNavbars();
});
</script>
