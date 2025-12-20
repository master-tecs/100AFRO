// Script to migrate bcrypt passwords to Edge-compatible format
import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth-edge';

async function migratePasswords() {
  console.log('🔄 Starting password migration...');
  
  const users = await prisma.user.findMany({
    where: {
      password: {
        not: null,
      },
    },
  });

  for (const user of users) {
    if (user.password && user.password.startsWith('$2')) {
      // This is a bcrypt hash - we need to reset it
      // In production, you would ask users to reset their passwords
      // For now, we'll set a temporary password that matches the seed
      if (user.email === 'admin@100afro.com') {
        const { hash, salt } = await hashPassword('12345678');
        await prisma.user.update({
          where: { id: user.id },
          data: {
            password: hash,
            passwordSalt: salt,
          },
        });
        console.log(`✅ Migrated password for ${user.email}`);
      } else {
        console.log(`⚠️  User ${user.email} needs password reset`);
      }
    }
  }

  console.log('✅ Password migration complete');
  await prisma.$disconnect();
}

migratePasswords().catch(console.error);

