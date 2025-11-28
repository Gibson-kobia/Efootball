export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { run } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    
    await run('UPDATE users SET status = $1 WHERE id = $2', ['rejected', parseInt(params.id)]);
    
    // Create notification
    await run(
      `INSERT INTO notifications (user_id, type, title, message)
       VALUES ($1, $2, $3, $4)`,
      [parseInt(params.id), 'system', 'Registration Rejected', 'Your registration has been rejected. Please contact support for more information.']
    );
    
    return NextResponse.json({ message: 'User rejected successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to reject user';
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

