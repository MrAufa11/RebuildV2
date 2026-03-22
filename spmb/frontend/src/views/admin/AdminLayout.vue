<template>
    <div class="bg-[#F8F9FC] dark:bg-darkbg text-gray-800 dark:text-gray-200 h-screen w-full flex overflow-hidden transition-colors duration-300">
        
        <!-- Sidebar -->
        <aside
            :class="[
                'bg-white dark:bg-darkcard border-r border-gray-100 dark:border-gray-700 flex flex-col z-30 flex-shrink-0 transition-all duration-300',
                isSidebarClosed ? 'w-20' : 'w-64'
            ]"
        >
            <div class="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-700/50 flex-shrink-0">
                <a href="#" class="flex items-center gap-3 w-full overflow-hidden">
                    <div class="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-brand-500/30">
                        <i class="fas fa-bolt"></i>
                    </div>
                    <span
                        class="text-xl font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap transition-all duration-300"
                        :class="{ 'opacity-0 w-0 overflow-hidden': isSidebarClosed }"
                    >
                        CMS
                    </span>
                </a>
            </div>
    
            <div class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                
                <template v-for="menu in filteredMenus" :key="menu.id">
                    <!-- Single Menu Item -->
                    <router-link 
                        v-if="!menu.children || menu.children.length === 0"
                        :to="menu.url || '#'" 
                        class="menu-link flex items-center gap-3 px-3 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg group transition-colors" 
                        :class="{ 'justify-center px-0': isSidebarClosed, 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300': $route.path === menu.url }"
                    >
                        <i :class="[menu.icon || 'fas fa-circle', 'w-5 text-center text-gray-400 group-hover:text-brand-600 transition-colors']"></i>
                        <span class="font-medium text-sm whitespace-nowrap" :class="{ 'hidden': isSidebarClosed }">{{ menu.label }}</span>
                    </router-link>

                    <!-- Dropdown Menu Item -->
                    <div v-else>
                        <button 
                            @click="toggleMenu(menu.id)"
                            class="w-full menu-link flex items-center gap-3 px-3 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg group transition-colors focus:outline-none"
                            :class="{ 'justify-center px-0': isSidebarClosed, 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300': openMenus.includes(menu.id) }"
                        >
                            <i :class="[menu.icon || 'fas fa-layer-group', 'w-5 text-center text-gray-400 group-hover:text-brand-600 transition-colors']"></i>
                            <span class="font-medium text-sm flex-1 whitespace-nowrap text-left" :class="{ 'hidden': isSidebarClosed }">{{ menu.label }}</span>
                            <i 
                                class="fas fa-chevron-down text-xs transition-transform duration-200" 
                                :class="{ 'hidden': isSidebarClosed, 'rotate-180': openMenus.includes(menu.id) }"
                            ></i>
                        </button>
                        
                        <!-- Submenu Items -->
                        <div 
                            v-show="openMenus.includes(menu.id) && !isSidebarClosed"
                            class="mt-1 space-y-1 pl-11 pr-2"
                          >
                            <router-link 
                                v-for="child in menu.children" 
                                :key="child.id"
                                :to="child.url || '#'"
                                class="block px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-md transition-colors"
                                :class="{ 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/10': $route.path === child.url }"
                            >
                                {{ child.label }}
                            </router-link>
                        </div>
                    </div>
                </template>

            </div>
    
            <div class="p-3 border-t border-gray-100 dark:border-gray-700/50 bg-white dark:bg-darkcard z-10">
                
                <button @click="logout" class="w-full menu-link flex items-center gap-3 px-3 py-2.5 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg group transition-colors mb-1" title="Log out" :class="{ 'justify-center px-0': isSidebarClosed }">
                    <i class="fas fa-sign-out-alt w-5 text-center group-hover:text-red-600 transition-colors"></i>
                    <span class="font-medium text-sm whitespace-nowrap" :class="{ 'hidden': isSidebarClosed }">Log out</span>
                </button>
    
                <div class="h-px bg-gray-100 dark:bg-gray-700 my-2 mx-2" :class="{ 'hidden': isSidebarClosed }"></div>
    
                <div v-if="currentUser" class="flex items-center gap-3 px-2 py-2 transition-all duration-300 overflow-hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg" :class="{ 'justify-center px-0': isSidebarClosed }">
                    <div class="h-9 w-9 rounded-full flex-shrink-0 bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold border border-gray-200 dark:border-gray-600">
                        {{ currentUser.username ? currentUser.username.substring(0, 2).toUpperCase() : '??' }}
                    </div>
                    <div class="overflow-hidden whitespace-nowrap" :class="{ 'hidden': isSidebarClosed }">
                        <p class="text-sm font-semibold text-gray-900 dark:text-white leading-none">{{ currentUser.username }}</p>
                        <p class="text-xs text-gray-500 truncate mt-1">{{ currentUser.email }}</p>
                    </div>
                </div>
            </div>
        </aside>
    
        <main class="flex-1 flex flex-col h-full overflow-hidden relative">
            <header class="flex items-center justify-between px-8 pt-6 pb-4 flex-shrink-0 bg-[#F8F9FC] dark:bg-darkbg z-20">
                <div class="flex items-center gap-4 flex-1">
                    <button @click="toggleSidebar" class="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors rounded-lg focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700/50">
                        <i class="fas fa-bars text-lg"></i>
                    </button>
                    <div class="relative w-full max-w-sm group hidden sm:block">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <i class="fas fa-search text-gray-400 group-focus-within:text-brand-500 transition-colors"></i>
                        </span>
                        <input type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2 bg-white dark:bg-darkcard border border-transparent focus:border-gray-200 dark:focus:border-gray-600 rounded-lg text-sm shadow-sm focus:ring-0 transition-all placeholder-gray-400 dark:text-white">
                    </div>
                </div>
                <div class="flex items-center gap-3">
                     <button @click="toggleTheme" class="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                        <i class="fas fa-sun theme-icon-sun"></i>
                        <i class="fas fa-moon theme-icon-moon"></i>
                    </button>
                   
                </div>
            </header>
    
            <div class="flex-1 overflow-y-auto px-8 pb-8">
                <router-view></router-view>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
