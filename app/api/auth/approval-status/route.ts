export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { get } from '@/lib/db';

type ApiStatus = 'pending' | 'approved' | 'rejected' | 'not_found' | 'unknown';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Email query parameter is required' }, { status: 400 });
    }

    const row = await get<{ status: string }>('SELECT status FROM users WHERE email = $1', [email.toLowerCase()]);

    if (!row || typeof row.status !== 'string') {
      return NextResponse.json({ status: 'not_found' as ApiStatus }, { status: 404 });
    }

    const status = (row.status as ApiStatus) || 'unknown';

    return NextResponse.json({ status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to check approval status';
    console.error('Approval status error:', error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
