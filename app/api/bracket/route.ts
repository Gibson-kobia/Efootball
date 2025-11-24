import { NextResponse } from 'next/server';
import { getBracketData } from '@/lib/tournament';

export async function GET() {
  try {
    const bracket = getBracketData(1); // Tournament ID 1
    return NextResponse.json(bracket);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch bracket' },
      { status: 500 }
    );
  }
}

