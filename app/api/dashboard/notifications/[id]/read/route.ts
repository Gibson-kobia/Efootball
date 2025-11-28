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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : (error === 'Unauthorized' ? 'Unauthorized' : 'Failed to update notification');
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json(
      { message },
      { status }
    );
  }
}

