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
      .run('rejected', parseInt(params.id));
    
    // Create notification
    db.prepare(`
      INSERT INTO notifications (user_id, type, title, message)
      VALUES (?, 'system', 'Registration Rejected', 'Your registration has been rejected. Please contact support for more information.')
    `).run(parseInt(params.id));
    
    return NextResponse.json({ message: 'User rejected successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to reject user' },
      { status: 500 }
    );
  }
}

