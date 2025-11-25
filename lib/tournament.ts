import { getDb } from './db';
import { getRoundName } from './utils';

export interface Round {
  id: number;
  tournament_id: number;
  round_number: number;
  round_name: string;
  match_count?: number;
}

export interface Match {
  id: number;
  tournament_id: number;
  round_id: number;
  player1_id: number | null;
  player2_id: number | null;
  match_number: number;
  scheduled_time: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'forfeit';
  winner_id: number | null;
  player1_score: number | null;
  player2_score: number | null;
  result_screenshot: string | null;
}

export interface Round {
  id: number;
  tournament_id: number;
  round_number: number;
  round_name: string;
  scheduled_date: string | null;
  status: 'pending' | 'in_progress' | 'completed';
}

export function generateBracket(tournamentId: number): void {
  const db = getDb();

  // Get all approved registrations
  const registrations = db.prepare(`
    SELECT r.user_id, u.full_name, u.efootball_id
    FROM registrations r
    JOIN users u ON r.user_id = u.id
    WHERE r.tournament_id = ? AND u.status = 'approved'
    ORDER BY r.registered_at
  `).all(tournamentId) as Array<{ user_id: number; full_name: string; efootball_id: string }>;

  if (registrations.length === 0) {
    throw new Error('No approved registrations found');
  }

  const totalPlayers = registrations.length;
  const totalRounds = Math.ceil(Math.log2(totalPlayers));

  // Create rounds
  const roundDates = [
    '2025-12-10', // Day 1: Rounds 1-3
    '2025-12-10',
    '2025-12-10',
    '2025-12-11', // Day 2: Rounds 4-6
    '2025-12-11',
    '2025-12-11',
    '2025-12-12', // Day 3: Rounds 7-8
    '2025-12-12',
    '2025-12-13', // Day 4: Semi-finals
    '2025-12-13', // Day 4: Final
  ];

  const insertRound = db.prepare(`
    INSERT INTO rounds (tournament_id, round_number, round_name, scheduled_date, status)
    VALUES (?, ?, ?, ?, 'pending')
  `);

  for (let i = 1; i <= totalRounds; i++) {
    const roundName = getRoundName(i, totalPlayers);
    const scheduledDate = roundDates[i - 1] || '2025-12-10';
    insertRound.run(tournamentId, i, roundName, scheduledDate);
  }

  // Get round IDs
  const rounds = db.prepare(`
    SELECT id, round_number FROM rounds WHERE tournament_id = ? ORDER BY round_number
  `).all(tournamentId) as Array<{ id: number; round_number: number }>;

  // Generate first round matches
  const firstRound = rounds[0];
  const insertMatch = db.prepare(`
    INSERT INTO matches (tournament_id, round_id, player1_id, player2_id, match_number, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `);

  let matchNumber = 1;
  const players = [...registrations];

  // Handle bye if odd number of players
  if (players.length % 2 !== 0) {
    // Last player gets a bye in round 4 (when we have 125 players)
    // For now, we'll pair them normally and handle bye in later rounds
  }

  // First round: pair all players
  for (let i = 0; i < players.length - 1; i += 2) {
    insertMatch.run(
      tournamentId,
      firstRound.id,
      players[i].user_id,
      players[i + 1]?.user_id || null,
      matchNumber++,
      'pending'
    );
  }

  // If odd number, last player gets a bye (will advance automatically)
  if (players.length % 2 !== 0) {
    insertMatch.run(
      tournamentId,
      firstRound.id,
      players[players.length - 1].user_id,
      null,
      matchNumber++,
      'pending'
    );
  }

  // Update tournament status
  db.prepare('UPDATE tournaments SET status = ? WHERE id = ?')
    .run('brackets_generated', tournamentId);

  // Create notifications for all players
  const insertNotification = db.prepare(`
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (?, 'tournament_update', 'Bracket Generated', 'Tournament bracket has been generated! Check your dashboard for your first match.', '/dashboard')
  `);

  for (const reg of registrations) {
    insertNotification.run(reg.user_id);
  }
}

export function getPlayerMatches(userId: number, tournamentId: number): Match[] {
  const db = getDb();
  return db.prepare(`
    SELECT m.*, 
           r.round_name, r.round_number,
           p1.full_name as player1_name, p1.efootball_id as player1_id_name,
           p2.full_name as player2_name, p2.efootball_id as player2_id_name,
           w.full_name as winner_name
    FROM matches m
    JOIN rounds r ON m.round_id = r.id
    LEFT JOIN users p1 ON m.player1_id = p1.id
    LEFT JOIN users p2 ON m.player2_id = p2.id
    LEFT JOIN users w ON m.winner_id = w.id
    WHERE m.tournament_id = ? AND (m.player1_id = ? OR m.player2_id = ?)
    ORDER BY r.round_number, m.match_number
  `).all(tournamentId, userId, userId) as Match[];
}

export function getBracketData(tournamentId: number): any {
  const db = getDb();
  const rounds = db.prepare(`
    SELECT r.*, COUNT(m.id) as match_count
    FROM rounds r
    LEFT JOIN matches m ON r.id = m.round_id
    WHERE r.tournament_id = ?
    GROUP BY r.id
    ORDER BY r.round_number
  `).all(tournamentId) as Round[];

  const bracket: any = { rounds: [] };

  for (const round of rounds) {
    const matches = db.prepare(`
      SELECT m.*,
             p1.full_name as player1_name, p1.efootball_id as player1_id_name,
             p2.full_name as player2_name, p2.efootball_id as player2_id_name,
             w.full_name as winner_name
      FROM matches m
      LEFT JOIN users p1 ON m.player1_id = p1.id
      LEFT JOIN users p2 ON m.player2_id = p2.id
      LEFT JOIN users w ON m.winner_id = w.id
      WHERE m.round_id = ?
      ORDER BY m.match_number
    `).all(round.id);

    bracket.rounds.push({
      ...round,
      matches,
    });
  }

  return bracket;
}

export function advanceWinner(matchId: number): void {
  const db = getDb();
  const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(matchId) as Match | undefined;

  if (!match || !match.winner_id) {
    throw new Error('Match not found or no winner');
  }

  // Find next round
  const currentRound = db.prepare('SELECT * FROM rounds WHERE id = ?').get(match.round_id) as Round | undefined;
  if (!currentRound) return;

  const nextRound = db.prepare(`
    SELECT * FROM rounds 
    WHERE tournament_id = ? AND round_number = ?
  `).get(match.tournament_id, currentRound.round_number + 1) as Round | undefined;

  if (!nextRound) return; // Tournament finished

  // Find next match in next round
  const nextMatchNumber = Math.ceil(match.match_number / 2);
  const nextMatch = db.prepare(`
    SELECT * FROM matches 
    WHERE round_id = ? AND match_number = ?
  `).get(nextRound.id, nextMatchNumber) as Match | undefined;

  if (!nextMatch) return;

  // Assign winner to next match
  if (nextMatch.match_number % 2 === 1) {
    db.prepare('UPDATE matches SET player1_id = ? WHERE id = ?')
      .run(match.winner_id, nextMatch.id);
  } else {
    db.prepare('UPDATE matches SET player2_id = ? WHERE id = ?')
      .run(match.winner_id, nextMatch.id);
  }
}

