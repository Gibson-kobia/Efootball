import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const db = getDb();
    
    db.prepare(`
      UPDATE notifications 
      SET read = 1 
      WHERE id = ? AND user_id = ?
    `).run(parseInt(params.id), user.id);
    
    return NextResponse.json({ message: 'Notification marked as read' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to update notification' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

