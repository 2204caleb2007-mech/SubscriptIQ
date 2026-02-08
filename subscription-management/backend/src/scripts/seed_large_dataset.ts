import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const DATA_FILE = path.join(__dirname, '../data/large_dataset.json');

async function seed() {
    console.log('🌱 Starting seed...');

    if (!fs.existsSync(DATA_FILE)) {
        console.error('❌ Data file not found! Run generate_large_dataset.ts first.');
        process.exit(1);
    }

    const { users, transactions } = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    // 1. Clear existing data (optional, but good for clean state if re-running)
    // Be careful in prod, but fine for dev
    // await prisma.payment.deleteMany();
    // await prisma.invoice.deleteMany();
    // await prisma.subscription.deleteMany();
    // await prisma.customer.deleteMany();
    // await prisma.user.deleteMany(); // Maybe keep admin?

    // For now, let's just upsert to avoid duplicates if partial run

    // Create base product/plan
    const product = await prisma.product.upsert({
        where: { id: 'prod_standard' },
        update: {},
        create: {
            id: 'prod_standard',
            name: 'Standard Subscription',
            category: 'software',
            price: 29.99,
        }
    });

    const plan = await prisma.plan.upsert({
        where: { id: 'plan_standard_monthly' },
        update: {},
        create: {
            id: 'plan_standard_monthly',
            name: 'Standard Monthly',
            productId: product.id,
            billing: 'MONTHLY',
            price: 29.99
        }
    });

    console.log('📦 Base Product & Plan ensured.');

    // 2. Import Users & Customers
    console.log(`👤 Importing ${users.length} users...`);

    for (const u of users) {
        // Create User (for login)
        await prisma.user.upsert({
            where: { email: u.email },
            update: {
                role: u.role,
                avatar: u.avatar,
                company: u.company
            },
            create: {
                email: u.email,
                name: u.name,
                password: 'password123', // Default
                role: u.role,
                avatar: u.avatar,
                company: u.company,
                status: 'active'
            }
        });

        // Create Customer (for billing)
        // Some users might not be customers if they are admins, but in our gen script 
        // they are marked as ROLE=CUSTOMER mostly.
        if (u.role === 'CUSTOMER') {
            await prisma.customer.upsert({
                where: { email: u.email },
                update: {
                    company: u.company
                },
                create: {
                    email: u.email,
                    name: u.name,
                    company: u.company,
                    status: 'active'
                }
            });
        }
    }

    // 3. Import Transactions -> Invoices -> Payments
    console.log(`💰 Importing ${transactions.length} transactions...`);

    // Helper map to avoid fetching customer every time
    // But for 200 users, maybe just query is fine or map them first.
    // Let's just query by email as we go, it's a script.

    for (const tx of transactions) {
        const customer = await prisma.customer.findUnique({ where: { email: tx.email } });

        if (!customer) {
            // console.warn(`⚠️ No customer found for ${tx.email}, skipping transaction.`);
            continue;
        }

        // Create/Ensure Subscription for this customer
        // Logic: specific to this dataset, let's assume they have one active sub
        // We'll upsert a subscription based on customerId to keep it simple 
        // (Customer <-> Sub 1:N but here 1:1 active)
        const sub = await prisma.subscription.findFirst({
            where: { customerId: customer.id }
        });

        let subId = sub?.id;

        if (!subId) {
            const newSub = await prisma.subscription.create({
                data: {
                    customerId: customer.id,
                    planId: plan.id,
                    status: 'ACTIVE',
                    startDate: new Date(), // Just current
                    mrr: plan.price
                }
            });
            subId = newSub.id;
        }

        // Create Invoice
        // We link invoice to subscription
        // Transaction date
        const txDate = new Date(tx.date);

        const invoice = await prisma.invoice.create({
            data: {
                customerId: customer.id,
                subscriptionId: subId,
                amount: tx.amount,
                status: tx.status === 'completed' ? 'PAID' : 'PENDING',
                dueDate: txDate,

                // If paid, paidDate is txDate
                paidDate: txDate,
                createdAt: txDate, // Backdate creation
            }
        });

        // Create Payment if completed
        if (tx.status === 'completed') {
            await prisma.payment.create({
                data: {
                    invoiceId: invoice.id,
                    amount: tx.amount,
                    method: 'CREDIT_CARD',
                    status: 'completed',
                    date: txDate,
                    createdAt: txDate
                }
            });
        }
    }

    console.log('✅ Seed completed successfully!');
}

seed()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
