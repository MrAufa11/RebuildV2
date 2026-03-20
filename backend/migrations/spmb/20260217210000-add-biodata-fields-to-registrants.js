'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // subEntryPath exists, skipping
        await queryInterface.addColumn('Registrants', 'birthPlace', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Registrants', 'birthDate', {
            type: Sequelize.DATEONLY,
            allowNull: true
        });
        await queryInterface.addColumn('Registrants', 'gender', {
            type: Sequelize.ENUM('Laki-Laki', 'Perempuan'),
            allowNull: true
        });
        await queryInterface.addColumn('Registrants', 'religion', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Registrants', 'schoolLevel', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Registrants', 'wave', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Registrants', 'registrationYear', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Registrants', 'subEntryPath');
        await queryInterface.removeColumn('Registrants', 'birthPlace');
        await queryInterface.removeColumn('Registrants', 'birthDate');
        await queryInterface.removeColumn('Registrants', 'gender');
        await queryInterface.removeColumn('Registrants', 'religion');
        await queryInterface.removeColumn('Registrants', 'schoolLevel');
        await queryInterface.removeColumn('Registrants', 'wave');
        await queryInterface.removeColumn('Registrants', 'registrationYear');
    }
};
