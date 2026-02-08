import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDates() {
    console.log('🔧 Fixing subscription dates...');

    // 1. Get all subscriptions
    const subs = await prisma.subscription.findMany({
        include: {
            invoices: {
                orderBy: { createdAt: 'asc' },
                take: 1
            }
        }
    });

    console.log(`Found ${subs.length} subscriptions.`);

    let updated = 0;

    for (const sub of subs) {
        // Find first invoice/payment date
        // In seed, we set invoice.createdAt to tx.date
        const firstInvoice = sub.invoices[0];
        if (firstInvoice) {
            const startDate = firstInvoice.createdAt;

            // Update subscription start date and createdAt
            await prisma.subscription.update({
                where: { id: sub.id },
                data: {
                    startDate: startDate,
                    createdAt: startDate
                }
            });

            // Also update Customer joinDate
            await prisma.customer.update({
                where: { id: sub.customerId },
                data: {
                    joinDate: startDate,
                    createdAt: startDate
                }
            });

            updated++;
        }
    }

    console.log(`✅ Updated ${updated} subscriptions/customers.`);
}

fixDates()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
