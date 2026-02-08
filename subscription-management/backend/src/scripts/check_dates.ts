import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDates() {
    console.log('📅 Checking subscription dates...');

    const subs = await prisma.subscription.findMany({
        select: { createdAt: true }
    });

    console.log(`Total Subscriptions: ${subs.length}`);

    const distribution: Record<string, number> = {};

    subs.forEach(s => {
        const key = s.createdAt.toISOString().slice(0, 7); // YYYY-MM
        distribution[key] = (distribution[key] || 0) + 1;
    });

    console.table(distribution);
}

checkDates()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
