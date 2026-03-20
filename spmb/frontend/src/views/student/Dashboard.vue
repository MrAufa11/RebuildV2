<template>
    <div class="bg-slate-50 font-sans text-slate-700 min-h-screen pb-20">

        <!-- Header -->
        <header class="bg-brand-orange pt-6 pb-32 shadow-lg sticky top-0 z-0 text-white">
            <div class="max-w-6xl mx-auto px-6">
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center gap-3 text-white">
                        <div class="w-8 h-8 bg-white text-brand-orange rounded flex items-center justify-center font-bold shadow-lg">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <span class="font-serif font-bold text-lg tracking-wide uppercase">PMB Al-Mawahib</span>
                    </div>
                    <div class="flex items-center gap-4 text-white/90 text-sm">
                        <span class="hidden sm:inline font-medium">{{ user.username || 'Calon Santri' }}</span>
                        <button @click="logout" class="bg-white/10 px-4 py-1.5 rounded-full hover:bg-white/20 transition text-xs font-semibold border border-white/20">Logout</button>
                    </div>
                </div>

                <div class="flex justify-center">
                    <nav class="flex space-x-2 overflow-x-auto no-scrollbar py-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/10">
                        <button @click="changeTab('biodata')" :class="tabClass('biodata')">1. Biodata Awal</button>
                        <button @click="changeTab('pembayaran')" :class="tabClass('pembayaran')" :disabled="!isUnlocked('pembayaran')">2. Pembayaran Form</button>
                        <button @click="changeTab('kartu')" :class="tabClass('kartu')" :disabled="!isUnlocked('kartu')">3. Cetak Kartu</button>
                        <button @click="changeTab('seleksi')" :class="tabClass('seleksi')" :disabled="!isUnlocked('seleksi')">4. Hasil Seleksi</button>
                        <button @click="changeTab('daftarulang')" :class="tabClass('daftarulang')" :disabled="!isUnlocked('daftarulang')">5. Daftar Ulang</button>
                        <button @click="changeTab('pengumuman')" :class="tabClass('pengumuman')">Pengumuman</button>
                    </nav>
                </div>
            </div>
        </header>

        <main class="max-w-5xl mx-auto px-4 sm:px-6 -mt-24 relative z-10 w-full">

            <!-- Tab: Biodata -->
            <div v-show="activeTab === 'biodata'" class="tab-content w-full">
                <div class="bg-white rounded-xl shadow-lg border border-slate-200 p-8 sm:p-10">
                    
                    <div class="border-b border-slate-100 pb-6 mb-8">
                        <h2 class="text-2xl font-serif font-bold text-slate-800">Formulir Pendaftaran</h2>
                        <p class="text-slate-500 text-sm mt-1">Lengkapi data diri Anda dengan benar sesuai dokumen resmi.</p>
                    </div>

                    <form @submit.prevent="saveBiodata">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1.5">Email <span class="text-red-500">*</span></label>
                                <input type="email" v-model="form.email" readonly class="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap <span class="text-red-500">*</span></label>
                                <input type="text" v-model="form.fullName" class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all shadow-sm">
                            </div>

                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-slate-700 mb-1.5">Alamat Lengkap <span class="text-red-500">*</span></label>
                                <input type="text" v-model="form.address" class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all shadow-sm" placeholder="Jln. Contoh No. 123, Kota...">
                            </div>

                            <div>
                                <BaseSelect 
                                    inputLabel="Gelombang"
                                    v-model="form.wave"
                                    :options="waveOptions"
                                    :searchable="false"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1.5">Tahun Pendaftaran <span class="text-red-500">*</span></label>
                                <input type="text" v-model="form.registrationYear" readonly class="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed">
                            </div>

                            <div class="md:col-span-2">
                                <BaseSelect
                                    inputLabel="Kelas"
                                    v-model="form.schoolLevel"
                                    :options="schoolLevelOptions"
                                    :reduce="entry => entry.value"
                                    label="label"
                                    :searchable="false"
                                    @update:modelValue="(val) => { /* watch will handle it */ }"
                                />
                            </div>

                            <div>
                                <BaseSelect 
                                    inputLabel="Jalur Pendaftaran"
                                    v-model="form.entryPath"
                                    :options="entryPathOptions"
                                    :searchable="false"
                                    @update:modelValue="(val) => { /* watch will handle it */ }"
                                />
                            </div>
                            <div>
                                <BaseSelect
                                    inputLabel="Sub Jalur"
                                    v-model="form.subEntryPath"
                                    :options="subEntryPathOptions"
                                    :searchable="false"
                                    @update:modelValue="(val) => { /* watch will handle it */ }"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1.5">Tempat Lahir <span class="text-red-500">*</span></label>
                                <input type="text" v-model="form.birthPlace" class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all shadow-sm uppercase">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Lahir <span class="text-red-500">*</span></label>
                                <div class="relative">
                                    <input type="date" v-model="form.birthDate" class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all shadow-sm appearance-none">
                                </div>
                            </div>

                            <div class="md:col-span-1">
                                <label class="block text-sm font-medium text-slate-700 mb-3">Jenis Kelamin <span class="text-red-500">*</span></label>
                                <div class="flex gap-4">
                                    <label class="flex items-center gap-2 cursor-pointer group">
                                        <div class="relative flex items-center">
                                            <input type="radio" name="gender" value="Laki-Laki" v-model="form.gender" class="peer sr-only">
                                            <div class="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-brand-orange peer-checked:bg-brand-orange transition-all"></div>
                                            <div class="absolute inset-0 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform">
                                                <div class="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        <span class="text-sm text-slate-700 font-medium group-hover:text-brand-orange transition-colors">Laki-Laki</span>
                                    </label>

                                    <label class="flex items-center gap-2 cursor-pointer group">
                                        <div class="relative flex items-center">
                                            <input type="radio" name="gender" value="Perempuan" v-model="form.gender" class="peer sr-only">
                                            <div class="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-brand-orange peer-checked:bg-brand-orange transition-all"></div>
                                            <div class="absolute inset-0 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform">
                                                <div class="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        <span class="text-sm text-slate-700 font-medium group-hover:text-brand-orange transition-colors">Perempuan</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1.5">Asal Sekolah <span class="text-red-500">*</span></label>
                                <input type="text" v-model="form.schoolOrigin" class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all shadow-sm" placeholder="Nama Sekolah Asal">
                            </div>

                            <div class="md:col-span-2">
                                <BaseSelect
                                    inputLabel="Agama"
                                    v-model="form.religion"
                                    :options="religionOptions"
                                    :searchable="false"
                                />
                            </div>

                        </div>

                        <div class="mt-8 pt-6 border-t border-slate-100">
                             <button type="submit" :disabled="isSaving" class="w-full py-4 bg-brand-orange hover:bg-brand-orangeHover cursor-pointer text-white font-bold text-base rounded-xl shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-0.5 focus:ring-4 focus:ring-orange-100 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                                {{ isSaving ? 'Menyimpan Data...' : 'Simpan Data' }}
                            </button>
                        </div>

                    </form>
                </div>
            </div>



            <!-- Tab: Pembayaran -->
            <div v-show="activeTab === 'pembayaran'" class="tab-content animate-fade-in-up">
                <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div class="grid grid-cols-1 md:grid-cols-5">
                        <div class="md:col-span-2 bg-slate-50 p-8 border-r border-slate-200 border-dashed h-full flex flex-col justify-between">
                            <div>
                                <h3 class="font-serif font-bold text-brand-orange text-xl mb-4">Tagihan Formulir</h3>
                                
                                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
                                    <label class="block text-sm font-bold text-slate-700 mb-2">Punya Kode Voucher?</label>
                                    <div class="flex space-x-2">
                                        <input type="text" v-model="voucherCodeInput" placeholder="KODE DISKON" class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-brand-orange focus:border-brand-orange uppercase" :disabled="form.paymentStatus === 'Pending_Verification' || form.paymentStatus === 'Verified'">
                                        <button @click="verifyVoucher" :disabled="isVerifyingVoucher || !voucherCodeInput || form.paymentStatus === 'Pending_Verification' || form.paymentStatus === 'Verified'" class="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 disabled:opacity-50">
                                            {{ isVerifyingVoucher ? 'Cek...' : 'Terapkan' }}
                                        </button>
                                    </div>
                                    <p v-if="voucherError" class="text-xs text-red-500 mt-2"><i class="fas fa-times-circle"></i> {{ voucherError }}</p>
                                    
                                    <div v-if="appliedVoucher || form.discountAmount > 0" class="mt-3 p-3 bg-orange-50 rounded border border-green-100 flex items-center justify-between">
                                        <div class="flex items-center text-green-700 text-sm">
                                            <i class="fas fa-ticket-alt mr-2"></i> 
                                            <span class="font-bold border-dashed border-b border-green-700 pb-0.5">{{ form.voucherCode || appliedVoucher?.code }}</span>
                                        </div>
                                        <span class="text-green-700 font-bold">- Rp {{ (form.discountAmount || appliedVoucher?.discount_amount || 0).toLocaleString('id-ID') }}</span>
                                    </div>
                                </div>
                                
                                <div class="p-4 bg-slate-800 text-white rounded-xl shadow-inner mb-4">
                                    <p class="text-xs text-slate-300 uppercase tracking-wide">Nominal Transfer</p>
                                    <div class="flex items-end space-x-2 mt-1">
                                        <p class="text-2xl font-bold text-brand-orange">Rp {{ (175000 - (form.discountAmount || appliedVoucher?.discount_amount || 0)).toLocaleString('id-ID') }}</p>
                                        <p v-if="appliedVoucher || form.discountAmount > 0" class="line-through text-slate-400 text-sm pb-1">Rp 175.000</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="text-sm space-y-2 text-slate-600 bg-white p-4 rounded-xl border border-slate-200">
                                <p class="text-xs text-slate-400 mb-2 uppercase font-bold">Transfer Ke:</p>
                                <p class="flex justify-between items-center"><span>Bank:</span> <span class="font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">BCA</span></p>
                                <p class="flex justify-between items-center"><span>No. Rek:</span> <span class="font-mono font-bold text-base tracking-wider text-slate-800">8321-3521-00</span></p>
                                <p class="flex justify-between items-center"><span>A.n:</span> <span class="font-bold">Yayasan Al-Mawahib</span></p>
                            </div>
                        </div>
                        <div class="md:col-span-3 p-8 flex flex-col justify-center">
                            <h3 class="font-serif font-bold text-brand-orange text-xl mb-4">Konfirmasi Pembayaran</h3>
                            <div class="space-y-5">
                                <div>
                                    <div v-if="form.paymentStatus === 'Verified'" class="text-brand-orange font-bold mb-4 bg-orange-50 px-4 py-3 rounded-xl border border-orange-200 flex items-center space-x-3">
                                        <i class="fas fa-check-circle text-2xl"></i>
                                        <span>Pembayaran telah Diverifikasi! Anda bisa lanjut ke tahap berikutnya.</span>
                                    </div>
                                    <div v-else-if="form.paymentStatus === 'Pending_Verification'" class="text-amber-700 font-bold mb-4 bg-amber-50 px-4 py-3 rounded-xl border border-amber-200 flex items-center space-x-3">
                                        <i class="fas fa-clock text-2xl"></i>
                                        <div>
                                            <p>Menunggu Verifikasi Admin</p>
                                            <p class="text-xs font-normal mt-0.5">Bukti Anda sudah diupload dan sedang diperiksa.</p>
                                        </div>
                                    </div>
                                    <div v-else class="mb-4 text-slate-500 text-sm">
                                        Upload foto bukti transfer atau screenshot m-banking <span class="text-red-500 font-bold">*</span>
                                    </div>
                                    
                                    <div v-if="form.paymentStatus !== 'Verified'">
                                         <div class="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors bg-white">
                                            <i class="fas fa-cloud-upload-alt text-3xl text-brand-orange mb-2"></i>
                                            <p class="text-sm font-medium text-slate-700 mb-1">Pilih File Bukti Bayar</p>
                                            <p class="text-xs text-slate-500 mb-4">Maksimal 5MB (JPG/PNG/PDF)</p>
                                            <input type="file" @change="onPaymentFileChange" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-orange/10 file:text-brand-orange hover:file:bg-brand-orange/20 cursor-pointer mx-auto block">
                                        </div>

                                        <button @click="submitPayment" :disabled="isSubmittingPymt || (!paymentFileSelected && !form.paymentProof)" class="mt-4 w-full py-3.5 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <i v-if="isSubmittingPymt" class="fas fa-circle-notch fa-spin mr-2"></i>
                                            {{ isSubmittingPymt ? 'Memproses Upload...' : 'Submit Pembayaran' }}
                                        </button>
                                    </div>

                                    <div v-if="form.paymentProof" class="mt-6">
                                        <p class="text-sm font-bold text-slate-600 mb-2">Bukti Terupload:</p>
                                        <img :src="form.paymentProof" class="max-h-48 rounded-lg shadow-md border border-slate-200">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab: Kartu Ujian -->
            <div v-show="activeTab === 'kartu'" class="tab-content animate-fade-in-up">
                <div class="max-w-3xl mx-auto">
                    <div class="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
                        <div class="absolute top-0 w-full h-2 bg-gradient-to-r from-brand-orange to-brand-orange"></div>
                        
                        <div class="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                            <div class="flex-shrink-0 text-center">
                                <div class="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-300 mx-auto mb-2">
                                    <svg class="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                </div>
                                <span class="text-xs font-mono text-slate-500">NO: {{ form.registrationYear }}-REG-{{ String(form.id || '').padStart(4, '0') }}</span>
                            </div>
                            
                            <div class="flex-1 w-full text-center md:text-left">
                                <h2 class="text-2xl font-serif font-bold text-brand-orange mb-1">KARTU PESERTA UJIAN</h2>
                                <p class="text-brand-orange font-medium mb-6">SPMB Al-Mawahib {{ form.registrationYear }}</p>
                                
                                <div class="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-lg">
                                    <div>
                                        <p class="text-xs text-slate-400">Nama Peserta</p>
                                        <p class="font-bold text-slate-800">{{ form.fullName }}</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-400">Jadwal Ujian</p>
                                        <p class="font-bold text-slate-800">25 Feb 2026, 08:00</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-400">Lokasi</p>
                                        <p class="font-bold text-slate-800">Gedung A, R.102</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-400">Jalur</p>
                                        <p class="font-bold text-slate-800">{{ form.entryPath }}</p>
                                    </div>
                                </div>

                                <button @click="printCard" class="bg-brand-orange text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition shadow-lg shadow-orange-200 flex items-center justify-center gap-2 mx-auto md:mx-0 w-full md:w-auto hide-on-print">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                    Cetak Kartu (.PDF)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab: Hasil Seleksi -->
            <div v-show="activeTab === 'seleksi'" class="tab-content animate-fade-in-up">
                <div class="max-w-2xl mx-auto text-center bg-white p-10 rounded-2xl shadow-lg border border-slate-200">
                    <div v-if="form.status === 'Graduated'" class="w-24 h-24 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div v-else class="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-clock text-4xl"></i>
                    </div>
                    
                    <h2 class="text-3xl font-serif font-bold text-brand-orange mb-4">{{ form.status === 'Graduated' ? 'Selamat! Anda Lulus.' : 'Belum Ada Hasil' }}</h2>
                    <div v-if="form.nisn" class="bg-orange-50 text-brand-orange font-bold px-4 py-2 rounded-lg my-4 text-xl border border-orange-200">
                        NISN Anda: {{ form.nisn }}
                    </div>
                    <p class="text-slate-600 mb-8 leading-relaxed">
                        <span v-if="form.status === 'Graduated'">
                             Berdasarkan hasil tes akademik dan wawancara, kami menyatakan bahwa 
                            <strong class="text-slate-800">{{ form.fullName }}</strong> diterima sebagai santri baru 
                            di Pondok Pesantren Al-Mawahib Tahun Ajaran {{ form.registrationYear }}/{{ parseInt(form.registrationYear)+1 }}.
                        </span>
                        <span v-else>
                            Hasil seleksi belum tersedia atau sedang dalam proses penilaian. Silakan cek kembali nanti secara berkala.
                        </span>
                    </p>

                    <div v-if="form.status === 'Graduated'" class="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8">
                        <p class="text-orange-800 text-sm font-medium">Silakan lanjutkan ke tahap <strong>Daftar Ulang</strong> sebelum tanggal 5 Maret {{ form.registrationYear }}.</p>
                    </div>

                    <div v-if="form.status === 'Graduated'" class="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                        <button @click="downloadGraduationLetter" :disabled="isDownloadingGrad" class="bg-brand-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50">
                            <i v-if="isDownloadingGrad" class="fas fa-circle-notch fa-spin"></i>
                            <i v-else class="fas fa-file-pdf"></i>
                            Cetak Surat Kelulusan (PDF)
                        </button>
                        <button @click="activeTab = 'daftarulang'" class="bg-brand-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg w-full sm:w-auto flex items-center justify-center gap-2">
                            Lanjut Daftar Ulang <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tab: Daftar Ulang -->
            <div v-show="activeTab === 'daftarulang'" class="tab-content animate-fade-in-up">
                
                <!-- Sub-tab Navigation -->
                <div class="flex justify-center mb-8 pt-4">
                    <div class="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl flex gap-1 shadow-xl border border-white/20 ring-1 ring-slate-200">
                        <button @click="activeSubTab = 'biaya'" :class="activeSubTab === 'biaya' ? 'bg-brand-orange text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'" class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                             <i class="fas fa-wallet"></i> 1. Biaya
                        </button>
                        <button @click="activeSubTab = 'biodata'" :class="activeSubTab === 'biodata' ? 'bg-brand-orange text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'" class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                             <i class="fas fa-user-edit"></i> 2. Biodata
                        </button>
                        <button @click="activeSubTab = 'dokumen'" :class="activeSubTab === 'dokumen' ? 'bg-brand-orange text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'" class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                             <i class="fas fa-file-upload"></i> 3. Dokumen
                        </button>
                    </div>
                </div>

                <!-- Sub-Tab Content: Biaya -->
                <div v-show="activeSubTab === 'biaya'" class="animate-fade-in-up">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div class="lg:col-span-2 space-y-8">
                            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                                <h2 class="text-xl font-serif font-bold text-brand-orange mb-6">Rincian Biaya Daftar Ulang</h2>
                                
                                <div class="space-y-4">
                                    <div class="flex justify-between items-center py-3 border-b border-slate-100">
                                        <span class="text-slate-600">Uang Pangkal / Gedung</span>
                                        <span class="font-bold text-slate-800">Rp 5.000.000</span>
                                    </div>
                                    <div class="flex justify-between items-center py-3 border-b border-slate-100">
                                        <span class="text-slate-600">Seragam (3 Setel)</span>
                                        <span class="font-bold text-slate-800">Rp 750.000</span>
                                    </div>
                                    <div class="flex justify-between items-center py-3 border-b border-slate-100">
                                        <span class="text-slate-600">Kitab & Buku Paket (Semester 1)</span>
                                        <span class="font-bold text-slate-800">Rp 1.200.000</span>
                                    </div>
                                    <div class="flex justify-between items-center py-3 border-b border-slate-100">
                                        <span class="text-slate-600">SPP Bulan Pertama (Juli)</span>
                                        <span class="font-bold text-slate-800">Rp 500.000</span>
                                    </div>
                                    
                                    <div class="flex justify-between items-center pt-4 mt-4 bg-slate-50 p-4 rounded-xl">
                                        <span class="font-bold text-lg text-brand-orange">Total Kewajiban</span>
                                        <span class="font-bold text-2xl text-brand-orange">Rp 7.450.000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-brand-orange text-white rounded-2xl p-8 h-fit shadow-xl relative overflow-hidden">
                            <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                            
                            <h3 class="font-serif font-bold text-xl mb-4 relative z-10 text-white">Metode Pembayaran</h3>
                            <p class="text-white/80 text-sm mb-6 relative z-10">Pembayaran dapat dicicil maksimal 2x. Harap konfirmasi setelah melakukan transfer.</p>
                            
                            <div class="bg-white/10 p-4 rounded-xl mb-6 relative z-10 border border-white/20">
                                <p class="text-xs uppercase tracking-widest text-white/60 mb-1">Bank Syariah Indonesia (BSI)</p>
                                <p class="text-2xl font-mono font-bold">7123-4567-89</p>
                                <p class="text-sm mt-1">a.n PP Al-Mawahib</p>
                            </div>

                            <div class="relative z-10 w-full mt-4 bg-white/10 p-4 rounded-xl border border-white/10">
                                <label class="text-sm text-white mb-2 block font-bold">Upload Bukti Daftar Ulang</label>
                                <div v-if="form.reRegistrationProof" class="mb-4 p-3 bg-orange-500/20 text-white font-bold rounded-lg border border-green-500/30 flex items-center space-x-2">
                                    <i class="fas fa-check-circle text-green-400"></i>
                                    <span>Bukti telah diupload!</span>
                                </div>
                                <input v-else type="file" @change="uploadReRegProof" class="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-brand-orange file:font-semibold w-full hover:file:bg-orange-50" />
                                <p v-if="!form.reRegistrationProof" class="mt-2 text-xs text-white/80"><i class="fas fa-info-circle mr-1"></i> File otomatis terkirim saat dipilih.</p>
                                <a v-if="form.reRegistrationProof" :href="form.reRegistrationProof" target="_blank" class="text-xs underline text-white/80 hover:text-white mt-2 inline-block">Lihat Bukti Terupload</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sub-Tab Content: Biodata -->
                <div v-show="activeSubTab === 'biodata'" class="animate-fade-in-up max-w-4xl mx-auto">
                    <!-- Biodata Lengkap Component -->
                    <CompleteBiodataForm 
                        v-model="form.biodataLengkap" 
                        :isSaving="isSavingBiodataLengkap"
                        @submit="submitBiodataLengkap" 
                    />
                </div>

                <!-- Sub-Tab Content: Dokumen -->
                <div v-show="activeSubTab === 'dokumen'" class="animate-fade-in-up max-w-4xl mx-auto">
                    <div class="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-8">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h3 class="font-serif font-bold text-2xl text-brand-orange">Dokumen Persyaratan</h3>
                                <p class="text-slate-500 text-sm mt-1">Lengkapi dokumen wajib untuk verifikasi kelulusan Anda.</p>
                            </div>
                            <div class="bg-brand-orange/10 text-brand-orange px-4 py-2 rounded-xl border border-brand-orange/20">
                                <span class="text-xs font-bold uppercase tracking-wider">Status: Berkas Diperlukan</span>
                            </div>
                        </div>
                        
                        <!-- Master Requirement List -->
                        <div v-if="filteredRequirements.length" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div v-for="req in filteredRequirements" :key="req.id" 
                                class="p-5 rounded-2xl border transition-all relative overflow-hidden group"
                                :class="getUploadedDocByCode(req.code) ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200 hover:border-brand-orange/30'">
                                
                                <div class="relative z-10">
                                    <div class="flex justify-between items-start mb-3">
                                        <div class="w-12 h-12 rounded-xl flex items-center justify-center"
                                            :class="getUploadedDocByCode(req.code) ? 'bg-orange-100 text-brand-orange' : 'bg-white text-slate-400 shadow-sm'">
                                            <i :class="getUploadedDocByCode(req.code) ? 'fas fa-check-circle text-xl' : 'fas fa-file-alt text-lg'"></i>
                                        </div>
                                        <span class="text-[10px] font-bold px-2 py-1 rounded-md uppercase"
                                            :class="req.status === 'Wajib' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'">
                                            {{ req.status }}
                                        </span>
                                    </div>
                                    
                                    <h4 class="font-bold text-slate-800 mb-1">{{ req.requirement_name }}</h4>
                                    <p class="text-[11px] text-slate-400 mb-4">{{ req.code }} - {{ req.education_level }}</p>
                                    
                                    <div v-if="getUploadedDocByCode(req.code)" class="flex items-center justify-between mt-2 pt-3 border-t border-green-100">
                                        <a :href="getUploadedDocByCode(req.code).url" target="_blank" class="text-xs font-bold text-green-700 hover:underline flex items-center gap-1">
                                            <i class="fas fa-eye"></i> Lihat Berkas
                                        </a>
                                        <button @click="removeDocByCode(req.code)" class="text-xs font-bold text-red-500 hover:text-red-700">Hapus</button>
                                    </div>
                                    <div v-else class="mt-2">
                                        <input type="file" :id="'file-' + req.code" @change="uploadDocForReq($event, req)" class="hidden" />
                                        <label :for="'file-' + req.code" class="w-full py-2 bg-white border border-slate-200 text-brand-orange text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all shadow-sm">
                                            <i class="fas fa-upload"></i> Unggah Sekarang
                                        </label>
                                    </div>
                                </div>

                                <!-- Background Decoration -->
                                <i v-if="getUploadedDocByCode(req.code)" class="fas fa-certificate absolute -right-4 -bottom-4 text-6xl text-green-500/5"></i>
                            </div>
                        </div>

                        <div v-else class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mb-8">
                            <i class="fas fa-clipboard-list text-5xl text-slate-200 mb-4"></i>
                            <p class="text-slate-400 font-medium">Memuat daftar persyaratan dokumen...</p>
                        </div>

                        <div class="mt-8 pt-8 border-t border-slate-100">
                            <h4 class="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <i class="fas fa-folder-plus text-brand-orange"></i> Dokumen Pendukung Lainnya
                            </h4>
                            <p class="text-xs text-slate-400 mb-4">Anda dapat mengunggah dokumen tambahan seperti sertifikat prestasi, piagam, dll.</p>
                            
                            <div class="space-y-3 mb-6">
                                <div v-for="(doc, idx) in otherDocuments" :key="idx" class="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center transition-all hover:shadow-sm">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                            <i class="fas fa-file-pdf text-sm"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-bold text-slate-700">{{ doc.name }}</p>
                                            <a :href="doc.url" target="_blank" class="text-[10px] text-blue-500 hover:underline">Download / Lihat</a>
                                        </div>
                                    </div>
                                    <button @click="removeOtherDoc(idx)" class="text-slate-300 hover:text-red-500 transition-colors">
                                        <i class="fas fa-times-circle"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div class="md:col-span-2">
                                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-2">Nama Dokumen Tambahan</label>
                                    <input type="text" v-model="newDocName" placeholder="Contoh: Sertifikat Juara 1" class="w-full px-4 py-2 rounded-xl text-sm border-slate-200 focus:ring-brand-orange focus:border-brand-orange transition-all">
                                </div>
                                <div class="flex items-end gap-3 md:col-span-2">
                                    <div class="flex-1">
                                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-2">Pilih Berkas</label>
                                        <input type="file" @change="handleNewDocumentFile" class="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 file:cursor-pointer transition-all">
                                    </div>
                                    <button @click="uploadNewDocument" :disabled="!newDocFile || !newDocName || isUploadingDoc" class="bg-brand-orange text-white px-6 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-blue-600 transition-all flex items-center gap-2">
                                        <i v-if="isUploadingDoc" class="fas fa-circle-notch fa-spin"></i>
                                        <i v-else class="fas fa-plus"></i>
                                        <span>Unggah</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab: Pengumuman -->
            <div v-show="activeTab === 'pengumuman'" class="tab-content animate-fade-in-up">
                <div class="max-w-3xl mx-auto space-y-4">
                
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-brand-orange flex gap-4">
                        <div class="flex-shrink-0 pt-1">
                            <svg class="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-800 text-lg">Perubahan Jadwal Tes Wawancara</h3>
                            <p class="text-xs text-slate-400 mb-2">Diposting: 17 Feb 2026</p>
                            <p class="text-slate-600 text-sm">Dikarenakan ada kegiatan internal pondok, tes wawancara Gelombang 1 diundur menjadi tanggal 25 Februari 2026. Harap maklum.</p>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-slate-300 flex gap-4 opacity-75">
                        <div class="flex-shrink-0 pt-1">
                            <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-800 text-lg">Panduan Upload Berkas</h3>
                            <p class="text-xs text-slate-400 mb-2">Diposting: 10 Jan 2026</p>
                            <p class="text-slate-600 text-sm">Pastikan berkas yang diupload berformat PDF dengan ukuran maksimal 2MB agar tidak gagal saat proses simpan.</p>
                        </div>
                    </div>

                </div>
            </div>

        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
