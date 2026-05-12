#!/usr/bin/env node
'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/database');

async function runMigration() {
    console.log('🚀 Running migration: Add approvedAmount to Registrants table...\n');

    // Create Sequelize instance for SPMB database
    const sequelize = new Sequelize({
        ...config.spmb,
        logging: false
    });

    const queryInterface = sequelize.getQueryInterface();

    try {
        // Check if column already exists
        const tableDescription = await queryInterface.describeTable('Registrants');
        
        if (tableDescription.approvedAmount) {
            console.log('⚠️  Column "approvedAmount" already exists. Skipping migration.\n');
            return;
        }

        console.log('➕ Adding column "approvedAmount" to Registrants table...');
        await queryInterface.addColumn('Registrants', 'approvedAmount', {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            comment: 'Frozen payment amount after verification (prevents changes when fee is updated)'
        });
        console.log('✅ Column "approvedAmount" added successfully!\n');

        // Verify the column was added
        const updatedDescription = await queryInterface.describeTable('Registrants');
        if (updatedDescription.approvedAmount) {
            console.log('✅ Migration verified: Column exists in database.\n');
        } else {
            console.error('❌ Migration failed: Column not found after migration.\n');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }

    console.log('✨ Migration completed successfully!\n');
}

// Run migration
runMigration();
