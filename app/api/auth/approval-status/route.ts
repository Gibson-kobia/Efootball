import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Email query parameter is required' }, { status: 400 });
    }

    const db = getDb();
    const user = db.prepare('SELECT status FROM users WHERE email = ?').get(email.toLowerCase());

    if (!user) {
      return NextResponse.json({ status: 'not_found' }, { status: 404 });
    }

    // user.status expected to be 'pending', 'approved', 'rejected', etc.
    return NextResponse.json({ status: user.status });
  } catch (error: any) {
    console.error('Approval status error:', error);
    return NextResponse.json({ message: 'Failed to check approval status' }, { status: 500 });
  }
}
