'use client';

import { useState, useEffect } from 'react';

interface Match {
  id: number;
  player1_name: string | null;
  player2_name: string | null;
  player1_id_name: string | null;
  player2_id_name: string | null;
  winner_name: string | null;
  status: string;
  player1_score: number | null;
  player2_score: number | null;
  match_number: number;
}

interface Round {
  id: number;
  round_number: number;
  round_name: string;
  scheduled_date: string | null;
  status: string;
  matches: Match[];
}

export default function BracketPage() {
  const [bracket, setBracket] = useState<{ rounds: Round[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBracket();
  }, []);

  const fetchBracket = async () => {
    try {
      const res = await fetch('/api/bracket');
      if (res.ok) {
        const data = await res.json();
        setBracket(data);
      }
    } catch (error) {
      console.error('Error fetching bracket:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="text-neon-green text-xl">Loading bracket...</div>
      </div>
    );
  }

  if (!bracket || bracket.rounds.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gradient mb-8 text-center">Tournament Bracket</h1>
        <div className="card text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-neon-green mb-4">Bracket Not Yet Generated</h2>
          <p className="text-gray-300 mb-6">
            The tournament bracket will be generated after the registration deadline (November 23, 2025).
            Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gradient mb-8 text-center">Tournament Bracket</h1>
      
      <div className="overflow-x-auto">
        <div className="flex gap-8 min-w-max pb-8">
          {bracket.rounds.map((round, roundIndex) => (
            <div key={round.id} className="flex-shrink-0">
              <div className="card mb-4">
                <h2 className="text-xl font-bold text-neon-green mb-2">{round.round_name}</h2>
                {round.scheduled_date && (
                  <div className="text-sm text-gray-400">
                    {new Date(round.scheduled_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {round.matches.map((match) => (
                  <div
                    key={match.id}
                    className={`card min-w-[200px] ${
                      match.status === 'completed' ? 'border-green-500/50' :
                      match.status === 'in_progress' ? 'border-yellow-500/50' :
                      'border-gray-800'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className={`p-2 rounded ${
                        match.winner_name === match.player1_name ? 'bg-green-900/30 border border-green-500/50' :
                        match.status === 'completed' ? 'bg-gray-800' : 'bg-gray-800/50'
                      }`}>
                        <div className="font-bold text-sm">
                          {match.player1_name || 'TBD'}
                        </div>
                        {match.player1_id_name && (
                          <div className="text-xs text-gray-400">{match.player1_id_name}</div>
                        )}
                        {match.status === 'completed' && match.player1_score !== null && (
                          <div className="text-neon-green font-bold mt-1">
                            {match.player1_score}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center text-gray-500 text-xs">VS</div>
                      
                      <div className={`p-2 rounded ${
                        match.winner_name === match.player2_name ? 'bg-green-900/30 border border-green-500/50' :
                        match.status === 'completed' ? 'bg-gray-800' : 'bg-gray-800/50'
                      }`}>
                        <div className="font-bold text-sm">
                          {match.player2_name || 'TBD'}
                        </div>
                        {match.player2_id_name && (
                          <div className="text-xs text-gray-400">{match.player2_id_name}</div>
                        )}
                        {match.status === 'completed' && match.player2_score !== null && (
                          <div className="text-neon-green font-bold mt-1">
                            {match.player2_score}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {match.status === 'completed' && match.winner_name && (
                      <div className="mt-2 pt-2 border-t border-gray-700 text-center">
                        <div className="text-xs text-gray-400">Winner</div>
                        <div className="font-bold text-neon-green">{match.winner_name}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

