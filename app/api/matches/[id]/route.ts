import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const db = getDb();
    
    const match = db.prepare(`
      SELECT m.*, r.round_name,
             p1.full_name as player1_name, p1.id as player1_id,
             p2.full_name as player2_name, p2.id as player2_id
      FROM matches m
      JOIN rounds r ON m.round_id = r.id
      LEFT JOIN users p1 ON m.player1_id = p1.id
      LEFT JOIN users p2 ON m.player2_id = p2.id
      WHERE m.id = ? AND (m.player1_id = ? OR m.player2_id = ?)
    `).get(parseInt(params.id), user.id, user.id) as Record<string, unknown>;
    
    if (!match) {
      return NextResponse.json(
        { message: 'Match not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ match });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : (error === 'Unauthorized' ? 'Unauthorized' : 'Failed to fetch match');
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json(
      { message },
      { status }
    );
  }
}

