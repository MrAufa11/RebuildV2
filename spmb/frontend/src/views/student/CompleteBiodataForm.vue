<template>
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <!-- Header with Internal Tabs -->
        <div class="bg-slate-50 border-b border-slate-100 p-4 sticky top-0 z-10">
             <div class="flex flex-wrap gap-2">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                    :class="activeTab === tab.id ? 'bg-brand-orange text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'"
                    class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                    <i :class="tab.icon"></i>
                    {{ tab.label }}
                </button>
             </div>
        </div>
        
        <form @submit.prevent="submitForm" class="p-8">
            <!-- Section: Data Pribadi -->
            <div v-show="activeTab === 'pribadi'" class="space-y-6 animate-fade-in-up">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">NIK / Nomor Akte <span class="text-red-500">*</span></label>
                        <input v-model="internalData.nik" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all" placeholder="16 digit NIK">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">NISN <span class="text-red-500">*</span></label>
                        <input v-model="internalData.nisn" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all" placeholder="Nomor Induk Siswa Nasional">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Anak Ke- <span class="text-red-500">*</span></label>
                        <input v-model="internalData.anakKe" required type="number" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Jumlah Saudara Kandung <span class="text-red-500">*</span></label>
                        <input v-model="internalData.jumlahSaudara" required type="number" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Status Anak</label>
                        <select v-model="internalData.statusAnak" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all">
                            <option value="Kandung">Kandung</option>
                            <option value="Tiri">Tiri</option>
                            <option value="Angkat">Angkat</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Bahasa Sehari-hari <span class="text-red-500">*</span></label>
                        <select v-model="internalData.bahasa" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all">
                            <option value="B. Indonesia">B. Indonesia</option>
                            <option value="B. Daerah">B. Daerah</option>
                            <option value="B. Inggris">B. Inggris</option>
                            <option value="B. Arab">B. Arab</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Section: Alamat Detail -->
            <div v-show="activeTab === 'alamat'" class="space-y-6 animate-fade-in-up">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Jalan <span class="text-red-500">*</span></label>
                        <textarea v-model="internalData.jalan" required rows="2" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all" placeholder="Nama Jalan, Blok, No Rumah..."></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Provinsi <span class="text-red-500">*</span></label>
                        <input v-model="internalData.provinsi" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kota / Kabupaten <span class="text-red-500">*</span></label>
                        <input v-model="internalData.kota" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kecamatan <span class="text-red-500">*</span></label>
                        <input v-model="internalData.kecamatan" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kelurahan / Desa <span class="text-red-500">*</span></label>
                        <input v-model="internalData.kelurahan" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Dusun <span class="text-red-500">*</span></label>
                        <input v-model="internalData.dusun" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">RT <span class="text-red-500">*</span></label>
                            <input v-model="internalData.rt" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-center">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">RW <span class="text-red-500">*</span></label>
                            <input v-model="internalData.rw" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-center">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kode Pos <span class="text-red-500">*</span></label>
                            <input v-model="internalData.kodePos" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section: Kesehatan -->
            <div v-show="activeTab === 'kesehatan'" class="space-y-6 animate-fade-in-up">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Karakteristik Calon Peserta Didik <span class="text-red-500">*</span></label>
                        <div class="flex gap-6">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" value="Berkebutuhan Khusus" v-model="internalData.karakteristik" class="text-brand-orange focus:ring-brand-orange">
                                <span class="text-sm">Berkebutuhan Khusus</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" value="Tidak Berkebutuhan Khusus" v-model="internalData.karakteristik" class="text-brand-orange focus:ring-brand-orange">
                                <span class="text-sm">Tidak Berkebutuhan Khusus</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Golongan Darah</label>
                        <select v-model="internalData.golDarah" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20">
                            <option value="O">O</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="AB">AB</option>
                            <option value="-">N/A</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Sakit Yang Diderita</label>
                        <input v-model="internalData.sakit" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="Isi jika ada">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Sakit Yang Pernah Diderita</label>
                        <input v-model="internalData.pernah_sakit" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="Isi jika ada">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Berat Badan (kg)</label>
                        <div class="relative flex items-center">
                            <input v-model="internalData.beratBadan" type="number" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm pr-12">
                            <span class="absolute right-4 text-xs font-bold text-slate-400">KG</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Tinggi Badan (cm)</label>
                        <div class="relative flex items-center">
                            <input v-model="internalData.tinggiBadan" type="number" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm pr-12">
                            <span class="absolute right-4 text-xs font-bold text-slate-400">CM</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section: Ayah -->
            <div v-show="activeTab === 'ayah'" class="space-y-6 animate-fade-in-up">
                <h3 class="font-bold text-slate-800 text-sm border-l-4 border-brand-orange pl-3">Data Identitas Ayah Kandung</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">NIK Ayah <span class="text-red-500">*</span></label>
                        <input v-model="internalData.nikAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap Ayah Kandung <span class="text-red-500">*</span></label>
                        <input v-model="internalData.namaAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Tempat Lahir Ayah <span class="text-red-500">*</span></label>
                        <input v-model="internalData.tempatLahirAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Tanggal Lahir Ayah <span class="text-red-500">*</span></label>
                        <input v-model="internalData.tanggalLahirAyah" required type="date" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Agama <span class="text-red-500">*</span></label>
                        <select v-model="internalData.agamaAyah" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                            <option value="Islam">Islam</option>
                            <option value="Kristen">Kristen</option>
                            <option value="Katolik">Katolik</option>
                            <option value="Hindu">Hindu</option>
                            <option value="Budha">Budha</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Status Ayah <span class="text-red-500">*</span></label>
                        <select v-model="internalData.statusAyah" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                            <option value="Masih Hidup">Masih Hidup</option>
                            <option value="Sudah Meninggal">Sudah Meninggal</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Pendidikan Terakhir <span class="text-red-500">*</span></label>
                        <input v-model="internalData.pendidikanAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Program Studi / Jurusan <span class="text-red-500">*</span></label>
                        <input v-model="internalData.jurusanAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Sekolah / Universitas <span class="text-red-500">*</span></label>
                        <input v-model="internalData.sekolahAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Pekerjaan Ayah <span class="text-red-500">*</span></label>
                        <input v-model="internalData.pekerjaanAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Penghasilan Ayah <span class="text-red-500">*</span></label>
                        <input v-model="internalData.penghasilanAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="Contoh: 3-5 Juta">
                    </div>
                     <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Instansi <span class="text-red-500">*</span></label>
                        <input v-model="internalData.instansiAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Jabatan <span class="text-red-500">*</span></label>
                        <input v-model="internalData.jabatanAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                </div>

                <h3 class="font-bold text-slate-800 text-sm border-l-4 border-brand-orange pl-3 mt-8">Alamat Domisili Ayah Kandung</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Jalan <span class="text-red-500">*</span></label>
                        <textarea v-model="internalData.jalanAyah" required rows="2" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm"></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Provinsi <span class="text-red-500">*</span></label>
                        <input v-model="internalData.provinsiAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kota / Kabupaten <span class="text-red-500">*</span></label>
                        <input v-model="internalData.kotaAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kecamatan <span class="text-red-500">*</span></label>
                        <input v-model="internalData.kecamatanAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kelurahan / Desa <span class="text-red-500">*</span></label>
                         <input v-model="internalData.kelurahanAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Dusun <span class="text-red-500">*</span></label>
                         <input v-model="internalData.dusunAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">RT <span class="text-red-500">*</span></label>
                            <input v-model="internalData.rtAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">RW <span class="text-red-500">*</span></label>
                            <input v-model="internalData.rwAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kode Pos <span class="text-red-500">*</span></label>
                            <input v-model="internalData.kodePosAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                        </div>
                    </div>
                </div>

                <h3 class="font-bold text-slate-800 text-sm border-l-4 border-brand-orange pl-3 mt-8">Kontak Ayah Kandung</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="lg:col-span-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">No. HP / WA Ayah <span class="text-red-500">*</span></label>
                        <input v-model="internalData.noHpAyah" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div class="lg:col-span-2">
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Email Ayah <span class="text-red-500">*</span></label>
                         <input v-model="internalData.emailAyah" required type="email" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Instagram Ayah</label>
                         <input v-model="internalData.igAyah" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="@username">
                    </div>
                    <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Facebook Ayah</label>
                         <input v-model="internalData.fbAyah" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                </div>
            </div>

            <!-- Section: Ibu -->
            <div v-show="activeTab === 'ibu'" class="space-y-6 animate-fade-in-up">
                <h3 class="font-bold text-slate-800 text-sm border-l-4 border-brand-orange pl-3">Data Identitas Ibu Kandung</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">NIK Ibu <span class="text-red-500">*</span></label>
                        <input v-model="internalData.nikIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap Ibu Kandung <span class="text-red-500">*</span></label>
                        <input v-model="internalData.namaIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Tempat Lahir Ibu <span class="text-red-500">*</span></label>
                        <input v-model="internalData.tempatLahirIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Tanggal Lahir Ibu <span class="text-red-500">*</span></label>
                        <input v-model="internalData.tanggalLahirIbu" required type="date" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Agama <span class="text-red-500">*</span></label>
                        <select v-model="internalData.agamaIbu" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                             <option value="Islam">Islam</option>
                             <option value="Kristen">Kristen</option>
                             <option value="Katolik">Katolik</option>
                             <option value="Hindu">Hindu</option>
                             <option value="Budha">Budha</option>
                             <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Status Ibu <span class="text-red-500">*</span></label>
                        <select v-model="internalData.statusIbu" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                            <option value="Masih Hidup">Masih Hidup</option>
                            <option value="Sudah Meninggal">Sudah Meninggal</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Pendidikan Terakhir <span class="text-red-500">*</span></label>
                        <input v-model="internalData.pendidikanIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Program Studi / Jurusan <span class="text-red-500">*</span></label>
                        <input v-model="internalData.jurusanIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div class="md:col-span-2">
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Sekolah / Universitas <span class="text-red-500">*</span></label>
                         <input v-model="internalData.sekolahIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Pekerjaan Ibu <span class="text-red-500">*</span></label>
                        <input v-model="internalData.pekerjaanIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Penghasilan Ibu <span class="text-red-500">*</span></label>
                        <input v-model="internalData.penghasilanIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                     <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Instansi <span class="text-red-500">*</span></label>
                        <input v-model="internalData.instansiIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Jabatan <span class="text-red-500">*</span></label>
                        <input v-model="internalData.jabatanIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                </div>

                <h3 class="font-bold text-slate-800 text-sm border-l-4 border-brand-orange pl-3 mt-8">Alamat Domisili Ibu Kandung</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Jalan <span class="text-red-500">*</span></label>
                        <textarea v-model="internalData.jalanIbu" required rows="2" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm"></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Provinsi <span class="text-red-500">*</span></label>
                        <input v-model="internalData.provinsiIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kota / Kabupaten <span class="text-red-500">*</span></label>
                        <input v-model="internalData.kotaIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kecamatan <span class="text-red-500">*</span></label>
                        <input v-model="internalData.kecamatanIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kelurahan / Desa <span class="text-red-500">*</span></label>
                         <input v-model="internalData.kelurahanIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Dusun <span class="text-red-500">*</span></label>
                         <input v-model="internalData.dusunIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">RT <span class="text-red-500">*</span></label>
                            <input v-model="internalData.rtIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">RW <span class="text-red-500">*</span></label>
                            <input v-model="internalData.rwIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kode Pos <span class="text-red-500">*</span></label>
                            <input v-model="internalData.kodePosIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                        </div>
                    </div>
                </div>

                <h3 class="font-bold text-slate-800 text-sm border-l-4 border-brand-orange pl-3 mt-8">Kontak Ibu Kandung</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="lg:col-span-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">No. HP / WA Ibu <span class="text-red-500">*</span></label>
                        <input v-model="internalData.noHpIbu" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div class="lg:col-span-2">
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Email Ibu <span class="text-red-500">*</span></label>
                         <input v-model="internalData.emailIbu" required type="email" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Instagram Ibu</label>
                         <input v-model="internalData.igIbu" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="@username">
                    </div>
                    <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Facebook Ibu</label>
                         <input v-model="internalData.fbIbu" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
                    </div>
                </div>
            </div>

            <div class="pt-10 mt-10 border-t border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-center">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-brand-orange border border-slate-100">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div>
                        <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Verifikasi Data</p>
                        <p class="text-[10px] text-slate-400 italic mt-0.5">Seluruh data yang Anda masukkan akan disinkronisasi ke sistem administrasi sekolah.</p>
                    </div>
                </div>
                <button type="submit" :disabled="isSaving" class="w-full md:w-auto px-12 py-4 bg-brand-orange text-white font-bold rounded-2xl hover:bg-orange-600 transition shadow-xl shadow-green-200 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95 group">
                    <i v-if="isSaving" class="fas fa-circle-notch fa-spin text-lg"></i>
                    <i v-else class="fas fa-cloud-upload-alt text-lg group-hover:-translate-y-1 transition-transform"></i>
                    {{ isSaving ? 'Sedang Menyimpan...' : 'Simpan Seluruh Biodata Lengkap' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({})
    },
    isSaving: Boolean
});

