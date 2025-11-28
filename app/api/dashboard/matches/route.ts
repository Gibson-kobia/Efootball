import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getPlayerMatches } from '@/lib/tournament';

export async function GET() {
  try {
    const user = await requireAuth();
    const matches = getPlayerMatches(user.id, 1); // Tournament ID 1
    
    return NextResponse.json({ matches });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : (error === 'Unauthorized' ? 'Unauthorized' : 'Failed to fetch matches');
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json(
      { message },
      { status },
    );
  }
}

