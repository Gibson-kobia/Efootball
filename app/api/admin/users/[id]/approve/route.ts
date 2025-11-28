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
    
    await run('UPDATE users SET status = $1 WHERE id = $2', ['approved', parseInt(params.id)]);
    
    // Create notification
    await run(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES ($1, $2, $3, $4, $5)`,
      [parseInt(params.id), 'system', 'Account Approved', 'Your registration has been approved! You can now participate in the tournament.', '/dashboard']
    );
    
    return NextResponse.json({ message: 'User approved successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to approve user';
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

