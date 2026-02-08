import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAllDates() {
    console.log('🔧 Comprehensive subscription date fix...');

    // Get all customers with their subscriptions and invoices
    const customers = await prisma.customer.findMany({
        include: {
            subscriptions: true,
            invoices: {
                orderBy: { createdAt: 'asc' },
                take: 1
            }
        }
    });

    console.log(`Found ${customers.length} customers.`);

    let updated = 0;
    let skipped = 0;

    for (const customer of customers) {
        const firstInvoice = customer.invoices[0];

        if (!firstInvoice) {
            skipped++;
            continue;
        }

        const startDate = firstInvoice.createdAt;

        // Update customer joinDate
        await prisma.customer.update({
            where: { id: customer.id },
            data: {
                joinDate: startDate,
                createdAt: startDate
            }
        });

        // Update ALL subscriptions for this customer
        for (const sub of customer.subscriptions) {
            await prisma.subscription.update({
                where: { id: sub.id },
                data: {
                    startDate: startDate,
                    createdAt: startDate
                }
            });
            updated++;
        }
    }

    console.log(`✅ Updated ${updated} subscriptions.`);
    console.log(`⚠️  Skipped ${skipped} customers with no invoices.`);
}

fixAllDates()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