import Alert from '../../assets/alert';
import BaseSelect from '../../components/BaseSelect.vue';
import CompleteBiodataForm from './CompleteBiodataForm.vue';

const isDownloadingGrad = ref(false);
const downloadGraduationLetter = async () => {
    try {
        isDownloadingGrad.value = true;
        const res = await api.get('/spmb/me/pdf/graduation', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Surat_Kelulusan_${form.value.fullName.replace(/\s+/g, '_')}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (e) {
        console.error('Error downloading graduation letter:', e);
        Alert.error('Gagal', 'Tidak dapat mendownload Surat Kelulusan');
    } finally {
        isDownloadingGrad.value = false;
    }
};

const router = useRouter();
const activeTab = ref('biodata');
const activeSubTab = ref('biaya');
const isSaving = ref(false);
const user = ref({});

// Options
const religionOptions = ref([]);
const schoolLevelOptions = ref([]);
const allWaves = ref([]);
const waveOptions = ref([]);
const allPaths = ref([]);
const entryPathOptions = ref([]);
const allSubPaths = ref([]);
const subEntryPathOptions = ref([]);

const form = ref({
    id: null,
    fullName: '',
    email: '',
    phone: '',
    schoolOrigin: '',
    address: '',
    entryPath: '',
    subEntryPath: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki-Laki',
    religion: 'Islam',
    schoolLevel: '',
    wave: '',
    registrationYear: new Date().getFullYear().toString(),
    status: 'Pending',
    nisn: '',
    paymentProof: '',
    paymentStatus: 'Unpaid',
    reRegistrationProof: '',
    documentUrl: '',
    voucherCode: '',
    discountAmount: 0,
    registration_batch_id: null,
    registration_path_id: null,
    registration_sub_path_id: null,
    education_level_id: null,
    biodataLengkap: { documents: [] }
});

import { watch } from 'vue';

// Sync Logs
watch(() => form.value.schoolLevel, (newLevel) => {
    if (!newLevel) {
        waveOptions.value = allWaves.value.map(w => w.batch_name);
        return;
    }
    const levelObj = schoolLevelOptions.value.find(l => l.value === newLevel);
    if (levelObj) {
        form.value.education_level_id = levelObj.id;
    }
    
    // Filter waves based on level (case-insensitive)
    const filtered = allWaves.value.filter(w => 
        String(w.education_level).toLowerCase() === String(newLevel).toLowerCase()
    );
    waveOptions.value = [...new Set(filtered.map(w => w.batch_name))];
    
    // Safety: if the current wave name is still available in the new level, keep it
    if (form.value.wave && !waveOptions.value.includes(form.value.wave)) {
        form.value.wave = '';
        form.value.registration_batch_id = null;
    }
});

watch(() => form.value.wave, (newWave) => {
    if (!newWave) {
        form.value.registration_batch_id = null;
        return;
    }
    const selected = allWaves.value.find(w => w.batch_name === newWave);
    if (selected) {
        form.value.registration_batch_id = selected.id;
        // Optionally update level if not set
        if (!form.value.schoolLevel && selected.education_level) {
            form.value.schoolLevel = selected.education_level;
        }
    }
});

watch(() => form.value.entryPath, (newPath) => {
    if (!newPath) {
        form.value.registration_path_id = null;
        subEntryPathOptions.value = [];
        return;
    }
    const selected = allPaths.value.find(p => p.path_name === newPath);
    if (selected) {
        form.value.registration_path_id = selected.id;
        // Filter subpaths
        const filtered = allSubPaths.value.filter(sp => sp.registration_path_id === selected.id);
        subEntryPathOptions.value = filtered.map(sp => sp.sub_path_name);
        
        if (form.value.subEntryPath && !subEntryPathOptions.value.includes(form.value.subEntryPath)) {
            form.value.subEntryPath = '';
            form.value.registration_sub_path_id = null;
        }
    }
});

watch(() => form.value.subEntryPath, (newSub) => {
    if (!newSub) {
        form.value.registration_sub_path_id = null;
        return;
    }
    const selected = allSubPaths.value.find(sp => 
        sp.sub_path_name === newSub && 
        sp.registration_path_id === form.value.registration_path_id
    );
    if (selected) {
        form.value.registration_sub_path_id = selected.id;
    }
});

const requirementMasters = ref([]);
const registrantDocuments = ref([]);

const fetchRegistrantDocuments = async () => {
    if (!form.value.id) return;
    try {
        const res = await api.get(`/registrant-documents/registrant/${form.value.id}`);
        registrantDocuments.value = res.data;
    } catch (e) {
        console.error('Fetch registrant documents error:', e);
    }
};
const filteredRequirements = computed(() => {
    if (!requirementMasters.value.length || !form.value.schoolLevel) return [];
    return requirementMasters.value.filter(req => {
        // Match level (SMA/SMP etc) and Path (Reguler etc)
        // Note: registration_path in DB might be different from entryPath label, we should check if they match strings
        const matchLevel = req.education_level === form.value.schoolLevel;
        const matchPath = req.registration_path === form.value.entryPath || req.registration_path === 'Semua';
        return matchLevel && matchPath;
    });
});

const isUnlocked = (tab) => {
    if (activeTab.value === tab) return true;
    const hasBiodata = form.value.address && form.value.birthDate && form.value.schoolOrigin;
    const isPymtVerified = form.value.paymentStatus === 'Verified';
    const isApproved = form.value.status === 'Graduated';

    if (tab === 'pembayaran') return hasBiodata;
    if (tab === 'kartu') return isPymtVerified;
    if (tab === 'seleksi') return isPymtVerified;
    if (tab === 'daftarulang') return isApproved;
    return true; // pengumuman, biodata, datalengkap
};

const changeTab = (tab) => {
    if (isUnlocked(tab)) {
        activeTab.value = tab;
    } else {
        Alert.warning('Langkah Dikunci', 'Silakan selesaikan langkah sebelumnya terlebih dahulu.');
    }
};

const tabClass = (tab) => {
    if (activeTab.value === tab) return 'px-4 py-2 text-sm font-medium rounded-lg transition-all text-brand-orange bg-white shadow-sm';
    if (!isUnlocked(tab)) return 'px-4 py-2 text-sm font-medium rounded-lg transition-all text-white/40 cursor-not-allowed';
    return 'px-4 py-2 text-sm font-medium rounded-lg transition-all text-white/80 hover:text-white hover:bg-white/10';
};

// Voucher & Payment Logics
const voucherCodeInput = ref('');
const appliedVoucher = ref(null);
const isVerifyingVoucher = ref(false);
const voucherError = ref('');
const paymentFileSelected = ref(null);
const isSubmittingPymt = ref(false);

const onPaymentFileChange = (e) => {
    paymentFileSelected.value = e.target.files[0];
};

const verifyVoucher = async () => {
    if (!voucherCodeInput.value) return;
    try {
        isVerifyingVoucher.value = true;
        voucherError.value = '';
        const res = await api.post('/voucher/verify-voucher', { code: voucherCodeInput.value });
        appliedVoucher.value = res.data.data;
        Alert.success('Berhasil', 'Voucher potongan harga diterapkan!');
    } catch (error) {
        voucherError.value = error.response?.data?.message || 'Gagal memverifikasi voucher';
        appliedVoucher.value = null;
    } finally {
        isVerifyingVoucher.value = false;
    }
};

const submitPayment = async () => {
    if (!paymentFileSelected.value && !form.value.paymentProof) {
        Alert.error('Upload Gagal', 'Pilih file bukti bayar terlebih dahulu');
        return;
    }
    
    try {
        isSubmittingPymt.value = true;
        let finalProofUrl = form.value.paymentProof;

        if (paymentFileSelected.value) {
            if (paymentFileSelected.value.size > 5 * 1024 * 1024) {
                Alert.error('Dokumen Terlalu Besar', 'Maksimal ukuran file 5MB');
                isSubmittingPymt.value = false;
                return;
            }
            const formData = new FormData();
            formData.append('file', paymentFileSelected.value);
            Alert.info('Mengunggah File...', 'Mohon tunggu sebentar');
            const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            finalProofUrl = res.data.url;
        }

        form.value.paymentProof = finalProofUrl;
        form.value.paymentStatus = 'Pending_Verification';
        if (appliedVoucher.value) {
            form.value.voucherCode = appliedVoucher.value.code;
            form.value.discountAmount = appliedVoucher.value.discount_amount;
        }

        await api.put('/spmb/' + form.value.id, {
            paymentProof: form.value.paymentProof,
            paymentStatus: form.value.paymentStatus,
            voucherCode: form.value.voucherCode,
            discountAmount: form.value.discountAmount
        });

        Alert.success('Terkirim', 'Pembayaran formulir berhasil disubmit. Menunggu verifikasi.');
        
    } catch (err) {
        Alert.error('Upload Gagal', 'Terjadi kesalahan saat memproses pembayaran.');
        console.error(err);
    } finally {
        isSubmittingPymt.value = false;
    }
};

const isSavingBiodataLengkap = ref(false);
const submitBiodataLengkap = async (biodata) => {
    try {
        isSavingBiodataLengkap.value = true;
        await api.put('/spmb/' + form.value.id, {
            biodataLengkap: biodata
        });
        Alert.success('Berhasil', 'Biodata lengkap telah disimpan.');
    } catch (e) {
        console.error(e);
        Alert.error('Gagal', 'Gagal menyimpan biodata lengkap.');
    } finally {
        isSavingBiodataLengkap.value = false;
    }
};

const printCard = async () => {
    try {
        isDownloadingCard.value = true;
        const res = await api.get('/spmb/me/pdf/card', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Kartu_Ujian_${form.value.fullName.replace(/\s+/g, '_')}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (e) {
        console.error('Error downloading card:', e);
        Alert.error('Gagal', 'Tidak dapat mendownload Kartu Ujian');
    } finally {
        isDownloadingCard.value = false;
    }
};

const uploadFileGeneric = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        Alert.error('Terlalu Besar', 'Maksimal 5MB');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        Alert.info('Mengupload...', 'Tunggu sebentar');
        const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        
        let updates = {};
        if (type === 'rereg') {
            updates = { reRegistrationProof: res.data.url };
            form.value.reRegistrationProof = res.data.url;
        }

        await api.put('/spmb/' + form.value.id, updates);
        Alert.success('Berhasil', 'Upload selesai dan tersimpan.');
        
    } catch (e) {
        Alert.error('Gagal', 'Terjadi kesalahan saat upload.');
        console.error(e);
    }
};

const uploadReRegProof = (e) => uploadFileGeneric(e, 'rereg');

// --- Document Upload Logics ---
const isUploadingDoc = ref(false);
const newDocName = ref('');
const newDocFile = ref(null);

const getUploadedDocByCode = (code) => {
    const masterReq = requirementMasters.value.find(r => r.code === code);
    if (!masterReq) return null;
    const doc = registrantDocuments.value.find(d => d.requirement_master_id === masterReq.id);
    return doc ? { ...doc, url: doc.document_url } : null;
};

const otherDocuments = computed(() => {
    // Other documents are those whose requirement_master_id is NOT in requirementMasters
    const masterIds = requirementMasters.value.map(r => r.id);
    return registrantDocuments.value.filter(d => !masterIds.includes(d.requirement_master_id))
        .map(d => ({ ...d, name: d.notes || 'Dokumen Pendukung', url: d.document_url }));
});

const uploadDocForReq = async (event, req) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        isUploadingDoc.value = true;
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/upload', formData);
        
        await api.post('/registrant-documents', {
            registrant_id: form.value.id,
            requirement_master_id: req.id,
            document_url: uploadRes.data.url,
            status: 'Pending'
        });

        await fetchRegistrantDocuments();
        Alert.success('Berhasil', `${req.requirement_name} berhasil diunggah.`);
    } catch (e) {
        console.error('Error uploading doc:', e);
        Alert.error('Gagal', 'Gagal mengunggah dokumen.');
    } finally {
        isUploadingDoc.value = false;
    }
};

