const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts, PageSizes } = require('pdf-lib');
const { databases } = require('../../../../models');
const Registrant = require('../../../../models/spmb/registrant')(databases.spmb, require('sequelize').DataTypes);

const PdfController = {
    async generateExamCard(req, res) {
        try {
            
            // Find registrant
            let registrant;
            if (req.params.id) {
                registrant = await Registrant.findByPk(req.params.id);
            } else {
                const StudentUser = databases.spmb.models.StudentUser;
                const sUser = await StudentUser.findByPk(req.userId);
                if (sUser) {
                    registrant = await Registrant.findOne({ where: { email: sUser.email } });
                }
            }

            if (!registrant) return res.status(404).json({ message: 'Data pendaftaran tidak ditemukan' });
            if (registrant.paymentStatus !== 'Verified') {
                return res.status(403).json({ message: 'Pembayaran belum diverifikasi.' });
            }
            if (registrant.status !== 'Exam' && registrant.status !== 'Approved') {
                return res.status(403).json({ message: 'Kartu ujian hanya tersedia untuk peserta yang sudah dijadwalkan ujian.' });
            }

            // Use existing template
            const templatePath = path.join(__dirname, '../templates/kartu_ujian.pdf');
            if (!fs.existsSync(templatePath)) {
                return res.status(500).json({ message: 'Template kartu ujian tidak ditemukan' });
            }

            const existingPdfBytes = fs.readFileSync(templatePath);
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pages = pdfDoc.getPages();
            const timesBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const firstPage = pages[0];
            firstPage.setSize(PageSizes.A4[0], PageSizes.A4[1]);

            const { width, height } = firstPage.getSize();
            const color = rgb(0, 0, 0);

            // BIKIN HELPER: Hitung Y dari Atas supaya gampang disesuaikan
            const fromTop = (yPosition) => height - yPosition;

            // Get wave data for academic year and selection date
            let academicYear = registrant.registrationYear || new Date().getFullYear();
            let selectionResultDate = new Date().getFullYear();
            let selectionDate = '-';
            let selectionRoom = '-';
            if (registrant.registration_batch_id && registrant.registration_batch_id !== '-') {
                try {
                    // Query gelombang table
                    const waveResults = await databases.spmb.query(`
                        SELECT registration_batch.id,academic_year_setup.name as academik_year, selection_date, selection_result_date
                        FROM registration_batch 
                        LEFT JOIN academic_year_setup ON academic_year_setup.id = registration_batch.academic_year
                        WHERE registration_batch.id = :waveId OR batch_name = :waveName
                        LIMIT 1
                    `, {
                        replacements: { 
                            waveId: registrant.registration_batch_id,
                            waveName: registrant.wave,
                        },
                        type: require('sequelize').QueryTypes.SELECT
                    });
                   
                    if (waveResults && waveResults.length > 0) {
                        const waveData = waveResults[0]; // Sekarang ini baru benar
                        
                        // Get academic year from wave
                        if (waveData.academik_year) {
                            academicYear = waveData.academik_year;
                        }

                        if (waveData.selection_result_date){
                            selectionResultDate = new Date(waveData.selection_result_date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            });
                        }
                        
                        // PERBAIKAN 2: Ubah tanggal_seleksi menjadi selection_date menyesuaikan query SQL
                        if (waveData.selection_date) {
                            selectionDate = new Date(waveData.selection_date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            });
                        }
                        const selectionScheduleResults = await databases.spmb.query(`
                            SELECT 
                                ss.*,
                                el.level_name as education_level_name,
                                rb.batch_name as batch_name,
                                rp.path_name as path_name,
                                st.selection_name as selection_type_name,
                                c.room_name as room_name,
                                bs.building_name
                            FROM selection_schedule ss
                            LEFT JOIN education_level el ON ss.education_level_id = el.id
                            LEFT JOIN registration_batch rb ON ss.registration_batch_id = rb.id
                            LEFT JOIN registration_path rp ON ss.registration_path_id = rp.id
                            LEFT JOIN selection_type st ON ss.selection_type_id = st.id
                            LEFT JOIN room_setup c ON ss.classroom_id = c.id
                            LEFT JOIN building_setup bs ON bs.id = c.building_setup_id
                            WHERE ss.registration_batch_id = :waveId
                            ORDER BY ss.id DESC
                            LIMIT 1
                        `,{
                            replacements : {
                                waveId : registrant.registration_batch_id
                            },
                            type: require('sequelize').QueryTypes.SELECT
                        }); 

                        if(selectionScheduleResults && selectionScheduleResults.length > 0){
                            const selectionScheduleData = selectionScheduleResults[0];
                            
                           
                            if(selectionScheduleData.building_name && selectionScheduleData.room_name){
                                selectionRoom = selectionScheduleData.building_name + ' ' + selectionScheduleData.room_name;
                            }
                            
                        }
                        

                    }
                } catch (error) {
                }
            }

            let educationLevel = registrant.biodataLengkap?.schoolLevel || registrant.schoolLevel || '-';
            if(registrant.education_level_id && registrant.education_level_id !== ''){
                try{
                    const educationLevelResult = await databases.spmb.query(`
                        SELECT level_name 
                        FROM education_level WHERE id = :educationLevelID
                    `, {
                        replacements: { 
                            educationLevelID: registrant.education_level_id,
                        },
                        type: require('sequelize').QueryTypes.SELECT
                    });

                    if(educationLevelResult && educationLevelResult.length > 0){
                        const educationLevelData = educationLevelResult[0];
                        
                        if(educationLevelData.level_name){
                            educationLevel = educationLevelData.level_name;
                        }
                    }
                }catch (error){
                }
            }
           

            const regNo = `${academicYear}-REG-${String(registrant.id).padStart(4, '0')}`;

            // Siapkan Tanggal Lahir
            const birthPlace = registrant.birthPlace || '-';
            const birthDate = registrant.birthDate ? new Date(registrant.birthDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

            // 1. Tahun Ajaran (from wave) -> Di sebelah teks "Tahun Ajaran"
            firstPage.drawText(String(academicYear), {
                x: 155,
                y: fromTop(205),
                size: 9.5,
                color
            });

            // 2. Gelombang -> Di sebelah teks "Gelombang :"
            firstPage.drawText(String(registrant.wave || '-'), {
                x: 283, // Sesuaikan X agar jarak dari titik dua pas
                y: fromTop(227),
                size: 9.5,
                color
            });
            firstPage.drawText(registrant.fullName.toUpperCase(), {
                x: 145, // Sesuaikan X agar jarak dari titik dua pas
                y: fromTop(249),
                size: 9.5,
                color
            });
            // 3. Nama Peserta
            firstPage.drawText(`${educationLevel}`, {
                x: 116, 
                y: fromTop(227),
                size: 9.5,
                color
            });

            // 4. Tempat, Tanggal Lahir
            firstPage.drawText(`${birthPlace}, ${birthDate}`, {
                x: 180, // Sesuaikan X agar jarak dari titik dua pas
                y: fromTop(270),
                size: 9.5,
                color
            });

            // --- KONTEN KANAN ---
            const rightColumnX = 410;

            // 5. No. Urut Seleksi -> Di bawah label
            firstPage.drawText(regNo, {
                x: rightColumnX,
                y: fromTop(240),
                size: 9.5,
                color,
                font: timesBoldFont
            });
            firstPage.drawText(selectionRoom,{
                x: rightColumnX,
                y: fromTop(313),
                size: 9.5,
                color,
                font: timesBoldFont
            });
            // 6. Tanggal Seleksi (from wave) -> Di bawah label
            firstPage.drawText(selectionDate, {
                x: rightColumnX,
                y: fromTop(275),
                size: 9.5,
                color,
                font: timesBoldFont
            });

            firstPage.drawText(selectionResultDate, {
                x: rightColumnX,
                y: fromTop(350),
                size: 9.5,
                color,
                font: timesBoldFont
            });
            firstPage.drawText(new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }), {
                x: rightColumnX + 60,
                y: fromTop(398),
                size: 9.5,
                color
            });

            // --- TABEL PESERTA UJIAN ---
            // Get selection schedule data for selection type
            let selectionTypeName = '-';
            try {
                const selectionScheduleResults = await databases.spmb.query(`
                    SELECT st.selection_name
                    FROM selection_schedule ss
                    LEFT JOIN selection_type st ON ss.selection_type_id = st.id
                    WHERE ss.registration_batch_id = :waveId
                    ORDER BY ss.id DESC
                    LIMIT 1
                `, {
                    replacements: {
                        waveId: registrant.registration_batch_id
                    },
                    type: require('sequelize').QueryTypes.SELECT
                });

                if (selectionScheduleResults && selectionScheduleResults.length > 0) {
                    selectionTypeName = selectionScheduleResults[0].selection_name || '-';
                }
            } catch (error) {
            }

            // Draw table header
            const tableStartY = fromTop(324);
            const tableLeftX = 72.5;
            const colWidths = [34, 167, 115]; // No, Jenis Seleksi, Tanda Tangan
            const rowHeight = 25;
            
            // Draw table borders
            const tableWidth = colWidths.reduce((a, b) => a + b, 0);
            const tableHeight = rowHeight * 1; // Header + 1 row
            
            // Outer border
            firstPage.drawLine({
                start: { x: tableLeftX, y: tableStartY + 10 },
                end: { x: tableLeftX + tableWidth, y: tableStartY + 10 },
                thickness: 1,
                color: rgb(0, 0, 0)
            });
            firstPage.drawLine({
                start: { x: tableLeftX, y: tableStartY + 10 - tableHeight },
                end: { x: tableLeftX + tableWidth, y: tableStartY + 10 - tableHeight },
                thickness: 1,
                color: rgb(0, 0, 0)
            });
            firstPage.drawLine({
                start: { x: tableLeftX, y: tableStartY + 10 },
                end: { x: tableLeftX, y: tableStartY + 10 - tableHeight },
                thickness: 1,
                color: rgb(0, 0, 0)
            });
            firstPage.drawLine({
                start: { x: tableLeftX + tableWidth, y: tableStartY + 10 },
                end: { x: tableLeftX + tableWidth, y: tableStartY + 10 - tableHeight },
                thickness: 1,
                color: rgb(0, 0, 0)
            });
            
            // Column separators
            firstPage.drawLine({
                start: { x: tableLeftX + colWidths[0], y: tableStartY + 10 },
                end: { x: tableLeftX + colWidths[0], y: tableStartY + 10 - tableHeight },
                thickness: 1,
                color: rgb(0, 0, 0)
            });
            firstPage.drawLine({
                start: { x: tableLeftX + colWidths[0] + colWidths[1], y: tableStartY + 10 },
                end: { x: tableLeftX + colWidths[0] + colWidths[1], y: tableStartY + 10 - tableHeight },
                thickness: 1,
                color: rgb(0, 0, 0)
            });
            
            // Row separator (between header and data)
            firstPage.drawLine({
                start: { x: tableLeftX, y: tableStartY + 10 - rowHeight },
                end: { x: tableLeftX + tableWidth, y: tableStartY + 10 - rowHeight },
                thickness: 1,
                color: rgb(0, 0, 0)
            });
            
            // Data row (row 1)
            const dataRowY = 513;
            firstPage.drawText('1', { x: tableLeftX + 15, y: dataRowY, size: 9, color });
            firstPage.drawText(selectionTypeName, { x: tableLeftX + colWidths[0] + 10, y: dataRowY, size: 9, color });
            // Tanda tangan petugas kosong (untuk ditandatangani nanti)

            // Generate PDF bytes
            const pdfBytes = await pdfDoc.save();
            const pdfBuffer = Buffer.from(pdfBytes);
            // ... (kode res.setHeader selanjutnya) ...
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="Kartu_Peserta_Ujian_${regNo}.pdf"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            
            return res.end(pdfBuffer);
        } catch (error) {
            return res.status(500).json({ message: 'Gagal membuat kartu ujian', error: error.message });
        }
    },

    async generateCard(req, res) {
        try {
            // Find registrant (using the token's authenticated ID or param)
            let registrant;
            if (req.params.id) {
                registrant = await Registrant.findByPk(req.params.id);
            } else {
                // If student site, req.userId is from student_users table
                const StudentUser = databases.spmb.models.StudentUser;
                const sUser = await StudentUser.findByPk(req.userId);
                if (sUser) {
                    registrant = await Registrant.findOne({ where: { email: sUser.email } });
                }
            }

            if (!registrant) return res.status(404).json({ message: 'Registrant not found' });
            if (registrant.paymentStatus !== 'Verified') {
                return res.status(403).json({ message: 'Pembayaran belum diverifikasi' });
            }

            const templatePath = path.join(__dirname, '../templates/kartu_ujian.pdf');
            if (!fs.existsSync(templatePath)) return res.status(500).json({ message: 'Template not found' });

            const existingPdfBytes = fs.readFileSync(templatePath);
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            const { height } = firstPage.getSize();
            // origin is bottom left (0,0), so Y coordinates start from bottom!
            // Let's guess the coordinates for Nombre / Nama / dsb.
            // X goes from left to right. Y goes from bottom to top.
            const size = 12;
            const color = rgb(0, 0, 0);

            const regNo = `${registrant.registrationYear}-REG-${String(registrant.id).padStart(4, '0')}`;

            firstPage.drawText(regNo, { x: 200, y: height - 150, size, color });
            firstPage.drawText(registrant.fullName, { x: 200, y: height - 170, size, color });
            firstPage.drawText(registrant.schoolOrigin || '-', { x: 200, y: height - 190, size, color });
            firstPage.drawText(registrant.entryPath || 'Reguler', { x: 200, y: height - 210, size, color });
            // add more fields as needed

            const pdfBytes = await pdfDoc.save();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=Kartu_Ujian_${registrant.fullName.replace(/\s+/g, '_')}.pdf`);
            res.end(Buffer.from(pdfBytes));

        } catch (error) {
            res.status(500).json({ message: 'Failed to generate card' });
        }
    },

    async generateGraduation(req, res) {
        try {
            let registrant;
            if (req.params.id) {
                registrant = await Registrant.findByPk(req.params.id);
            } else {
                const StudentUser = databases.spmb.models.StudentUser;
                const sUser = await StudentUser.findByPk(req.userId);
                if (sUser) {
                    registrant = await Registrant.findOne({ where: { email: sUser.email } });
                }
            }

            if (!registrant) return res.status(404).json({ message: 'Registrant not found' });

            // Catatan: Pastikan statusnya sesuai dengan logic kelulusanmu
            if (registrant.status !== 'Graduated') {
                return res.status(403).json({ message: 'Belum Lulus / Belum ada pengumuman' });
            }

            // KITA BUAT PDF BARU DARI NOL (Tanpa Template)
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage(PageSizes.A4); // Kertas A4
            const { width, height } = page.getSize();

            // Load Fonts
            const fontReg = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
            const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

            const color = rgb(0, 0, 0);
            const marginX = 60;          // Margin Kiri & Kanan
            let cursorY = height - 60;   // Titik Y awal dari atas (seperti cursor ngetik)
            const lineHeight = 16;       // Jarak spasi antar baris

            // Helper untuk nge-print teks satu baris dan otomatis turunin kursor Y
            const drawText = (text, size = 11, font = fontReg, x = marginX) => {
                page.drawText(text, { x, y: cursorY, size, font, color });
                cursorY -= lineHeight; // Otomatis enter ke bawah
            };

            // --- HEADER / KOP SURAT ---
            page.drawText('BINA INSAN MULIA AL-MAWAHIB', { x: marginX, y: cursorY, size: 14, font: fontBold, color });
            cursorY -= 14;
            page.drawText('Penerimaan Peserta Didik Baru', { x: marginX, y: cursorY, size: 12, font: fontBold, color });
            cursorY -= 20;

            // Garis pembatas (Biar mirip surat resmi)
            page.drawLine({
                start: { x: marginX, y: cursorY + 10 },
                end: { x: width - marginX, y: cursorY + 10 },
                thickness: 1,
                color: rgb(0, 0, 0),
            });
            cursorY -= 15;

            // --- METADATA SURAT ---
            drawText('Nomor       : -');
            drawText('Lampiran   : 1 (satu) berkas');
            drawText('Hal            : Pemberitahuan Hasil Seleksi PPDB');
            cursorY -= lineHeight; // Tambahan spasi (Enter)

            // --- KEPADA YTH ---
            drawText('Kepada:');
            drawText(`Yth. Orangtua Ananda ${registrant.fullName}`, 11, fontBold);
            drawText('di');
            drawText('Tempat');
            cursorY -= lineHeight;

            // --- SALAM PEMBUKA ---
            drawText('Bismillaahirrohmaanirrohiim,', 11, fontItalic);
            drawText("Assalaamu'alaikum Warohmatulloohi Wabarokaatuh,");
            cursorY -= lineHeight;

            // --- PARAGRAF 1 (Auto Wrap/Turun ke Bawah) ---
            const p1 = "Segala puji dan do'a kita panjatkan kepada Allah SWT, Sholawat serta salam kita haturkan kepada Nabi Muhammad SAW, semoga kita semua senantiasa dapat meneladani akhlak Rasul sampai akhir hayat. Aamiin.";
            page.drawText(p1, { 
                x: marginX, y: cursorY, size: 11, font: fontReg, color, 
                maxWidth: width - (marginX * 2), // Ini yang bikin teks otomatis nge-wrap!
                lineHeight: 15 
            });
            cursorY -= 15 * 4; // Turunkan kursor manual (estimasi paragraf memakan 3-4 baris)

            // --- PARAGRAF 2 ---
            const regNo = `${registrant.registrationYear || new Date().getFullYear()}-REG-${String(registrant.id).padStart(4, '0')}`;
            const p2 = `Sistem seleksi penerimaan peserta didik baru dilaksanakan sebagai bentuk penemuan potensi peserta didik untuk menyesuaikan unit layanan yang sesuai dengan standar Al-Mawahib. Setelah mengikuti seluruh proses penyelenggaraan pendidikan, maka dengan ini berdasarkan hasil Observasi yang telah dilaksanakan dengan cermat, objektif dan menyeluruh, bahwa Ananda ${registrant.fullName} dengan No. Formulir Pendaftaran: ${regNo} dinyatakan:`;
            page.drawText(p2, { 
                x: marginX, y: cursorY, size: 11, font: fontReg, color, 
                maxWidth: width - (marginX * 2), 
                lineHeight: 15 
            });
            cursorY -= 15 * 6; // Turunkan kursor manual (estimasi 5-6 baris)

            // --- STATUS HASIL ---
            const resultText = 'LULUS SELEKSI'; // Karena ini fungsi generateGraduation, asumsikan lulus
            const resultWidth = fontBold.widthOfTextAtSize(resultText, 16);
            page.drawText(resultText, { 
                x: (width - resultWidth) / 2, // Rumus untuk Center Align (Tengah)
                y: cursorY, 
                size: 16, 
                font: fontBold, 
                color 
            });
            cursorY -= 30; // Spasi sebelum paragraf penutup

            // --- PARAGRAF PENUTUP ---
            const p3 = "Demikian surat pemberitahuan ini kami sampaikan, atas perhatian Bapak/Ibu kami mengucapkan Jazakumullaah khairan katsiiran. Wa jazakumullahu ahsanal jazaa.";
            page.drawText(p3, { 
                x: marginX, y: cursorY, size: 11, font: fontReg, color, 
                maxWidth: width - (marginX * 2), 
                lineHeight: 15 
            });
            cursorY -= 15 * 3; 

            drawText("Wassalaamu'alaikum Warohmatulloohi Wabarokaatuh");
            cursorY -= lineHeight * 2; 

            // --- TANDA TANGAN DI KANAN BAWAH ---
            const rightColumnX = width - 250; // Posisi blok TTD di sebelah kanan
            const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
            const pendaftaranYear = registrant.registrationYear || new Date().getFullYear();

            page.drawText(`Bandung, ${today}`, { x: rightColumnX, y: cursorY, size: 11, font: fontReg, color });
            cursorY -= lineHeight;
            page.drawText(`Panitia PPDB T.P. ${pendaftaranYear}`, { x: rightColumnX, y: cursorY, size: 11, font: fontReg, color });
            cursorY -= lineHeight;
            page.drawText('Ketua Umum,', { x: rightColumnX, y: cursorY, size: 11, font: fontReg, color });

            cursorY -= 60; // Spasi untuk area ttd / stempel
            page.drawText('M. Syarif, S.Ag', { x: rightColumnX, y: cursorY, size: 11, font: fontBold, color });

            // --- CATATAN OTOMATIS (FOOTER BAWAH KERTAS) ---
            const footnoteText = "*Surat ini otomatis diterbitkan melalui sistem dan tidak memerlukan tanda tangan dan stempel basah.";
            page.drawText(footnoteText, { 
                x: marginX, 
                y: 40, // Titik Y statis di bagian paling bawah halaman
                size: 9, 
                font: fontItalic, 
                color 
            });

            // Generate Output
            const pdfBytes = await pdfDoc.save();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="Surat_Kelulusan_${registrant.fullName.replace(/\s+/g, '_')}.pdf"`);
            res.end(Buffer.from(pdfBytes));

        } catch (error) {
            res.status(500).json({ message: 'Failed to generate graduation letter', error: error.message });
        }
    }
};

module.exports = PdfController;
