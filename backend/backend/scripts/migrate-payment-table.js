const { databases } = require('../models');
const spmbDb = databases.spmb;

async function runMigration() {
    console.log('🚀 Starting payment table migration...\n');
    
    try {
        // Test connection
        await spmbDb.authenticate();
        console.log('✅ Connected to database successfully\n');
        
        // Check if table exists
        const [tables] = await spmbDb.query(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 're_registration_payment'
        `);
        
        if (!tables || tables.length === 0) {
            console.log('❌ Table re_registration_payment not found!');
            console.log('Please create the table first.');
            return;
        }
        
        console.log('✅ Table re_registration_payment exists\n');
        
        // Get current columns
        const columns = await spmbDb.query(`
            DESCRIBE re_registration_payment
        `, { type: databases.sequelize.QueryTypes.DESCRIBE });
        
        const currentColumns = Object.keys(columns);
        console.log('📋 Current columns:', currentColumns.join(', '));
        console.log('');
        
        // Columns to add
        const columnsToAdd = [
            { name: 'fee_id', sql: 'ALTER TABLE re_registration_payment ADD COLUMN fee_id INT NULL AFTER student_id' },
            { name: 'bank_id', sql: 'ALTER TABLE re_registration_payment ADD COLUMN bank_id INT NULL AFTER fee_id' },
            { name: 'bank_name', sql: 'ALTER TABLE re_registration_payment ADD COLUMN bank_name VARCHAR(100) NULL AFTER bank_id' },
            { name: 'account_number', sql: 'ALTER TABLE re_registration_payment ADD COLUMN account_number VARCHAR(50) NULL AFTER bank_name' },
            { name: 'payment_method', sql: 'ALTER TABLE re_registration_payment ADD COLUMN payment_method VARCHAR(50) DEFAULT \'Transfer Bank\' AFTER payment_proof' },
            { name: 'rejection_reason', sql: 'ALTER TABLE re_registration_payment ADD COLUMN rejection_reason TEXT NULL AFTER verified_at' },
            { name: 'paid_by_user_id', sql: 'ALTER TABLE re_registration_payment ADD COLUMN paid_by_user_id INT NULL AFTER payment_status' }
        ];
        
        // Add columns
        console.log('🔧 Adding new columns...\n');
        for (const col of columnsToAdd) {
            if (currentColumns.includes(col.name)) {
                console.log(`⚠️  Column ${col.name} already exists, skipping...`);
            } else {
                try {
                    await spmbDb.query(col.sql);
                    console.log(`✅ Added column: ${col.name}`);
                } catch (error) {
                    console.log(`❌ Error adding ${col.name}: ${error.message}`);
                }
            }
        }
        
        console.log('');
        
        // Add indexes
        console.log('📊 Creating indexes...\n');
        const indexes = [
            { name: 'idx_fee_id', sql: 'CREATE INDEX idx_fee_id ON re_registration_payment(fee_id)' },
            { name: 'idx_bank_id', sql: 'CREATE INDEX idx_bank_id ON re_registration_payment(bank_id)' },
            { name: 'idx_payment_status', sql: 'CREATE INDEX idx_payment_status ON re_registration_payment(payment_status)' },
            { name: 'idx_payment_date', sql: 'CREATE INDEX idx_payment_date ON re_registration_payment(payment_date)' }
        ];
        
        for (const idx of indexes) {
            try {
                await spmbDb.query(idx.sql);
                console.log(`✅ Created index: ${idx.name}`);
            } catch (error) {
                if (error.code === 'ER_DUP_KEYNAME') {
                    console.log(`⚠️  Index ${idx.name} already exists, skipping...`);
                } else {
                    console.log(`❌ Error creating ${idx.name}: ${error.message}`);
                }
            }
        }
        
        console.log('');
        
        // Update existing records
        console.log('🔄 Updating existing records...\n');
        const [updateResult] = await spmbDb.query(`
            UPDATE re_registration_payment 
            SET payment_date = DATE(created_at) 
            WHERE payment_date IS NULL
        `);
        console.log(`✅ Updated ${updateResult.affectedRows || 0} records with null payment_date\n`);
        
        // Show final table structure
        console.log('📋 Final table structure:\n');
        const finalStructure = await spmbDb.query(`DESCRIBE re_registration_payment`, { 
            type: databases.sequelize.QueryTypes.DESCRIBE 
        });
        
        console.log('Column Name          | Type              | Null | Key | Default');
        console.log('---------------------|-------------------|------|-----|--------');
        for (const [colName, colInfo] of Object.entries(finalStructure)) {
            console.log(`${colName.padEnd(20)} | ${String(colInfo.Type).padEnd(17)} | ${colInfo.Null.padEnd(4)} | ${String(colInfo.Key).padEnd(3)} | ${colInfo.Default || 'NULL'}`);
        }
        
        console.log('\n✅ Migration completed successfully!\n');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('Error details:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

runMigration();
