<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const modules = [Autoplay, EffectFade, Pagination];
</script>

<template>
  <div class="swiper-hero relative z-0">
    <swiper
      :modules="modules"
      :effect="'fade'"
      :speed="1500"
      :autoplay="{
        delay: 6000,
        disableOnInteraction: false,
      }"
      :pagination="{
        clickable: true,
      }"
      class="mySwiper h-full"
    >
      <swiper-slide class="relative">
        <img
          src="https://images.unsplash.com/photo-1768772123991-b17e721119a7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero 1"
          class="w-full h-full object-cover ken-burns"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/40 to-white"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center text-center">
          <div class="max-w-4xl px-6 pt-20" data-aos="fade-up">
            <span
              class="inline-block py-1.5 px-4 border border-white/30 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
            >
              Penerimaan Siswa Baru 2026/2027
            </span>
            <h1
              class="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-lg"
            >
              Mewujudkan Generasi <br />
              <span class="text-brand-orange">Cerdas & Berakhlak</span>
            </h1>
            <p
              class="text-lg text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
            >
              Kami memadukan keunggulan akademik modern dengan nilai-nilai
              spiritual pesantren untuk masa depan buah hati Anda.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                class="bg-brand-orange text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 transform hover:-translate-y-1"
              >
                Daftar Sekarang
              </a>
              <a
                href="#sambutan"
                class="group px-8 py-4 rounded-full border border-white text-white font-bold hover:bg-white hover:text-brand-green transition flex items-center gap-2"
              >
                <i
                  class="fas fa-user-tie text-xl group-hover:scale-110 transition"
                ></i>
                Sambutan
              </a>
            </div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide class="relative">
        <img
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
           alt="Hero 2"
           class="w-full h-full object-cover ken-burns"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/40 to-white"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center text-center">
          <div class="max-w-4xl px-6 pt-20">
            <span
              class="inline-block py-1.5 px-4 bg-brand-green text-white text-xs font-bold uppercase tracking-widest mb-6 rounded-full shadow-lg"
            >
              Prestasi Membanggakan
            </span>
            <h1
              class="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-lg"
            >
              Juara Umum KSM <br />
              Tingkat Provinsi
            </h1>
            <a
              href="#galeri"
              class="text-white font-bold border-b-2 border-brand-orange pb-1 hover:text-brand-orange transition text-lg"
              >Lihat Galeri Prestasi</a
            >
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <a
      href="#sambutan"
      class="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 text-slate-400/80 hover:text-brand-orange transition flex flex-col items-center gap-2 cursor-pointer group"
    >
      <span
        class="tracking-[0.2em] uppercase text-[10px] font-bold group-hover:translate-y-1 transition"
        >Scroll Down</span
      >
      <div
        class="w-8 h-12 border-2 border-slate-400/50 rounded-full flex justify-center pt-2 group-hover:border-brand-orange transition"
      >
        <div
          class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce-slow group-hover:bg-brand-orange"
        ></div>
      </div>
    </a>
  </div>
</template>

<style>

</style>
