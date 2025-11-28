export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = registerSchema.safeParse({
      fullName: body.fullName,
      email: body.email,
      konamiId: body.konamiId,
      efootballPassword: body.efootballPassword,
      platform: body.platform,
      password: body.password,
    });

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase();

    // Check if email already exists
    const existingUserResult = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existingUserResult.rows.length > 0) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if Konami ID already exists
    const existingIdResult = await query(
      'SELECT id FROM users WHERE efootball_id = $1',
      [body.konamiId]
    );
    if (existingIdResult.rows.length > 0) {
      return NextResponse.json(
        { message: 'Konami ID already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password);

    // Create user and get the inserted ID
    const userResult = await query(
      `INSERT INTO users (email, password, full_name, phone, efootball_id, platform, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'player', 'pending')
       RETURNING id`,
      [
        email,
        hashedPassword,
        body.fullName,
        body.phone ?? 'N/A',
        body.konamiId,
        body.platform,
      ]
    );

    const userId = userResult.rows[0].id;

    // Auto-register for tournament (tournament ID 1)
    const tournamentId = 1;
    await query(
      `INSERT INTO registrations (user_id, tournament_id, payment_status)
       VALUES ($1, $2, 'pending')`,
      [userId, tournamentId]
    );

    // Create notification
    await query(
      `INSERT INTO notifications (user_id, type, title, message)
       VALUES ($1, 'system', 'Registration Received', 'Your registration has been received and is pending admin approval.')`,
      [userId]
    );

    return NextResponse.json(
      { message: 'Registration successful! Admin approval pending.' },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
    console.error('Registration error:', error);
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
