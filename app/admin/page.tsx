'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  efootball_id: string;
  platform: string;
  status: string;
  created_at: string;
}

interface Match {
  id: number;
  round_name: string;
  player1_name: string;
  player2_name: string;
  status: string;
  result_screenshot: string | null;
  result_uploaded_by: number | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'registrations' | 'matches' | 'bracket'>('registrations');
  const [users, setUsers] = useState<User[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(data.user);
      fetchData();
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchData = async () => {
    try {
      const [usersRes, matchesRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/matches'),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        setMatches(matchesData.matches || []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, { method: 'POST' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const rejectUser = async (userId: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/reject`, { method: 'POST' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const generateBracket = async () => {
    if (!confirm('Generate tournament bracket? This cannot be undone.')) return;
    
    try {
      const res = await fetch('/api/admin/bracket/generate', { method: 'POST' });
      if (res.ok) {
        alert('Bracket generated successfully!');
        fetchData();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to generate bracket');
      }
    } catch (error) {
      console.error('Error generating bracket:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="text-neon-green text-xl">Loading...</div>
      </div>
    );
  }

  const pendingUsers = users.filter(u => u.status === 'pending');
  const approvedUsers = users.filter(u => u.status === 'approved');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">Admin Panel</h1>
        <p className="text-gray-400">Tournament Management Dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-400 mb-1">Total Registrations</div>
          <div className="text-3xl font-bold text-neon-green">{users.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-400 mb-1">Pending Approval</div>
          <div className="text-3xl font-bold text-yellow-400">{pendingUsers.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-400 mb-1">Approved Players</div>
          <div className="text-3xl font-bold text-green-400">{approvedUsers.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-400 mb-1">Total Matches</div>
          <div className="text-3xl font-bold text-neon-green">{matches.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('registrations')}
          className={`pb-4 px-4 font-bold transition ${
            activeTab === 'registrations'
              ? 'text-neon-green border-b-2 border-neon-green'
              : 'text-gray-400 hover:text-neon-green'
          }`}
        >
          Registrations
          {pendingUsers.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-yellow-400 text-black text-xs rounded-full">
              {pendingUsers.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`pb-4 px-4 font-bold transition ${
            activeTab === 'matches'
              ? 'text-neon-green border-b-2 border-neon-green'
              : 'text-gray-400 hover:text-neon-green'
          }`}
        >
          Match Results
        </button>
        <button
          onClick={() => setActiveTab('bracket')}
          className={`pb-4 px-4 font-bold transition ${
            activeTab === 'bracket'
              ? 'text-neon-green border-b-2 border-neon-green'
              : 'text-gray-400 hover:text-neon-green'
          }`}
        >
          Bracket Management
        </button>
      </div>

      {/* Registrations Tab */}
      {activeTab === 'registrations' && (
        <div className="space-y-6">
          {pendingUsers.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Pending Approvals</h2>
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="card border-yellow-500/50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-lg mb-2">{user.full_name}</div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <div>Email: {user.email}</div>
                          <div>Phone: {user.phone}</div>
                          <div>eFootball ID: {user.efootball_id}</div>
                          <div>Platform: {user.platform.toUpperCase()}</div>
                          <div>Registered: {new Date(user.created_at).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveUser(user.id)}
                          className="btn-primary text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectUser(user.id)}
                          className="btn-secondary text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4">All Registrations</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`card ${
                    user.status === 'approved' ? 'border-green-500/50' :
                    user.status === 'rejected' ? 'border-red-500/50' :
                    'border-yellow-500/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">{user.full_name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.status === 'approved' ? 'bg-green-900/50 text-green-400' :
                      user.status === 'rejected' ? 'bg-red-900/50 text-red-400' :
                      'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {user.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Match Results Pending Verification</h2>
          {matches.length === 0 ? (
            <div className="card text-center text-gray-400">No matches yet</div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="card">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-neon-green mb-2">{match.round_name}</div>
                      <div className="text-gray-300">
                        {match.player1_name} vs {match.player2_name}
                      </div>
                      {match.result_screenshot && (
                        <a
                          href={match.result_screenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-green hover:underline text-sm mt-2 inline-block"
                        >
                          View Screenshot →
                        </a>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                        match.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                        'bg-yellow-900/50 text-yellow-400'
                      }`}>
                        {match.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bracket Tab */}
      {activeTab === 'bracket' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Bracket Management</h2>
          <div className="card">
            <p className="text-gray-300 mb-4">
              Generate the tournament bracket after registration deadline (November 23, 2025).
              This will create matches for all approved players.
            </p>
            <button
              onClick={generateBracket}
              className="btn-primary"
            >
              Generate Tournament Bracket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

