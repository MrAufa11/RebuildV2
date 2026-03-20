<script setup>
import { computed } from 'vue';
import { useRoute, RouterView } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

const route = useRoute();
const isHome = computed(() => route.path === '/');
</script>

<template>
  <div class="relative min-h-screen">
    <Navbar />
    <div :class="{ 'pt-24': !isHome }">
        <RouterView />
    </div>
    <Footer />
  </div>
</template>
