import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { advanceWinner } from '@/lib/tournament';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const db = getDb();
    
    // Get match
    const match = db.prepare(`
      SELECT * FROM matches WHERE id = ? AND (player1_id = ? OR player2_id = ?)
    `).get(parseInt(params.id), user.id, user.id) as Record<string, unknown>;
    
    if (!match) {
      return NextResponse.json(
        { message: 'Match not found' },
        { status: 404 }
      );
    }
    
    if (match.status === 'completed') {
      return NextResponse.json(
        { message: 'Match result already submitted' },
        { status: 400 }
      );
    }
    
    const formData = await request.formData();
    const player1Score = parseInt(formData.get('player1Score') as string);
    const player2Score = parseInt(formData.get('player2Score') as string);
    const screenshot = formData.get('screenshot') as File;
    
    if (!screenshot) {
      return NextResponse.json(
        { message: 'Screenshot is required' },
        { status: 400 }
      );
    }
    
    // Determine winner
    let winnerId = null;
    if (player1Score > player2Score) {
      winnerId = match.player1_id;
    } else if (player2Score > player1Score) {
      winnerId = match.player2_id;
    } else {
      return NextResponse.json(
        { message: 'Match cannot end in a tie' },
        { status: 400 }
      );
    }
    
    // Save screenshot
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    
    const bytes = await screenshot.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `match-${params.id}-${Date.now()}.${screenshot.name.split('.').pop()}`;
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);
    
    const screenshotUrl = `/uploads/${filename}`;
    
    // Update match
    db.prepare(`
      UPDATE matches 
      SET player1_score = ?, player2_score = ?, winner_id = ?, 
          result_screenshot = ?, result_uploaded_by = ?, status = 'completed'
      WHERE id = ?
    `).run(player1Score, player2Score, winnerId, screenshotUrl, user.id, parseInt(params.id));
    
    // Advance winner to next round
    advanceWinner(parseInt(params.id));
    
    // Create notifications
    const opponentId = match.player1_id === user.id ? match.player2_id : match.player1_id;
    if (opponentId) {
      db.prepare(`
        INSERT INTO notifications (user_id, type, title, message, link)
        VALUES (?, 'match_result', 'Match Result Submitted', 
                'Your opponent has submitted the match result. Admin will verify soon.', '/dashboard')
      `).run(opponentId);
    }
    
    return NextResponse.json({ message: 'Result submitted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to submit result';
    console.error('Error submitting result:', error);
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