const emit = defineEmits(['update:modelValue', 'submit']);

const activeTab = ref('pribadi');
const tabs = [
    { id: 'pribadi', label: 'Data Pribadi', icon: 'fas fa-id-card' },
    { id: 'alamat', label: 'Alamat Detail', icon: 'fas fa-map-marker-alt' },
    { id: 'kesehatan', label: 'Kesehatan', icon: 'fas fa-heartbeat' },
    { id: 'ayah', label: 'Data Ayah', icon: 'fas fa-user-tie' },
    { id: 'ibu', label: 'Data Ibu', icon: 'fas fa-user-nurse' },
];

const internalData = ref({
    // Pribadi
    nik: '', nisn: '', anakKe: '', jumlahSaudara: '', statusAnak: 'Kandung', bahasa: 'B. Indonesia',
    // Alamat
    jalan: '', provinsi: '', kota: '', kecamatan: '', kelurahan: '', dusun: '', rt: '', rw: '', kodePos: '',
    // Kesehatan
    karakteristik: 'Tidak Berkebutuhan Khusus', golDarah: 'O', sakit: '', pernah_sakit: '', beratBadan: '', tinggiBadan: '', riwayatPenyakit: '',
    // Ayah
    nikAyah: '', namaAyah: '', tempatLahirAyah: '', tanggalLahirAyah: '', agamaAyah: 'Islam', statusAyah: 'Masih Hidup',
    pendidikanAyah: '', jurusanAyah: '', sekolahAyah: '', pekerjaanAyah: '', penghasilanAyah: '', 
    instansiAyah: '', jabatanAyah: '',
    jalanAyah: '', provinsiAyah: '', kotaAyah: '', kecamatanAyah: '', kelurahanAyah: '', dusunAyah: '', 
    rtAyah: '', rwAyah: '', kodePosAyah: '',
    noHpAyah: '', emailAyah: '', igAyah: '', fbAyah: '',
    // Ibu
    nikIbu: '', namaIbu: '', tempatLahirIbu: '', tanggalLahirIbu: '', agamaIbu: 'Islam', statusIbu: 'Masih Hidup',
    pendidikanIbu: '', jurusanIbu: '', sekolahIbu: '', pekerjaanIbu: '', penghasilanIbu: '',
    instansiIbu: '', jabatanIbu: '',
    jalanIbu: '', provinsiIbu: '', kotaIbu: '', kecamatanIbu: '', kelurahanIbu: '', dusunIbu: '',
    rtIbu: '', rwIbu: '', kodePosIbu: '',
    noHpIbu: '', emailIbu: '', igIbu: '', fbIbu: '',
    // Docs
    documents: []
});

onMounted(() => {
    if (props.modelValue && Object.keys(props.modelValue).length > 2) { 
        internalData.value = { ...internalData.value, ...props.modelValue };
    }
});

watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        internalData.value = { ...internalData.value, ...newVal };
    }
}, { deep: true });

const submitForm = () => {
    emit('update:modelValue', internalData.value);
    emit('submit', internalData.value);
};
</script>

<style scoped>
.animate-fade-in-up {
    animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Custom transitions and scrollbar */
.p-8 {
    scrollbar-width: thin;
    scrollbar-color: #10b981 transparent;
}
</style>


