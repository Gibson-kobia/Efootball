import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getPlayerMatches } from '@/lib/tournament';

export async function GET() {
  try {
    const user = await requireAuth();
    const matches = getPlayerMatches(user.id, 1); // Tournament ID 1
    
    return NextResponse.json({ matches });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch matches' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

