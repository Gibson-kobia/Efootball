import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const user = await requireAuth();
    const db = getDb();
    
    const notifications = db.prepare(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 50
    `).all(user.id);
    
    return NextResponse.json({ notifications });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : (error === 'Unauthorized' ? 'Unauthorized' : 'Failed to fetch notifications');
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json(
      { message },
      { status }
    );
  }
}

