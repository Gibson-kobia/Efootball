export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { get, run } from '@/lib/db';
import { advanceWinner } from '@/lib/tournament';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    
    // Get match
    const match = await get<Record<string, unknown>>(
      `SELECT * FROM matches WHERE id = $1 AND (player1_id = $2 OR player2_id = $3)`,
      [parseInt(params.id), user.id, user.id]
    );
    
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
    let winnerId: number | null = null;
    const player1Id = match.player1_id as number;
    const player2Id = match.player2_id as number;
    
    if (player1Score > player2Score) {
      winnerId = player1Id;
    } else if (player2Score > player1Score) {
      winnerId = player2Id;
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
    await run(
      `UPDATE matches 
       SET player1_score = $1, player2_score = $2, winner_id = $3, 
           result_screenshot = $4, result_uploaded_by = $5, status = $6
       WHERE id = $7`,
      [player1Score, player2Score, winnerId, screenshotUrl, user.id, 'completed', parseInt(params.id)]
    );
    
    // Advance winner to next round
    advanceWinner(parseInt(params.id));
    
    // Create notifications
    const opponentId = player1Id === user.id ? player2Id : player1Id;
    if (opponentId) {
      await run(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES ($1, $2, $3, $4, $5)`,
        [opponentId, 'match_result', 'Match Result Submitted', 'Your opponent has submitted the match result. Admin will verify soon.', '/dashboard']
      );
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

