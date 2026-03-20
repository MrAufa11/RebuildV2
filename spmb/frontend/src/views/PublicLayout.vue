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
    <Navbar v-if="!isHome" />
    <div :class="{ 'pt-24': !isHome }">
        <RouterView />
    </div>
    <Footer v-if="!isHome" />
  </div>
</template>
