'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // 1. Generate Fake Teachers
        const teachers = [];
        for (let i = 0; i < 15; i++) {
            teachers.push({
                name: faker.person.fullName(),
                position: faker.person.jobTitle(),
                image_url: faker.image.avatar(),
                quote: faker.lorem.sentence(),  // Fixed: bio -> quote
                order: i + 1,                   // Fixed: added order
                is_active: true,                // Fixed: added is_active
                createdAt: now,
                updatedAt: now
            });
        }
        await queryInterface.bulkInsert('Teachers', teachers);

        // 2. Generate Fake Galleries
        const galleries = [];
        const categories = ['Kegiatan', 'Fasilitas', 'Prestasi', 'Lomba'];
        for (let i = 0; i < 20; i++) {
            galleries.push({
                title: faker.lorem.words(3),
                description: faker.lorem.sentence(),
                image_url: faker.image.urlLoremFlickr({ category: 'school,students' }),
                category: categories[Math.floor(Math.random() * categories.length)],
                createdAt: now,
                updatedAt: now
            });
        }
        await queryInterface.bulkInsert('Galleries', galleries);

        // 3. Generate Fake Articles
        const articles = [];
        for (let i = 0; i < 20; i++) {
            const title = faker.lorem.sentence(5);
            articles.push({
                title: title,
                slug: faker.helpers.slugify(title).toLowerCase() + '-' + faker.string.nanoid(4),
                content: `<p>${faker.lorem.paragraphs(3)}</p>`,
                excerpt: faker.lorem.sentences(2),
                image_url: faker.image.urlLoremFlickr({ category: 'education' }),
                category_id: faker.number.int({ min: 1, max: 3 }),
                author_id: 1,
                published_at: faker.date.past(),
                status: 'published', // Fixed: is_published -> status enum
                createdAt: now,
                updatedAt: now
            });
        }
        await queryInterface.bulkInsert('Articles', articles);
    },

    async down(queryInterface, Sequelize) {
        // No rollback logic needed for massivedummy data usually
    }
};
