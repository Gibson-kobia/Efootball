import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { verifyPassword, createToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const db = getDb();

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(body.email.toLowerCase()) as any;
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(body.password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if account is approved
    if (user.status !== 'approved') {
      return NextResponse.json(
        { message: 'Your account is pending admin approval' },
        { status: 403 }
      );
    }

    // Create token
    const token = await createToken({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      efootball_id: user.efootball_id,
      platform: user.platform,
      role: user.role,
      status: user.status,
      email_verified: user.email_verified,
      phone_verified: user.phone_verified,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

