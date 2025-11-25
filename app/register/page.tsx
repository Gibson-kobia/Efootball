'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    konamiId: '',
    efootballPassword: '',
    platform: 'mobile',
  });

  // Check if user already has a pending registration on this device
  useEffect(() => {
    const storedEmail = localStorage.getItem('pendingRegistrationEmail');
    if (storedEmail) {
      // Verify the registration is still pending
      fetch(`/api/auth/approval-status?email=${encodeURIComponent(storedEmail)}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'pending') {
            // Redirect to pending approval page
            router.push('/pending-approval');
          } else {
            // Clear old stored email if not pending anymore
            localStorage.removeItem('pendingRegistrationEmail');
            setCheckingExisting(false);
          }
        })
        .catch(() => {
          setCheckingExisting(false);
        });
    } else {
      setCheckingExisting(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          konamiId: formData.konamiId,
          efootballPassword: formData.efootballPassword,
          platform: formData.platform,
          password: formData.efootballPassword, // Use eFootball password as website password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store the email in localStorage to persist the pending state
      localStorage.setItem('pendingRegistrationEmail', formData.email.toLowerCase());
      setSuccess(true);
      setTimeout(() => {
        router.push('/pending-approval');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingExisting) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-4xl mb-4 animate-pulse">...</div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-6xl mb-4">
            <span role="img" aria-label="hourglass">⏳</span>
          </div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Pending Approval</h2>
          <p className="text-gray-300 mb-6">
            Your registration has been submitted successfully! Your account is now pending approval by an administrator.
          </p>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400">
              You will be able to log in once an admin reviews and approves your registration.
            </p>
          </div>
          <p className="text-sm text-gray-400">Redirecting to status page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card">
        <h1 className="text-4xl font-bold text-gradient mb-2">Register</h1>
        <p className="text-gray-400 mb-8">Join Efootball Showdown 2025</p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          {/* Konami Account Section */}
          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-bold text-neon-green mb-4">
              Register your Konami account to the tournament
            </h3>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.konamiId}
                  onChange={(e) => setFormData({ ...formData, konamiId: e.target.value })}
                  placeholder="Konami ID or email address"
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  className="input-field"
                  value={formData.efootballPassword}
                  onChange={(e) => setFormData({ ...formData, efootballPassword: e.target.value })}
                  placeholder="eFootball account password"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Platform *
            </label>
            <select
              required
              className="input-field"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            >
              <option value="mobile">Mobile</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register Now'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-neon-green hover:underline">
            Login here
          </Link>
        </p>

        <p className="mt-4 text-xs text-center text-gray-500">
          By registering, you agree to our{' '}
          <Link href="/rules" className="text-neon-green hover:underline">
            Rules & Terms
          </Link>
        </p>
      </div>
    </div>
  );
}

