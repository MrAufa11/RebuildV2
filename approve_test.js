const { Registrant } = require('./backend/models');

async function approve() {
    const r = await Registrant.findOne({ where: { email: 'admintestlengkap@gmail.com' } });
    if (r) {
        console.log('Current status:', r.status, 'Payment:', r.paymentStatus);
        await r.update({
            status: 'Graduated',
            paymentStatus: 'Verified',
            documentUrl: 'http://example.com/doc', // just in case
            nisn: '2024RG1234'
        });

        // Also need to create Student record as RegistrantController does
        const { Student } = require('./backend/models');
        const existingStudent = await Student.findOne({ where: { email: r.email } });
        if (!existingStudent) {
            await Student.create({
                registration_id: r.id,
                email: r.email,
                full_name: r.fullName,
                nisn: '2024RG1234',
                phone_number: r.phone,
                school_name: r.schoolOrigin,
                admission_status: 0
            });
            console.log('Student record created');
        }

        console.log('Updated successfully to Graduated and Verified');
    } else {
        console.log('Registrant not found');
    }
}

approve().then(() => process.exit(0)).catch(console.error);