const removeDocByCode = async (code) => {
    const doc = getUploadedDocByCode(code);
    if (!doc) return;
    try {
        await api.delete(`/registrant-documents/${doc.id}`);
        await fetchRegistrantDocuments();
        Alert.success('Dihapus', 'Dokumen berhasil dihapus.');
    } catch (e) {
        Alert.error('Gagal', 'Gagal menghapus dokumen.');
    }
};

const removeOtherDoc = async (idx) => {
    const otherDocs = [...otherDocuments.value];
    otherDocs.splice(idx, 1);
    
    // Reconstruct all docs
    const masterDocs = (form.value.biodataLengkap.documents || []).filter(d => d.code);
    form.value.biodataLengkap.documents = [...masterDocs, ...otherDocs];
    
    await submitBiodataLengkap(form.value.biodataLengkap);
    Alert.success('Dihapus', 'Dokumen pendukung berhasil dihapus.');
};

const handleNewDocumentFile = (e) => {
    newDocFile.value = e.target.files[0];
};

const uploadNewDocument = async () => {
    if (!newDocFile.value || !newDocName.value) return;
    try {
        isUploadingDoc.value = true;
        const formData = new FormData();
        formData.append('file', newDocFile.value);
        const res = await api.post('/upload', formData);
        
        const newDoc = {
            name: newDocName.value,
            url: res.data.url
        };
        
        if (!form.value.biodataLengkap.documents) form.value.biodataLengkap.documents = [];
        form.value.biodataLengkap.documents.push(newDoc);
        
        await submitBiodataLengkap(form.value.biodataLengkap);
        
        newDocName.value = '';
        newDocFile.value = null;
        Alert.success('Berhasil', 'Dokumen tambahan berhasil diunggah.');
    } catch (e) {
        Alert.error('Gagal', 'Gagal mengunggah dokumen.');
    } finally {
        isUploadingDoc.value = false;
    }
};

