'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    konamiId: '',
    efootballPassword: '',
    platform: 'mobile',
  });

  // Restore pending state from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('registrationPending');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email) {
          setSuccess(true);
          setFormData((f) => ({ ...f, email: parsed.email }));
        }
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);

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

      // Persist pending registration on this device
      try {
        localStorage.setItem(
          'registrationPending',
          JSON.stringify({ email: formData.email, createdAt: Date.now() })
        );
      } catch (e) {
        // ignore localStorage errors
      }

      setSuccess(true);

      // Also send a programmatic POST to Netlify Forms so submissions are recorded
      try {
        const params = new URLSearchParams();
        params.append('form-name', 'register');
        params.append('fullName', formData.fullName);
        params.append('email', formData.email);
        params.append('konamiId', formData.konamiId);
        params.append('platform', formData.platform);
        // leave bot-field empty
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        });
      } catch (e) {
        // ignore Netlify submission errors
      }
      // Do not auto-redirect; keep the success page visible until admin approval
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkApproval = async () => {
    setError('');
    try {
      const raw = localStorage.getItem('registrationPending');
      if (!raw) return;
      const { email } = JSON.parse(raw);
      const res = await fetch(`/api/auth/approval-status?email=${encodeURIComponent(email)}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Failed to check status');
      if (body.status === 'approved') {
        // remove pending flag and navigate to login
        localStorage.removeItem('registrationPending');
        router.push('/login?registered=true');
      } else if (body.status === 'rejected') {
        setError('Your registration was rejected by an admin.');
        localStorage.removeItem('registrationPending');
      } else {
        // still pending
        setError('Still pending approval. Please check back later.');
      }
    } catch (err: any) {
      setError(err.message || 'Could not check approval status');
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-neon-green mb-4">Registration Received</h2>
          <p className="text-gray-300 mb-6">
            Your registration has been received and is pending admin approval. You'll receive an
            email notification once approved.
          </p>
          <p className="text-sm text-gray-400 mb-4">Registered email: <strong>{formData.email}</strong></p>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={checkApproval}
              className="btn-secondary"
            >
              Check Approval Status
            </button>
            <button
              onClick={() => router.push('/login')}
              className="btn-primary"
            >
              Go to Login
            </button>
          </div>
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

        <form
          name="register"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Netlify hidden inputs */}
          <input type="hidden" name="form-name" value="register" />
          <input type="hidden" name="platform" value={formData.platform} />
          <div style={{ display: 'none' }}>
            <label>
              Don't fill this out if you're human: <input name="bot-field" />
            </label>
          </div>
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

