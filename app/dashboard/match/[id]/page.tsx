'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Match {
  id: number;
  round_name: string;
  player1_name: string;
  player2_name: string;
  player1_id: number | null;
  player2_id: number | null;
  scheduled_time: string | null;
  status: string;
  winner_id: number | null;
  player1_score: number | null;
  player2_score: number | null;
  result_screenshot: string | null;
}

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    player1Score: '',
    player2Score: '',
    screenshot: null as File | null,
  });
  const [user, setUser] = useState<Record<string, unknown> | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchMatch();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
  };

  const fetchMatch = async () => {
    try {
      const res = await fetch(`/api/matches/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setMatch(data.match);
      }
    } catch (_error) {
      console.error('Error fetching match:', _error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, screenshot: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('player1Score', formData.player1Score);
      formDataToSend.append('player2Score', formData.player2Score);
      if (formData.screenshot) {
        formDataToSend.append('screenshot', formData.screenshot);
      }

      const res = await fetch(`/api/matches/${params.id}/result`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to upload result');
      }

      alert('Result uploaded successfully! Admin will verify it soon.');
      router.push('/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to upload result';
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-neon-green text-xl">Loading match...</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card text-center">Match not found</div>
      </div>
    );
  }

  const isPlayer1 = user && match.player1_id === user.id;
  const isPlayer2 = user && match.player2_id === user.id;
  const canUploadResult = (isPlayer1 || isPlayer2) && match.status !== 'completed';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gradient mb-8">Match Details</h1>

      <div className="card mb-6">
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">Round</div>
          <div className="text-2xl font-bold text-neon-green">{match.round_name}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className={`p-4 rounded-lg ${isPlayer1 ? 'bg-neon-green/20 border border-neon-green' : 'bg-gray-800'}`}>
            <div className="text-sm text-gray-400 mb-1">Player 1</div>
            <div className="text-xl font-bold">{match.player1_name || 'TBD'}</div>
            {isPlayer1 && <div className="text-sm text-neon-green mt-2">(You)</div>}
          </div>
          <div className={`p-4 rounded-lg ${isPlayer2 ? 'bg-neon-green/20 border border-neon-green' : 'bg-gray-800'}`}>
            <div className="text-sm text-gray-400 mb-1">Player 2</div>
            <div className="text-xl font-bold">{match.player2_name || 'TBD'}</div>
            {isPlayer2 && <div className="text-sm text-neon-green mt-2">(You)</div>}
          </div>
        </div>

        {match.scheduled_time && (
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-1">Scheduled Time</div>
            <div className="text-lg">{new Date(match.scheduled_time).toLocaleString()}</div>
          </div>
        )}

        <div>
          <div className="text-sm text-gray-400 mb-1">Status</div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
            match.status === 'completed' ? 'bg-green-900/50 text-green-400' :
            match.status === 'in_progress' ? 'bg-yellow-900/50 text-yellow-400' :
            'bg-gray-800 text-gray-400'
          }`}>
            {match.status}
          </div>
        </div>

        {match.status === 'completed' && match.player1_score !== null && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <div className="text-center text-4xl font-bold text-neon-green mb-2">
              {match.player1_score} - {match.player2_score}
            </div>
            {match.result_screenshot && (
              <div className="mt-4">
                <a
                  href={match.result_screenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-green hover:underline"
                >
                  View Result Screenshot →
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {canUploadResult && (
        <div className="card">
          <h2 className="text-2xl font-bold text-neon-green mb-4">Upload Match Result</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {match.player1_name} Score
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="input-field"
                  value={formData.player1Score}
                  onChange={(e) => setFormData({ ...formData, player1Score: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {match.player2_name} Score
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="input-field"
                  value={formData.player2Score}
                  onChange={(e) => setFormData({ ...formData, player2Score: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Result Screenshot (Required)
              </label>
              <input
                type="file"
                required
                accept="image/*"
                onChange={handleFileChange}
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">
                Upload a clear screenshot showing the final match result
              </p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Submit Result'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

