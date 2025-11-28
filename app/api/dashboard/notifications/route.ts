export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const user = await requireAuth();
    
    const result = await query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [user.id]
    );
    
    const notifications = result.rows;
    
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