const removeDocument = async (idx) => {
    const confirm = await Alert.confirm('Hapus Dokumen', 'Yakin ingin menghapus dokumen ini?');
    if (confirm) {
        try {
            const currentDocs = [...form.value.biodataLengkap.documents];
            currentDocs.splice(idx, 1);
            
            await api.put('/spmb/' + form.value.id, {
                biodataLengkap: { ...form.value.biodataLengkap, documents: currentDocs }
            });
            form.value.biodataLengkap.documents = currentDocs;
            Alert.success('Dihapus', 'Dokumen berhasil dihapus.');
        } catch (e) {
            console.error('Remove Error:', e);
            Alert.error('Gagal', 'Terjadi kesalahan saat menghapus dokumen.');
        }
    }
};

const fetchOptions = async () => {
    try {
        const relRes = await api.get('/religion');
        religionOptions.value = relRes.data.map(r => r.religion_name);
    } catch (e) { console.error('Fetch religion error:', e); }

    try {
        const schoolRes = await api.get('/education-level');
        schoolLevelOptions.value = schoolRes.data.map(s => ({
            label: `Kelas ${s.abbreviation} (${s.level_name})`,
            value: s.abbreviation,
            id: s.id
        }));
    } catch (e) { console.error('Fetch education-level error:', e); }

    try {
        const waveRes = await api.get('/registration-batch');
        allWaves.value = waveRes.data;
        // Don't overwrite waveOptions here, the watcher will handle it if level is set
        if (form.value.schoolLevel) {
            const filtered = allWaves.value.filter(w => 
                String(w.education_level).toLowerCase() === String(form.value.schoolLevel).toLowerCase()
            );
            waveOptions.value = [...new Set(filtered.map(w => w.batch_name))];
        } else {
            waveOptions.value = [...new Set(waveRes.data.map(w => w.batch_name))];
        }

        // Auto-select active wave if not set
        if (!form.value.wave) {
            const today = new Date();
            const activeWave = allWaves.value.find(w => {
                const start = new Date(w.start_date);
                const end = new Date(w.end_date);
                return today >= start && today <= end;
            });
            if (activeWave) {
                form.value.wave = activeWave.batch_name;
                form.value.registration_batch_id = activeWave.id;
                if (!form.value.schoolLevel) form.value.schoolLevel = activeWave.education_level; 
            }
        }
    } catch (e) { console.error('Fetch registration-batch error:', e); }

    try {
        const pathRes = await api.get('/registration-path');
        allPaths.value = pathRes.data;
        entryPathOptions.value = pathRes.data.map(p => p.path_name);
    } catch (e) { console.error('Fetch registration-path error:', e); }

    try {
        const subPathRes = await api.get('/registration-sub-path');
        allSubPaths.value = subPathRes.data;
        if (form.value.registration_path_id) {
             const filtered = allSubPaths.value.filter(sp => sp.registration_path_id === form.value.registration_path_id);
             subEntryPathOptions.value = filtered.map(sp => sp.sub_path_name);
        }
    } catch (e) { console.error('Fetch registration-sub-path error:', e); }

    try {
        const yearRes = await api.get('/academic-year-setup');
        const activeYear = yearRes.data.find(y => y.active_status === 1 || y.active_status === '1');
        if (activeYear) {
            form.value.registrationYear = activeYear.year;
        }
    } catch (e) { console.error('Fetch academic-year error:', e); }
};

