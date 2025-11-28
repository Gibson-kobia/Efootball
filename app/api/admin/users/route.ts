export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    await requireAdmin();
    
    const result = await query(`
      SELECT u.*, r.registered_at
      FROM users u
      LEFT JOIN registrations r ON u.id = r.user_id
      WHERE r.tournament_id = 1 OR r.tournament_id IS NULL
      ORDER BY u.created_at DESC
    `);
    
    const users = result.rows as Array<Record<string, unknown>>;
    
    return NextResponse.json({ users });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users';
    const status = error instanceof Error && error.message === 'Forbidden: Admin access required' ? 403 : 500;
    return NextResponse.json(
      { message },
      { status }
    );
  }
}

