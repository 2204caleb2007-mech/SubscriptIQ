import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const resetAdmin = async () => {
    try {
        const email = 'admin@subscriptiq.com';
        const password = 'password123';

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upsert admin user
        const user = await prisma.user.upsert({
            where: { email },
            update: { password: hashedPassword },
            create: {
                email,
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN',
                status: 'active'
            }
        });

        console.log(`✅ Admin user ${user.email} password reset to: ${password}`);
    } catch (error) {
        console.error('❌ Reset failed:', error);
    } finally {
        await prisma.$disconnect();
    }
};

resetAdmin();
