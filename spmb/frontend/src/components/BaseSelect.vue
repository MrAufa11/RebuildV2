<template>
    <div class="base-select">
        <label v-if="inputLabel" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ inputLabel }}
        </label>
        <v-select
            v-bind="$attrs"
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
            :options="options"
            :placeholder="placeholder"
            class="style-chooser"
        >
            <template #no-options="{ search, searching }">
                <template v-if="searching">
                    No results found for <em>{{ search }}</em>.
                </template>
                <em v-else style="opacity: 0.5">Start typing to search...</em>
            </template>
        </v-select>
    </div>
</template>

<script setup>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

defineProps({
    inputLabel: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Number, Object],
        default: null
    },
    options: {
        type: Array,
        default: () => []
    },
    placeholder: {
        type: String,
        default: 'Select option...'
    }
});

defineEmits(['update:modelValue']);
</script>

<style>
/* Override vue-select styles to match Tailwind inputs */
:root {
    --vs-colors--lightest: rgba(60, 60, 60, 0.26);
    --vs-colors--light: rgba(60, 60, 60, 0.5);
    --vs-colors--dark: #333;
    --vs-colors--darkest: rgba(0, 0, 0, 0.15);

    /* Text */
    --vs-search-input-color: inherit;
    --vs-search-input-placeholder-color: inherit;

    /* Borders */
    --vs-border-color: #d1d5db; /* gray-300 */
    --vs-border-width: 1px;
    --vs-border-style: solid;
    --vs-border-radius: 0.5rem; /* rounded-lg */

    /* Controls */
    --vs-controls-color: #6b7280; /* gray-500 */
    --vs-controls-size: 1;
    --vs-controls--deselect-text-shadow: 0 1px 0 #fff;

    /* Selected */
    --vs-selected-bg: #f0f0f0;
    --vs-selected-color: #333;
    --vs-selected-border-color: #d1d5db;
    --vs-selected-border-style: solid;
    --vs-selected-border-width: 1px;

    /* Dropdown */
    --vs-dropdown-bg: #fff;
    --vs-dropdown-color: inherit;
    --vs-dropdown-z-index: 1000;
    --vs-dropdown-min-width: 160px;
    --vs-dropdown-max-height: 350px;
    --vs-dropdown-box-shadow: 0px 3px 6px 0px #d1d5db;
}

/* Dark mode overrides */
.dark {
    --vs-dropdown-bg: #1e293b; /* darkcard */
    --vs-dropdown-color: #fff;
    --vs-border-color: #4b5563; /* gray-600 */
    --vs-search-input-color: #fff;
    --vs-selected-color: #eee;
    --vs-controls-color: #9ca3af; /* gray-400 */
}

.style-chooser .vs__search::placeholder,
.style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
    border-color: var(--vs-border-color);
}

.dark .style-chooser .vs__search::placeholder {
    color: #9ca3af;
}

.dark .style-chooser .vs__dropdown-toggle {
    background-color: #0f172a; /* darkbg */
    color: white;
}

.dark .style-chooser .vs__selected {
    color: white;
}

.dark .style-chooser .vs__dropdown-option {
    color: #e2e8f0;
}

.dark .style-chooser .vs__dropdown-option--highlight {
    background-color: #4f46e5; /* brand-600 */
    color: white;
}

/* General sizing to match inputs */
.vs__dropdown-toggle {
    padding-top: 5px;
    padding-bottom: 5px;
}
</style>
