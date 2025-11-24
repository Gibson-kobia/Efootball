import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { generateBracket } from '@/lib/tournament';

export async function POST() {
  try {
    await requireAdmin();
    generateBracket(1); // Tournament ID 1
    return NextResponse.json({ message: 'Bracket generated successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to generate bracket' },
      { status: 500 }
    );
  }
}

