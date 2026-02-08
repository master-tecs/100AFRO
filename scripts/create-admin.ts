import { prisma } from "../lib/prisma";

async function hashPasswordEdge(
  password: string
): Promise<{ hash: string; salt: string }> {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const saltBase64 = btoa(String.fromCharCode(...saltBytes));

  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    256
  );

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return { hash: hashHex, salt: saltBase64 };
}

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@100afro.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Admin User";

  // Hash password
  const { hash: hashedPassword, salt: passwordSalt } = await hashPasswordEdge(password);

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
          passwordSalt: passwordSalt, // Add this field
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
        passwordSalt: passwordSalt,
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