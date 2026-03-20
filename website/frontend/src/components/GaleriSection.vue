<template>
    <section class="py-24 bg-white overflow-hidden" id="galeri">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16" data-aos="fade-up">
                <span class="text-brand-orange font-bold tracking-widest uppercase text-xs">Dokumentasi</span>
                <h2 class="text-4xl font-serif font-bold text-dark mt-2">Galeri Aktivitas</h2>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[500px]">
                <div class="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer" data-aos="zoom-in">
                    <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                    <div class="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition duration-500 translate-y-4 group-hover:translate-y-0 font-bold text-lg">Upacara Kemerdekaan RI</div>
                </div>
                <div class="relative rounded-3xl overflow-hidden group cursor-pointer" data-aos="fade-up" data-aos-delay="100"><img src="https://images.unsplash.com/photo-1564981797816-1043664bf78d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" class="w-full h-full object-cover group-hover:scale-105 transition duration-700"></div>
                <div class="relative rounded-3xl overflow-hidden group cursor-pointer" data-aos="fade-up" data-aos-delay="200"><img src="https://images.unsplash.com/photo-1427504746696-ea5ca7f04800?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" class="w-full h-full object-cover group-hover:scale-105 transition duration-700"></div>
                <div class="col-span-2 relative rounded-3xl overflow-hidden group cursor-pointer" data-aos="fade-up" data-aos-delay="300">
                    <img src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                    <div class="absolute inset-0 bg-brand-green/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"><span class="text-white font-bold border border-white px-6 py-2 rounded-full hover:bg-white hover:text-brand-green transition">Lihat Semua Galeri</span></div>
                </div>
            </div>
        </div>
    </section>
</template>
