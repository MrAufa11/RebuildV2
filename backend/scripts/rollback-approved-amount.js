#!/usr/bin/env node
'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/database');

async function rollbackMigration() {
    console.log('🔄 Rolling back migration: Remove approvedAmount from Registrants table...\n');

    // Create Sequelize instance for SPMB database
    const sequelize = new Sequelize({
        ...config.spmb,
        logging: false
    });

    const queryInterface = sequelize.getQueryInterface();

    try {
        // Check if column exists
        const tableDescription = await queryInterface.describeTable('Registrants');
        
        if (!tableDescription.approvedAmount) {
            console.log('⚠️  Column "approvedAmount" does not exist. Nothing to rollback.\n');
            return;
        }

        console.log('➖ Removing column "approvedAmount" from Registrants table...');
        await queryInterface.removeColumn('Registrants', 'approvedAmount');
        console.log('✅ Column "approvedAmount" removed successfully!\n');

        // Verify the column was removed
        const updatedDescription = await queryInterface.describeTable('Registrants');
        if (!updatedDescription.approvedAmount) {
            console.log('✅ Rollback verified: Column removed from database.\n');
        } else {
            console.error('❌ Rollback failed: Column still exists after rollback.\n');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Rollback failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }

    console.log('✨ Rollback completed successfully!\n');
}

// Run rollback
rollbackMigration();
