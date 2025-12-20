import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@100afro.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Admin User";

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (!prisma) {
      console.error('Prisma client is not available');
      return;
    }

    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      // Update existing admin with new password
      const admin = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: "ADMIN",
        },
      });
      console.log(`✅ Admin user password updated!`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log(`Role: ${admin.role}`);
      return;
    }

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Name: ${name}`);
    console.log(`Role: ${admin.role}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

createAdmin();
