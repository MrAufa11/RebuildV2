const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const { databases } = require('../models');
const Registrant = require('../models/spmb/registrant')(databases.spmb, require('sequelize').DataTypes);

const PdfController = {
    async generateCard(req, res) {
        try {
            // Find registrant (using the token's authenticated ID or param)
            let registrant;
            if (req.params.id) {
                registrant = await Registrant.findByPk(req.params.id);
            } else {
                // If student site, req.userId is from student_users table
                const StudentUser = require('../models/spmb/student-user')(databases.spmb, require('sequelize').DataTypes);
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
            console.error('Error generating card:', error);
            res.status(500).json({ message: 'Failed to generate card' });
        }
    },

    async generateGraduation(req, res) {
        try {
            let registrant;
            if (req.params.id) {
                registrant = await Registrant.findByPk(req.params.id);
            } else {
                const StudentUser = require('../models/spmb/student-user')(databases.spmb, require('sequelize').DataTypes);
                const sUser = await StudentUser.findByPk(req.userId);
                if (sUser) {
                    registrant = await Registrant.findOne({ where: { email: sUser.email } });
                }
            }

            if (!registrant) return res.status(404).json({ message: 'Registrant not found' });
            if (registrant.status !== 'Graduated') {
                return res.status(403).json({ message: 'Belum Lulus / Belum ada pengumuman' });
            }

            const templatePath = path.join(__dirname, '../templates/surat_kelulusan.pdf');
            if (!fs.existsSync(templatePath)) return res.status(500).json({ message: 'Template not found' });

            const existingPdfBytes = fs.readFileSync(templatePath);
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            const { height } = firstPage.getSize();
            const size = 12;
            const color = rgb(0, 0, 0);

            const regNo = `${registrant.registrationYear}-REG-${String(registrant.id).padStart(4, '0')}`;

            firstPage.drawText(regNo, { x: 200, y: height - 250, size, color });
            firstPage.drawText(registrant.fullName, { x: 200, y: height - 270, size, color });
            firstPage.drawText(registrant.schoolOrigin || '-', { x: 200, y: height - 290, size, color });

            const pdfBytes = await pdfDoc.save();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=Surat_Kelulusan_${registrant.fullName.replace(/\s+/g, '_')}.pdf`);
            res.end(Buffer.from(pdfBytes));

        } catch (error) {
            console.error('Error generating graduation letter:', error);
            res.status(500).json({ message: 'Failed to generate graduation letter' });
        }
    }
};

module.exports = PdfController;
