export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { run, get } from '@/lib/db';
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

    const user = await get<{ id: number }>('SELECT id FROM users WHERE email = $1', [body.email.toLowerCase()]);
    
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
    await run(
      `INSERT INTO otp_codes (user_id, code, type, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [user.id, code, 'password_reset', expiresAt.toISOString()]
    );

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

