import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const db = getDb();
    
    db.prepare('UPDATE users SET status = ? WHERE id = ?')
      .run('approved', parseInt(params.id));
    
    // Create notification
    db.prepare(`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (?, 'system', 'Account Approved', 'Your registration has been approved! You can now participate in the tournament.', '/dashboard')
    `).run(parseInt(params.id));
    
    return NextResponse.json({ message: 'User approved successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to approve user';
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

