
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const ACCESS_LEVELS = {
    'ADMIN': 'Full Access (Users, Settings, All Data)',
    'INTERNAL': 'Operational Access (Products, Invoices, Orders)',
    'CUSTOMER': 'Personal Access (Own History Only)'
};

async function exportUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                role: true,
                email: true,
                // we don't select password hash as requested, we provide the known default
            }
        });

        const exportData = users.map(u => ({
            role: u.role,
            email: u.email,
            password: 'password123', // Default for all generated/demo accounts
            access_level: ACCESS_LEVELS[u.role as keyof typeof ACCESS_LEVELS] || 'Unknown'
        }));

        const outputPath = path.join(__dirname, '../../users_export.json');
        fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

        console.log(`Successfully exported ${users.length} users to ${outputPath}`);
        console.log('Preview of first 3 users:', JSON.stringify(exportData.slice(0, 3), null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

exportUsers();
