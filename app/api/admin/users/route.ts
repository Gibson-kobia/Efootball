import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();
    
    const users = db.prepare(`
      SELECT u.*, r.registered_at
      FROM users u
      LEFT JOIN registrations r ON u.id = r.user_id
      WHERE r.tournament_id = 1 OR r.tournament_id IS NULL
      ORDER BY u.created_at DESC
    `).all();
    
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch users' },
      { status: error.message === 'Forbidden: Admin access required' ? 403 : 500 }
    );
  }
}

