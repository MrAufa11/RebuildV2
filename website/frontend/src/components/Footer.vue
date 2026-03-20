<template>
  <footer class="bg-white border-t border-slate-100 pt-20 pb-10">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center text-white text-xl"><i class="fas fa-school"></i></div>
            <span class="font-bold text-xl text-dark font-serif">Al-Mawahib</span>
          </div>
          <p class="text-slate-500 leading-relaxed mb-6 text-sm">Mencetak generasi Rabbani yang unggul dalam prestasi dan terpuji dalam pekerti.</p>
        </div>
        <div>
          <h4 class="font-bold text-dark mb-6">Jelajahi</h4>
          <ul class="space-y-3 text-slate-500 text-sm">
            <li><router-link to="/profil" class="hover:text-brand-orange">Profil Sekolah</router-link></li>
            <li><router-link to="/teachers" class="hover:text-brand-orange">Tenaga Pendidik</router-link></li>
            <li><a href="http://localhost:5174" class="hover:text-brand-orange">PPDB 2026</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-dark mb-6">Kontak</h4>
          <ul class="space-y-3 text-slate-500 text-sm">
            <li><i class="fas fa-map-marker-alt text-brand-orange"></i> Jl. Cicukang No. 96, Bandung</li>
            <li><i class="fas fa-phone text-brand-orange"></i> (022) 1234-5678</li>
            <li><i class="fas fa-envelope text-brand-orange"></i> info@almawahib.sch.id</li>
          </ul>
        </div>
         <div>
            <h4 class="font-bold text-dark mb-6">Lokasi</h4>
             <div class="rounded-xl overflow-hidden h-32 bg-slate-100 shadow-inner">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.366479708688!2d107.5583!3d-6.966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTcnNTcuNiJTIDEwN8KwMzMnMjkuOSJF!5e0!3m2!1sen!2sid!4v1600000000000!5m2!1sen!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
             </div>
        </div>
      </div>
      <div class="border-t border-slate-100 pt-8 text-center text-slate-400 text-xs">© 2026 MA Bina Insan Mulia Al Mawahib. All rights reserved.</div>
    </div>
  </footer>
</template>
