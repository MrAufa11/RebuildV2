<script setup>
import { onMounted, watch } from 'vue';
import { RouterView } from 'vue-router'
import { useSettings } from './composables/useSettings';

const { settings, fetchSettings, getSetting } = useSettings();

onMounted(async () => {
    await fetchSettings();
});

watch(() => settings.value.site_favicon, (newFavicon) => {
    if (newFavicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = newFavicon;
    }
});
</script>

<template>
  <RouterView />
</template>

<style>
html {
    scroll-behavior: smooth;
}
</style>
