'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Match {
  id: number;
  round_name: string;
  round_number: number;
  player1_name: string;
  player2_name: string;
  scheduled_time: string | null;
  status: string;
  winner_id: number | null;
  player1_score: number | null;
  player2_score: number | null;
  result_screenshot: string | null;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  status: string;
}

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  read: number;
  link: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'matches' | 'notifications' | 'profile'>('matches');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, matchesRes, notificationsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/dashboard/matches'),
        fetch('/api/dashboard/notifications'),
      ]);

      if (!userRes.ok) {
        router.push('/login');
        return;
      }

      const userData = await userRes.json();
      setUser(userData.user);

      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        setMatches(matchesData.matches || []);
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationRead = async (id: number) => {
    await fetch(`/api/dashboard/notifications/${id}/read`, { method: 'POST' });
    fetchData();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="text-neon-green text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentMatch = matches.find(m => m.status === 'pending' || m.status === 'in_progress');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Welcome, {user.full_name}!
        </h1>
        <p className="text-gray-400">
          {user.status === 'approved' ? 'Your account is active' : 'Your account is pending approval'}
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-gray-400 mb-1">Account Status</div>
          <div className={`text-2xl font-bold ${user.status === 'approved' ? 'text-neon-green' : 'text-yellow-400'}`}>
            {user.status === 'approved' ? '✓ Approved' : '⏳ Pending'}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-400 mb-1">Active Matches</div>
          <div className="text-2xl font-bold text-neon-green">
            {matches.filter(m => m.status === 'pending' || m.status === 'in_progress').length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-400 mb-1">Unread Notifications</div>
          <div className="text-2xl font-bold text-neon-green">{unreadCount}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('matches')}
          className={`pb-4 px-4 font-bold transition ${
            activeTab === 'matches'
              ? 'text-neon-green border-b-2 border-neon-green'
              : 'text-gray-400 hover:text-neon-green'
          }`}
        >
          Matches
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-4 px-4 font-bold transition relative ${
            activeTab === 'notifications'
              ? 'text-neon-green border-b-2 border-neon-green'
              : 'text-gray-400 hover:text-neon-green'
          }`}
        >
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-neon-green text-black text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-4 font-bold transition ${
            activeTab === 'profile'
              ? 'text-neon-green border-b-2 border-neon-green'
              : 'text-gray-400 hover:text-neon-green'
          }`}
        >
          Profile
        </button>
      </div>

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          {currentMatch && (
            <div className="card neon-border">
              <h2 className="text-2xl font-bold text-neon-green mb-4">Current Match</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">Round</div>
                  <div className="text-xl font-bold">{currentMatch.round_name}</div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Player 1</div>
                    <div className="text-lg">{currentMatch.player1_name || 'TBD'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Player 2</div>
                    <div className="text-lg">{currentMatch.player2_name || 'TBD'}</div>
                  </div>
                </div>
                {currentMatch.scheduled_time && (
                  <div>
                    <div className="text-sm text-gray-400">Scheduled Time</div>
                    <div className="text-lg">{new Date(currentMatch.scheduled_time).toLocaleString()}</div>
                  </div>
                )}
                <Link
                  href={`/dashboard/match/${currentMatch.id}`}
                  className="btn-primary inline-block text-center"
                >
                  View Match Details
                </Link>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4">All Matches</h2>
            {matches.length === 0 ? (
              <div className="card text-center text-gray-400">
                No matches assigned yet. Check back after bracket generation.
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div key={match.id} className="card">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-neon-green mb-2">{match.round_name}</div>
                        <div className="text-gray-300">
                          {match.player1_name || 'TBD'} vs {match.player2_name || 'TBD'}
                        </div>
                        {match.status === 'completed' && match.player1_score !== null && (
                          <div className="text-lg font-bold mt-2">
                            {match.player1_score} - {match.player2_score}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          match.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                          match.status === 'in_progress' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-gray-800 text-gray-400'
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
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="card text-center text-gray-400">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`card ${!notification.read ? 'border-neon-green/50 bg-gray-900/60' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-neon-green">{notification.title}</h3>
                      {!notification.read && (
                        <span className="px-2 py-1 bg-neon-green text-black text-xs rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-2">{notification.message}</p>
                    <div className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                    {notification.link && (
                      <Link
                        href={notification.link}
                        className="text-neon-green hover:underline text-sm mt-2 inline-block"
                      >
                        View →
                      </Link>
                    )}
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markNotificationRead(notification.id)}
                      className="text-gray-400 hover:text-neon-green"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card">
          <h2 className="text-2xl font-bold text-neon-green mb-6">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Full Name</div>
              <div className="text-lg">{user.full_name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Email</div>
              <div className="text-lg">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Account Status</div>
              <div className={`text-lg font-bold ${user.status === 'approved' ? 'text-neon-green' : 'text-yellow-400'}`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-800">
              <Link href="/bracket" className="btn-secondary inline-block">
                View Tournament Bracket
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

