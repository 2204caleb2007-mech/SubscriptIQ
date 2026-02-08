import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEMO_USERS = [
    'admin@subscriptiq.com',
    'staff@subscriptiq.com',
    'casimer_feest8@gmail.com',
    'cierra_bode37@gmail.com'
];

async function resetPasswords() {
    console.log('🔐 Resetting passwords for demo users...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    for (const email of DEMO_USERS) {
        try {
            const user = await prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            });
            console.log(`✅ Updated password for ${email}`);
        } catch (e) {
            console.error(`❌ Failed to update ${email}: User not found?`);
        }
    }
}

resetPasswords()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
