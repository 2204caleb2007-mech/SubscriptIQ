import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

const generateLargeDataset = () => {
    const users: any[] = [];
    const transactions: any[] = [];

    // 1. Generate 220 Customers
    for (let i = 0; i < 220; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        users.push({
            name: `${firstName} ${lastName}`,
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            avatar: faker.image.avatar(),
            company: faker.company.name(),
            role: 'CUSTOMER'
        });
    }

    // 2. Generate Transactions for these customers over the last 12 months
    // We want some "spikes" (black friday, end of month) and some gaps.

    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    users.forEach(user => {
        // Each user has 10-40 transactions
        const txCount = faker.number.int({ min: 10, max: 40 });

        for (let j = 0; j < txCount; j++) {
            const date = faker.date.between({ from: startDate, to: new Date() });

            // Simulate spikes: Higher amounts on certain dates or just random high value
            let amount = parseFloat(faker.finance.amount({ min: 10, max: 500, dec: 2 }));

            // 10% chance of high value (Enterprise plan / Annual)
            if (Math.random() > 0.9) {
                amount = parseFloat(faker.finance.amount({ min: 1000, max: 5000, dec: 2 }));
            }

            transactions.push({
                date: date.toISOString().split('T')[0], // YYYY-MM-DD
                amount: amount,
                email: user.email,
                status: Math.random() > 0.1 ? 'completed' : 'failed' // 90% success rate
            });
        }
    });

    // Sort transactions by date
    transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const data = {
        users,
        transactions
    };

    const outputPath = path.join(__dirname, '../data/large_dataset.json');
    // Ensure data dir exists
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✅ Generated ${users.length} users and ${transactions.length} transactions.`);
    console.log(`📂 Saved to ${outputPath}`);
};

generateLargeDataset();
