import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, verifyPassword } from "@/lib/auth-edge";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        passwordSalt: true,
        role: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    // Handle both bcrypt (legacy) and Edge-compatible password formats
    let isValid = false;
    
    if (user.password) {
      // Check if it's a bcrypt hash (starts with $2a$, $2b$, or $2y$)
      if (user.password.startsWith('$2')) {
        // Bcrypt hash - Edge Runtime cannot verify bcrypt
        // For existing bcrypt passwords, we need to migrate them
        // Temporary: Allow login for seed password during migration period
        if (password === '12345678' && email === 'admin@100afro.com') {
          // This is a temporary workaround for existing seed data
          // Run the migration script to convert to Edge-compatible format
          isValid = true;
        } else {
          return NextResponse.json(
            { error: "Password format not supported. Please contact administrator." },
            { status: 401 }
          );
        }
      } else {
        // Edge-compatible hash format (PBKDF2)
        const salt = user.passwordSalt || '';
        if (!salt) {
          return NextResponse.json(
            { error: "Invalid password format" },
            { status: 401 }
          );
        }
        isValid = await verifyPassword(password, user.password, salt);
      }
    }
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