// Handlers replaced by watch!
const handleSubPathChange = (subPathName) => { };
const handleLevelChange = (level) => { };
const handlePathChange = (pathName) => { };
const handleWaveChange = (waveName) => { };

const logout = async () => {
    try {
        await api.post('/auth/logout');
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentUser');
        router.push('/login');
    } catch (e) {
        console.error(e);
        localStorage.removeItem('studentToken');
        router.push('/login');
    }
};const fetchUserData = async () => {
    const storedUser = localStorage.getItem('studentUser');
    if (storedUser) {
        user.value = JSON.parse(storedUser);
    }
};

const fetchRequirementMasters = async () => {
    try {
        const res = await api.get('/requirement-master');
        requirementMasters.value = res.data;
    } catch (e) {
        console.error('Error fetching requirement masters:', e);
    }
};

const fetchRegistrantData = async () => {
    try {
        const response = await api.get('/spmb/me');
        if (response.data) {
            form.value = { ...form.value, ...response.data };
            if (!form.value.biodataLengkap) {
                form.value.biodataLengkap = { documents: [] };
            } else if (!form.value.biodataLengkap.documents) {
                form.value.biodataLengkap.documents = [];
            }
        }
    } catch (error) {
        console.error('Error fetching registrant data:', error);
    }
};


onMounted(async () => {
    await fetchUserData();
    await fetchOptions(); // Options first for watchers
    await fetchRegistrantData();
    await fetchRequirementMasters();
    await fetchRegistrantDocuments();
});

const saveBiodata = async () => {
    isSaving.value = true;
    try {
        await api.put(`/spmb/${form.value.id}`, form.value);
        Alert.success('Berhasil', 'Biodata berhasil disimpan.');
    } catch (error) {
         Alert.error('Error', 'Gagal menyimpan biodata.');
    } finally {
        isSaving.value = false;
    }
};
</script>

<style scoped>
.font-sans { font-family: 'Inter', sans-serif; }
.font-serif { font-family: 'Lora', serif; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.tab-content { display: none; animation: fadeIn 0.3s ease-in-out; }
.tab-content[style*="display: block"], .tab-content:not([style*="display: none"]) { display: block; }

div[v-show] { display: block; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media print {
    body * {
        visibility: hidden;
    }
    .tab-content[style*="display: block"], 
    .tab-content[style*="display: block"] * {
        visibility: visible;
    }
    .tab-content[style*="display: block"] {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
    .hide-on-print, header, nav {
        display: none !important;
        visibility: hidden !important;
    }
}
</style>
