import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();
    
    const matches = db.prepare(`
      SELECT m.*, r.round_name,
             p1.full_name as player1_name,
             p2.full_name as player2_name
      FROM matches m
      JOIN rounds r ON m.round_id = r.id
      LEFT JOIN users p1 ON m.player1_id = p1.id
      LEFT JOIN users p2 ON m.player2_id = p2.id
      WHERE m.tournament_id = 1
      ORDER BY r.round_number, m.match_number
    `).all();
    
    return NextResponse.json({ matches });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

