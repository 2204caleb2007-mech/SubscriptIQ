
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
    try {
        const email = 'ashishmullasserymenon75@gmail.com';
        console.log(`Promoting ${email} to ADMIN...`);

        const user = await prisma.user.upsert({
            where: { email },
            update: { role: 'ADMIN' },
            create: {
                email,
                name: 'Ashish (Admin)',
                role: 'ADMIN',
                password: 'google-oauth-placeholder', // This is just a placeholder
                status: 'active'
            }
        });

        console.log('User updated:', user);
    } catch (error) {
        console.error('Error updating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

makeAdmin();