import Alert from '../../assets/alert';

const router = useRouter();
const isSidebarClosed = ref(false); // Start open by default
const menus = ref([]);
const openMenus = ref([]);
const currentUser = ref(null);

const toggleSidebar = () => {
    isSidebarClosed.value = !isSidebarClosed.value;
};

const toggleMenu = (id) => {
    if (openMenus.value.includes(id)) {
        openMenus.value = openMenus.value.filter(menuId => menuId !== id);
    } else {
        openMenus.value.push(id);
    }
};

// Helper to slugify string for permission keys (matches RolesForm logic)
const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           
        .replace(/[^\w\-]+/g, '')       
        .replace(/\-\-+/g, '-')         
        .replace(/^-+/, '')             
        .replace(/-+$/, '');            
};

const hasPermission = (menuLabel) => {
    if (!currentUser.value) return false;
    const menuSlug = slugify(menuLabel);
    const requiredPermission = `${menuSlug}.read`;
    
    const userPermissions = currentUser.value.role ? currentUser.value.role.permissions : [];
    
    const permissionsList = Array.isArray(userPermissions) 
        ? userPermissions.map(p => typeof p === 'string' ? p : p.name) 
        : [];
        
    return permissionsList.includes(requiredPermission);
};

const filteredMenus = computed(() => {
    return menus.value;
});

const fetchCurrentUser = async () => {
    try {
        const response = await api.get('/auth/me', { params: { app_type: 'spmb' } });
        currentUser.value = response.data;
        
        // Build menu tree from backend data
        if (currentUser.value && currentUser.value.role && currentUser.value.role.menus) {
             menus.value = buildMenuTree(currentUser.value.role.menus);
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        // If auth fails, redirect to login
        router.push('/login');
    }
};

const buildMenuTree = (flatMenus) => {
    const map = {};
    const tree = [];
    const sortedMenus = [...flatMenus].sort((a, b) => a.order - b.order);

    sortedMenus.forEach(m => { 
        map[m.id] = { ...m, children: [] }; 
    });

    sortedMenus.forEach(m => {
        if (m.parent_id && map[m.parent_id]) {
            map[m.parent_id].children.push(map[m.id]);
        } else {
            tree.push(map[m.id]); // Roots
        }
    });
    return tree;
};

// Start logic: just load user (which loads menus)
const initialize = async () => {
    await fetchCurrentUser();
    // fetchMenus removed
};

const logout = async () => {
    try {
        await api.post('/auth/logout'); 
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/auth');
    } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/auth');
    }
};

// Dark mode logic
const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
};

onMounted(async () => {
    await initialize();

    // Check initial theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});
</script>

<style scoped>
/* Custom Scrollbar */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
.dark ::-webkit-scrollbar-thumb { background: #475569; }
</style>
