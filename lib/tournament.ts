import { query, get, run } from './db';
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

export async function generateBracket(tournamentId: number): Promise<void> {
  // Get all approved registrations
  const registrationsRes = await query(
    `SELECT r.user_id, u.full_name, u.efootball_id
     FROM registrations r
     JOIN users u ON r.user_id = u.id
     WHERE r.tournament_id = $1 AND u.status = 'approved'
     ORDER BY r.registered_at`,
    [tournamentId]
  );

  const registrations = registrationsRes.rows as Array<{ user_id: number; full_name: string; efootball_id: string }>;

  if (registrations.length === 0) {
    throw new Error('No approved registrations found');
  }

  const totalPlayers = registrations.length;
  const totalRounds = Math.ceil(Math.log2(totalPlayers));

  // Create rounds
  const roundDates = [
    '2025-12-10',
    '2025-12-10',
    '2025-12-10',
    '2025-12-11',
    '2025-12-11',
    '2025-12-11',
    '2025-12-12',
    '2025-12-12',
    '2025-12-13',
    '2025-12-13',
  ];

  for (let i = 1; i <= totalRounds; i++) {
    const roundName = getRoundName(i);
    const scheduledDate = roundDates[i - 1] || '2025-12-10';
    await run(
      `INSERT INTO rounds (tournament_id, round_number, round_name, scheduled_date, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [tournamentId, i, roundName, scheduledDate, 'pending']
    );
  }

  // Get round IDs
  const roundsRes = await query(
    `SELECT id, round_number FROM rounds WHERE tournament_id = $1 ORDER BY round_number`,
    [tournamentId]
  );
  const rounds = roundsRes.rows as Array<{ id: number; round_number: number }>;

  // Generate first round matches
  const firstRound = rounds[0];
  let matchNumber = 1;
  const players = [...registrations];

  // First round: pair all players
  for (let i = 0; i < players.length - 1; i += 2) {
    await run(
      `INSERT INTO matches (tournament_id, round_id, player1_id, player2_id, match_number, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [tournamentId, firstRound.id, players[i].user_id, players[i + 1]?.user_id || null, matchNumber++, 'pending']
    );
  }

  // If odd number, last player gets a bye (will advance automatically)
  if (players.length % 2 !== 0) {
    await run(
      `INSERT INTO matches (tournament_id, round_id, player1_id, player2_id, match_number, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [tournamentId, firstRound.id, players[players.length - 1].user_id, null, matchNumber++, 'pending']
    );
  }

  // Update tournament status
  await run('UPDATE tournaments SET status = $1 WHERE id = $2', ['brackets_generated', tournamentId]);

  // Create notifications for all players
  for (const reg of registrations) {
    await run(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES ($1, $2, $3, $4, $5)`,
      [reg.user_id, 'tournament_update', 'Bracket Generated', 'Tournament bracket has been generated! Check your dashboard for your first match.', '/dashboard']
    );
  }
}

export async function getPlayerMatches(userId: number, tournamentId: number): Promise<Match[]> {
  const res = await query(
    `SELECT m.*, 
            r.round_name, r.round_number,
            p1.full_name as player1_name, p1.efootball_id as player1_id_name,
            p2.full_name as player2_name, p2.efootball_id as player2_id_name,
            w.full_name as winner_name
     FROM matches m
     JOIN rounds r ON m.round_id = r.id
     LEFT JOIN users p1 ON m.player1_id = p1.id
     LEFT JOIN users p2 ON m.player2_id = p2.id
     LEFT JOIN users w ON m.winner_id = w.id
     WHERE m.tournament_id = $1 AND (m.player1_id = $2 OR m.player2_id = $2)
     ORDER BY r.round_number, m.match_number`,
    [tournamentId, userId]
  );

  return res.rows as Match[];
}

export async function getBracketData(tournamentId: number): Promise<{ rounds: (Round & { matches: Match[] })[] }> {
  const roundsRes = await query(
    `SELECT r.*, COUNT(m.id) as match_count
     FROM rounds r
     LEFT JOIN matches m ON r.id = m.round_id
     WHERE r.tournament_id = $1
     GROUP BY r.id
     ORDER BY r.round_number`,
    [tournamentId]
  );

  const rounds = roundsRes.rows as Round[];
  const bracket: { rounds: (Round & { matches: Match[] })[] } = { rounds: [] };

  for (const round of rounds) {
    const matchesRes = await query(
      `SELECT m.*,
              p1.full_name as player1_name, p1.efootball_id as player1_id_name,
              p2.full_name as player2_name, p2.efootball_id as player2_id_name,
              w.full_name as winner_name
       FROM matches m
       LEFT JOIN users p1 ON m.player1_id = p1.id
       LEFT JOIN users p2 ON m.player2_id = p2.id
       LEFT JOIN users w ON m.winner_id = w.id
       WHERE m.round_id = $1
       ORDER BY m.match_number`,
      [round.id]
    );

    const matches = matchesRes.rows as Match[];

    bracket.rounds.push({
      ...round,
      matches,
    });
  }

  return bracket;
}

export async function advanceWinner(matchId: number): Promise<void> {
  const match = await get<Match>('SELECT * FROM matches WHERE id = $1', [matchId]);

  if (!match || !match.winner_id) {
    throw new Error('Match not found or no winner');
  }

  // Find current round
  const currentRound = await get<Round>('SELECT * FROM rounds WHERE id = $1', [match.round_id]);
  if (!currentRound) return;

  const nextRound = await get<Round>(
    `SELECT * FROM rounds WHERE tournament_id = $1 AND round_number = $2`,
    [match.tournament_id, currentRound.round_number + 1]
  );

  if (!nextRound) return; // Tournament finished

  // Find next match in next round
  const nextMatchNumber = Math.ceil(match.match_number / 2);
  const nextMatch = await get<Match>(
    `SELECT * FROM matches WHERE round_id = $1 AND match_number = $2`,
    [nextRound.id, nextMatchNumber]
  );

  if (!nextMatch) return;

  // Assign winner to next match
  if (nextMatch.match_number % 2 === 1) {
    await run('UPDATE matches SET player1_id = $1 WHERE id = $2', [match.winner_id, nextMatch.id]);
  } else {
    await run('UPDATE matches SET player2_id = $1 WHERE id = $2', [match.winner_id, nextMatch.id]);
  }
}

