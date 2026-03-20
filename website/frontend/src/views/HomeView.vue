<template>
  <main>
    <Hero />
    <WelcomeSection />
    <Teacher />
    <NewsSection />
    <GallerySection />
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
import Hero from '../components/Hero.vue';
import WelcomeSection from '../components/WelcomeSection.vue';
import NewsSection from '../components/NewsSection.vue';
import GallerySection from '../components/GallerySection.vue';
import Teacher from '../components/Teacher.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

onMounted(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
});
</script>
