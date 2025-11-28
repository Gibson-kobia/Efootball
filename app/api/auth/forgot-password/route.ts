import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateOTP } from '@/lib/utils';
import { passwordResetSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = passwordResetSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const db = getDb();
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(body.email.toLowerCase()) as { id: number } | undefined;
    
    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json(
        { message: 'If an account exists with this email, a reset code has been sent.' },
        { status: 200 }
      );
    }

    // Generate OTP
    const code = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes

    // Save OTP
    db.prepare(`
      INSERT INTO otp_codes (user_id, code, type, expires_at)
      VALUES (?, ?, 'password_reset', ?)
    `).run(user.id, code, expiresAt.toISOString());

    // TODO: Send email with OTP
    // For now, we'll just log it (in production, use nodemailer)
    console.log(`Password reset OTP for ${body.email}: ${code}`);

    return NextResponse.json({
      message: 'If an account exists with this email, a reset code has been sent.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to process request';
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

