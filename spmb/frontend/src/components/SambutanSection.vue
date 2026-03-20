<template>
    <section class="pb-24 pt-24 scroll-mt-20" id="sambutan">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col lg:flex-row gap-16 items-center">
                <div class="lg:w-1/2 relative" data-aos="fade-right">
                    <div class="absolute -top-10 -left-10 w-40 h-40 bg-green-50 rounded-full blur-3xl -z-10"></div>
                    <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                         loading="lazy"
                         class="rounded-[2.5rem] shadow-2xl shadow-slate-200 w-full object-cover h-[500px]">
                    <div class="absolute bottom-8 right-8 bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/50 max-w-xs">
                        <div class="flex items-center gap-3 mb-2">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" loading="lazy" class="w-8 h-8 rounded-full">
                            <span class="text-xs font-bold text-slate-600">Drs. H. Ahmad Fauzi</span>
                        </div>
                        <p class="text-sm font-serif italic text-slate-800">"Pendidikan adalah senjata paling mematikan untuk mengubah dunia."</p>
                    </div>
                </div>
                <div class="lg:w-1/2" data-aos="fade-left">
                    <span class="text-brand-orange font-bold tracking-widest uppercase text-xs mb-2 block">Sambutan Kepala Madrasah</span>
                    <h2 class="text-4xl md:text-5xl font-serif font-bold text-dark mb-6 leading-[1.15]">
                        Membangun Fondasi <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-teal-500">Karakter Qur'ani</span> di Era Digital
                    </h2>
                    <p class="text-lg text-slate-500 mb-8 leading-relaxed">
                        Selamat datang di MA Bina Insan Mulia Al-Mawahib. Kami percaya bahwa kecerdasan intelektual harus berjalan beriringan dengan kematangan spiritual. Kurikulum kami dirancang untuk menjawab tantangan zaman tanpa mencabut akar tradisi keislaman.
                    </p>
                    <div class="grid grid-cols-3 gap-8 border-t border-slate-100 pt-8 mb-8">
                        <div><span class="block text-3xl font-bold text-dark">232</span><span class="text-xs text-slate-400 uppercase tracking-wide">Siswa</span></div>
                        <div><span class="block text-3xl font-bold text-dark">52</span><span class="text-xs text-slate-400 uppercase tracking-wide">Guru</span></div>
                        <div><span class="block text-3xl font-bold text-dark">A</span><span class="text-xs text-slate-400 uppercase tracking-wide">Akreditasi</span></div>
                    </div>
                    <router-link to="/profil" class="inline-flex items-center gap-2 text-brand-green font-bold hover:text-brand-orange transition group">
                        Baca Selengkapnya <i class="fas fa-arrow-right transform group-hover:translate-x-1 transition"></i>
                    </router-link>
                </div>
            </div>
        </div>
    </section>
</template>
