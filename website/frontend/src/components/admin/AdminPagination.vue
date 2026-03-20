<template>
    <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-darkcard px-4 py-3 sm:px-6 rounded-b-xl">
        <div class="flex flex-1 justify-between sm:hidden">
            <button @click="$emit('prev')" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button @click="$emit('next')" :disabled="currentPage === totalPages" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-50">Next</button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700 dark:text-gray-400">
                    Showing <span class="font-medium">{{ from }}</span> to <span class="font-medium">{{ to }}</span> of <span class="font-medium">{{ total }}</span> results
                </p>
            </div>
            <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button @click="$emit('prev')" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                        <span class="sr-only">Previous</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" /></svg>
                    </button>
                    <!-- Simple implementation: Page numbers -->
                    <template v-for="page in pages" :key="page">
                         <button @click="$emit('page', page)" 
                                 :class="[
                                     page === currentPage 
                                     ? 'relative z-10 inline-flex items-center bg-brand-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600' 
                                     : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0'
                                 ]"
                         >
                            {{ page }}
                         </button>
                    </template>
                    
                    <button @click="$emit('next')" :disabled="currentPage === totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                        <span class="sr-only">Next</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" /></svg>
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    total: { type: Number, required: true },
    perPage: { type: Number, required: true },
    currentPage: { type: Number, required: true }
});

const emit = defineEmits(['prev', 'next', 'page']);

const totalPages = computed(() => Math.ceil(props.total / props.perPage));
const from = computed(() => (props.currentPage - 1) * props.perPage + 1);
const to = computed(() => Math.min(props.currentPage * props.perPage, props.total));

// Generate array of page numbers to show
// Simple version: Show 1 to Total, but maybe limit to 5 if too many?
// For now let's just show up to 7 pages around current
const pages = computed(() => {
    const p = [];
    const maxVisible = 5;
    let start = Math.max(1, props.currentPage - 2);
    let end = Math.min(totalPages.value, start + maxVisible - 1);
    
    // Adjust start if end is max
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) p.push(i);
    return p;
});
</script>
