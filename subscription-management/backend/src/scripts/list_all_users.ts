
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ACCESS_LEVELS = {
    'ADMIN': 'Full Access (Users, Settings, All Data)',
    'INTERNAL': 'Operational Access (Products, Invoices, Orders)',
    'CUSTOMER': 'Personal Access (Own History Only)'
};

async function listUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });

        console.table(users.map(u => ({
            Role: u.role,
            Email: u.email,
            Password: '[HASHED] ********',
            'Access Level': ACCESS_LEVELS[u.role as keyof typeof ACCESS_LEVELS] || 'Unknown'
        })));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

listUsers();
