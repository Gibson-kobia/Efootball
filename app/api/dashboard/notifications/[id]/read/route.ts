export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { run } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    
    await run(
      `UPDATE notifications 
       SET read = 1 
       WHERE id = $1 AND user_id = $2`,
      [parseInt(params.id), user.id]
    );
    
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

