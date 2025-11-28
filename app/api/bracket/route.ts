export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getBracketData } from '@/lib/tournament';

export async function GET() {
  try {
    const bracket = await getBracketData(1); // Tournament ID 1
    return NextResponse.json(bracket);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch bracket';
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

