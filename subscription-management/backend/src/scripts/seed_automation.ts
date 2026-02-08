import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding automation logs...');

    // Clear existing logs
    await prisma.automationLog.deleteMany();

    const logs = [
        {
            workflow: 'Invoice Generation',
            action: 'Invoice Generated',
            target: 'INV-2026-003',
            records: 45,
            status: 'completed',
            triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            duration: '1.2s'
        },
        {
            workflow: 'Payment Reminder',
            action: 'Payment Reminder Sent',
            target: '23 customers',
            records: 23,
            status: 'completed',
            triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            duration: '0.8s'
        },
        {
            workflow: 'Subscription Renewal',
            action: 'Subscriptions Renewed',
            target: '156 subscriptions',
            records: 156,
            status: 'completed',
            triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
            duration: '2.5s'
        },
        {
            workflow: 'Churn Analysis',
            action: 'Churn Analysis Running',
            target: 'All customers',
            records: 0,
            status: 'running',
            triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            duration: null
        },
        {
            workflow: 'Welcome Email',
            action: 'Welcome Email Sent',
            target: '12 new users',
            records: 12,
            status: 'completed',
            triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
            duration: '0.5s'
        }
    ];

    for (const log of logs) {
        await prisma.automationLog.create({
            data: log
        });
    }

    console.log('Successfully seeded automation logs');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
