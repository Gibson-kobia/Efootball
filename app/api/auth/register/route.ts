import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
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

    const db = getDb();

    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(body.email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if Konami ID already exists
    const existingId = db.prepare('SELECT id FROM users WHERE efootball_id = ?').get(body.konamiId);
    if (existingId) {
      return NextResponse.json(
        { message: 'Konami ID already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password);

    // Create user
    const result = db.prepare(`
      INSERT INTO users (email, password, full_name, phone, efootball_id, platform, role, status)
      VALUES (?, ?, ?, ?, ?, ?, 'player', 'pending')
    `).run(
      body.email.toLowerCase(),
      hashedPassword,
      body.fullName,
      body.phone ?? 'N/A',
      body.konamiId,
      body.platform
    );

    // Auto-register for tournament (tournament ID 1)
    const tournamentId = 1;
    db.prepare(`
      INSERT INTO registrations (user_id, tournament_id, payment_status)
      VALUES (?, ?, 'pending')
    `).run(result.lastInsertRowid, tournamentId);

    // Create notification
    db.prepare(`
      INSERT INTO notifications (user_id, type, title, message)
      VALUES (?, 'system', 'Registration Received', 'Your registration has been received and is pending admin approval.')
    `).run(result.lastInsertRowid);

    return NextResponse.json(
      { message: 'Registration successful! Admin approval pending.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

