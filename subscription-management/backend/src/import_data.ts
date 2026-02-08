import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const importData = async () => {
    try {
        console.log('🗑️  Clearing existing data (payments, invoices, customers, subs)...');
        // Clear in order of dependencies (child first)
        await prisma.payment.deleteMany({});
        await prisma.invoice.deleteMany({});
        await prisma.subscription.deleteMany({});
        await prisma.customer.deleteMany({});

        // Load JSON data
        const dataPath = path.join(__dirname, 'data', 'large_dataset.json');

        if (!fs.existsSync(dataPath)) {
            console.error('❌ Data file not found:', dataPath);
            return;
        }

        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const dataset = JSON.parse(rawData);

        console.log(`📂 Loaded ${dataset.users.length} users and ${dataset.transactions.length} transactions.`);

        // 1. Create Users & Customers
        console.log('👥 Creating users and customers...');
        let userCount = 0;
        for (const u of dataset.users) {
            // Upsert User (Credentials)
            // Using a placeholder hash for 'password123'
            // $2b$10$EpIxNwllqvFA6sF/L2U3e.Sg.a.a.a.a.a.a.a is not valid, let's use a known valid one or just let the reset script handle admin.
            // For customers, we might not login, but let's try to be valid.
            // Using a simple hash if we had bcrypt, but here just use a string.
            await prisma.user.upsert({
                where: { email: u.email },
                update: {},
                create: {
                    name: u.name,
                    email: u.email,
                    password: '$2b$10$FIXME_HASH_FOR_PASSWORD123',
                    role: u.role,
                    avatar: u.avatar
                }
            });

            // Upsert Customer (Billing Profile)
            await prisma.customer.upsert({
                where: { email: u.email },
                update: {},
                create: {
                    name: u.name,
                    email: u.email,
                    company: u.company
                }
            });
            userCount++;
            if (userCount % 10 === 0) process.stdout.write('.');
        }
        console.log('\n✅ Users created.');

        // Ensure Plans exist
        let plan = await prisma.plan.findFirst();
        if (!plan) {
            const product = await prisma.product.create({
                data: { name: 'Starter Product', category: 'Software', price: 100 }
            });
            plan = await prisma.plan.create({
                data: { name: 'Pro Plan', productId: product.id, billing: 'MONTHLY', price: 100 }
            });
        }

        // 2. Process transactions
        console.log('💸 Processing transactions...');
        let txCount = 0;
        for (const t of dataset.transactions) {
            // 1. Find Customer
            let customer = await prisma.customer.findUnique({ where: { email: t.email } });
            if (!customer) continue;

            // 2. Find or Create Subscription
            let sub = await prisma.subscription.findFirst({ where: { customerId: customer.id } });
            if (!sub) {
                sub = await prisma.subscription.create({
                    data: {
                        customerId: customer.id,
                        planId: plan.id,
                        status: 'ACTIVE',
                        mrr: plan.price
                    }
                });
            }

            // 3. Create Invoice
            const invoice = await prisma.invoice.create({
                data: {
                    customerId: customer.id,
                    subscriptionId: sub.id,
                    amount: t.amount,
                    status: t.status === 'completed' ? 'PAID' : 'PENDING',
                    dueDate: new Date(t.date),
                    paidDate: t.status === 'completed' ? new Date(t.date) : null
                }
            });

            // 4. Create Payment (if completed)
            if (t.status === 'completed') {
                await prisma.payment.create({
                    data: {
                        invoiceId: invoice.id,
                        amount: t.amount,
                        method: 'Credit Card',
                        status: 'completed',
                        date: new Date(t.date)
                    }
                });
            }
            txCount++;
            if (txCount % 50 === 0) process.stdout.write('.');
        }
        console.log('\n✅ Transactions imported successfully!');

    } catch (error) {
        console.error('❌ Import failed:', error);
    } finally {
        await prisma.$disconnect();
    }
};

importData();
