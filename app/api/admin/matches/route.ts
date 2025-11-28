export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    await requireAdmin();
    
    const result = await query(`
      SELECT m.*, r.round_name,
             p1.full_name as player1_name,
             p2.full_name as player2_name
      FROM matches m
      JOIN rounds r ON m.round_id = r.id
      LEFT JOIN users p1 ON m.player1_id = p1.id
      LEFT JOIN users p2 ON m.player2_id = p2.id
      WHERE m.tournament_id = 1
      ORDER BY r.round_number, m.match_number
    `);
    
    const matches = result.rows;
    
    return NextResponse.json({ matches });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch matches';
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

