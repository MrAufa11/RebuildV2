const { Registrant, StudentUser, App, Role } = require('../models');
const bcrypt = require('bcrypt');

const RegistrantController = {
    // Create new registrant
    async create(req, res) {
        try {
            const { fullName, email, phone, schoolOrigin, password, confirmPassword } = req.body;

            // Basic validation
            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Password dan Konfirmasi Password tidak cocok' });
            }

            // Check if application already exists
            const existingRegistrant = await Registrant.findOne({ where: { email } });
            if (existingRegistrant) {
                return res.status(400).json({ message: 'Email sudah terdaftar di data pendaftaran' });
            }

            // Check if student account already exists
            const existingStudent = await StudentUser.findOne({ where: { email } });
            if (existingStudent) {
                return res.status(400).json({ message: 'Email sudah terdaftar sebagai akun calon siswa' });
            }

            // Create Student User (SPMB DB)
            const hashedPassword = await bcrypt.hash(password, 10);
            const newStudent = await StudentUser.create({
                username: email.split('@')[0] + Math.floor(Math.random() * 1000), // Random username
                email,
                password: hashedPassword,
                isActive: true
            });

            // Create Registrant (SPMB DB) linked by email implicitly or we can add student_user_id to Registrant later
            const registrant = await Registrant.create({
                fullName,
                email,
                phone,
                schoolOrigin,
                status: 'Pending',
                entryPath: 'Reguler' // Default
            });

            return res.status(201).json({
                message: 'Pendaftaran akun berhasil! Silahkan login untuk melengkapi biodata.',
                data: { user: newStudent.id, registrant: registrant.id }
            });
        } catch (error) {
            // console.error('Registration Error:', error);
            return res.status(500).json({ message: 'Terjadi kesalahan saat mendaftar', error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const registrant = await Registrant.findByPk(id);
            if (!registrant) return res.status(404).json({ message: 'Registrant not found' });

            await registrant.update(updates);

            // Sync to Student if student record exists
            if (updates.biodataLengkap || updates.reRegistrationProof) {
                const { Student } = require('../models');
                const student = await Student.findOne({ where: { email: registrant.email } });
                if (student) {
                    let studentUpdates = {};
                    if (updates.biodataLengkap) studentUpdates.complete_biodata = updates.biodataLengkap;
                    if (updates.reRegistrationProof) studentUpdates.re_registration_status = 1; // Mark re-reg uploaded
                    await student.update(studentUpdates);
                }
            }

            return res.status(200).json({ message: 'Data updated successfully', data: registrant });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating registrant', error: error.message });
        }
    },

    async getMe(req, res) {
        try {
            // req.userId is available from verifyToken.
            let email;

            if (req.appType === 'spmb') {
                const student = await StudentUser.findByPk(req.userId);
                if (!student) return res.status(404).json({ message: 'Student Account not found' });
                email = student.email;
            } else {
                // Fallback for admins testing this endpoint or dual roles
                const { User } = require('../models');
                const user = await User.findByPk(req.userId);
                if (!user) return res.status(404).json({ message: 'User not found' });
                email = user.email;
            }

            const registrant = await Registrant.findOne({ where: { email } });
            if (!registrant) {
                return res.status(404).json({ message: 'Data pendaftaran tidak ditemukan untuk akun ini.' });
            }

            return res.status(200).json(registrant);
        } catch (error) {
            // console.error('getMe Error:', error);
            return res.status(500).json({ message: 'Error fetching my details', error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const { search, status, wave, entryPath } = req.query;

            const { Op } = require('sequelize');
            const where = {
                notes: { [Op.ne]: 'Hanya Akun' }
            };

            if (search) {
                where[Op.or] = [
                    { fullName: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } }
                ];
            }

            if (status) where.status = status;
            if (wave) where.wave = wave;
            if (entryPath) where.entryPath = entryPath;

            const { count, rows } = await Registrant.findAndCountAll({
                where,
                order: [['createdAt', 'ASC']],
                limit,
                offset
            });

            return res.status(200).json({
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit,
                data: rows
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching registrants', error: error.message });
        }
    },

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const registrant = await Registrant.findByPk(id);
            if (!registrant) return res.status(404).json({ message: 'Registrant not found' });
            return res.status(200).json(registrant);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching registrant', error: error.message });
        }
    },

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const { Registrant, Student } = require('../models');

            const registrant = await Registrant.findByPk(id);
            if (!registrant) return res.status(404).json({ message: 'Registrant not found' });

            let updates = { status };

            // Generate NISN when Graduated
            if (status === 'Graduated' && !registrant.nisn) {
                const year = registrant.registrationYear || new Date().getFullYear();
                const pathCode = registrant.entryPath === 'Prestasi' ? 'PR' : 'RG';
                const randPart = Math.floor(1000 + Math.random() * 9000);
                updates.nisn = `${year}${pathCode}${randPart}`;
            }

            // Sync to Student table if Graduated
            if (status === 'Graduated') {
                const existingStudent = await Student.findOne({ where: { email: registrant.email } });
                if (!existingStudent) {
                    await Student.create({
                        registration_id: registrant.id,
                        email: registrant.email,
                        full_name: registrant.fullName,
                        nisn: registrant.nisn || updates.nisn,
                        phone_number: registrant.phone,
                        school_name: registrant.schoolOrigin,
                        admission_status: 0 // Still in process (re-registration)
                    });
                }
            }

            await registrant.update(updates);
            return res.status(200).json({ message: 'Registrant status updated', data: registrant });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating status', error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const registrant = await Registrant.findByPk(id);
            if (!registrant) return res.status(404).json({ message: 'Registrant not found' });

            await registrant.destroy();
            return res.status(200).json({ message: 'Registrant deleted' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting registrant', error: error.message });
        }
    }
};

module.exports = RegistrantController;
