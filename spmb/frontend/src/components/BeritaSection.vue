<template>
    <section class="py-24 bg-slate-50/50" id="berita">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex justify-between items-end mb-16" data-aos="fade-up">
                <div>
                    <h2 class="text-3xl font-serif font-bold text-dark">Kabar Al-Mawahib</h2>
                    <div class="h-1 w-20 bg-brand-green mt-4 rounded-full"></div>
                </div>
                <router-link to="/news" class="hidden md:flex items-center gap-2 text-slate-500 hover:text-brand-green transition font-medium">
                    Lihat Arsip Berita <i class="fas fa-external-link-alt text-xs"></i>
                </router-link>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
                <router-link to="/news/tim-robotik" class="group block" data-aos="fade-up" data-aos-delay="0">
                    <div class="overflow-hidden rounded-[1.5rem] mb-6 relative">
                        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" loading="lazy" class="w-full h-72 object-cover transform group-hover:scale-105 transition duration-700 ease-out">
                        <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-orange uppercase tracking-wide shadow-sm">Prestasi</div>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-dark mb-3 group-hover:text-brand-green transition leading-snug">Tim Robotik Raih Emas di Kompetisi Nasional</h3>
                        <p class="text-slate-500 line-clamp-2 mb-4">Inovasi teknologi pertanian berbasis IoT karya santri Al-Mawahib berhasil memukau juri.</p>
                        <span class="text-sm text-slate-400 font-medium">20 Januari 2026</span>
                    </div>
                </router-link>
                 <router-link to="/news/peringatan-maulid" class="group block" data-aos="fade-up" data-aos-delay="100">
                    <div class="overflow-hidden rounded-[1.5rem] mb-6 relative">
                        <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" loading="lazy" class="w-full h-72 object-cover transform group-hover:scale-105 transition duration-700 ease-out">
                        <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-green uppercase tracking-wide shadow-sm">Kegiatan</div>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-dark mb-3 group-hover:text-brand-green transition leading-snug">Peringatan Maulid Nabi: Meneladani Akhlak Rasulullah</h3>
                        <p class="text-slate-500 line-clamp-2 mb-4">Ribuan santri dan wali murid hadir dalam pengajian akbar yang penuh khidmat.</p>
                        <span class="text-sm text-slate-400 font-medium">18 Januari 2026</span>
                    </div>
                </router-link>
                 <router-link to="/news/pentingnya-adab" class="group block" data-aos="fade-up" data-aos-delay="200">
                    <div class="overflow-hidden rounded-[1.5rem] mb-6 relative">
                        <img src="https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" loading="lazy" class="w-full h-72 object-cover transform group-hover:scale-105 transition duration-700 ease-out">
                        <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wide shadow-sm">Kajian</div>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-dark mb-3 group-hover:text-brand-green transition leading-snug">Pentingnya Adab Sebelum Ilmu dalam Islam</h3>
                        <p class="text-slate-500 line-clamp-2 mb-4">Kajian rutin kitab Ta'lim Muta'allim bersama KH. Abdullah Gymnastiar.</p>
                        <span class="text-sm text-slate-400 font-medium">15 Januari 2026</span>
                    </div>
                </router-link>
            </div>
        </div>
    </section>
</template>
