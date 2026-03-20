const { Registrant, RegistrationBatch, RegistrationPath, Income } = require('../models');
const { Op } = require('sequelize');

class DashboardController {
    static async getSpmbStats(req, res) {
        try {
            const yearStr = req.query.year || new Date().getFullYear().toString();
            // Try fetching basic stats per year
            const allRegistrants = await Registrant.findAll({ where: { registrationYear: yearStr } });

            // Stats 1: "Total Pendaftar", "Terkonfirmasi", "Diterima", "Ditolak"
            const total = allRegistrants.length;
            const verified = allRegistrants.filter(r => r.paymentStatus === 'Verified').length;
            const accepted = allRegistrants.filter(r => r.status === 'Approved' || r.status === 'Graduated').length;
            const rejected = allRegistrants.filter(r => r.status === 'Rejected').length;

            // Stats 2: Statistik Gelombang (Donut - counts by Batch / Wave)
            // If they don't have wave exactly, maybe use SubPath or just wave column if exists
            const waveCounts = {};
            allRegistrants.forEach(r => {
                const w = r.wave || 'Gelombang 1';
                waveCounts[w] = (waveCounts[w] || 0) + 1;
            });
            const waveStats = Object.keys(waveCounts).map(k => ({ label: k, value: waveCounts[k] }));

            // Stats 3: Statistik Jalur (Bar - by entryPath)
            const pathCounts = {};
            allRegistrants.forEach(r => {
                const p = r.entryPath || 'Reguler';
                pathCounts[p] = (pathCounts[p] || 0) + 1;
            });
            const pathStats = Object.keys(pathCounts).map(k => ({ label: k, value: pathCounts[k] }));

            // Stats 4: Statistik Jenis Kelamin (Pie)
            const genderCounts = { 'Laki-Laki': 0, 'Perempuan': 0 };
            allRegistrants.forEach(r => {
                const g = r.gender || 'Laki-Laki';
                if (genderCounts[g] !== undefined) genderCounts[g]++;
            });

            // Stats 5: Line Chart bulanan
            const monthlyCounts = new Array(12).fill(0);
            allRegistrants.forEach(r => {
                if (r.createdAt) {
                    const d = new Date(r.createdAt);
                    // Match month. If index 0 is August, then August = month 7 (0-indexed).
                    // We will just return 1..12 and let frontend map it
                    monthlyCounts[d.getMonth()]++;
                }
            });

            return res.json({
                success: true,
                data: {
                    summary: { total, verified, accepted, rejected },
                    waveStats,
                    pathStats,
                    genderStats: genderCounts,
                    monthlyStats: monthlyCounts
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
}

module.exports = DashboardController;
