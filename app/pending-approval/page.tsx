'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'not_found' | 'checking' | 'no_registration';

export default function PendingApprovalPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ApprovalStatus>('checking');
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a pending registration stored locally
    const storedEmail = localStorage.getItem('pendingRegistrationEmail');

    if (!storedEmail) {
      setStatus('no_registration');
      return;
    }

    setEmail(storedEmail);
    checkApprovalStatus(storedEmail);
  }, []);

  const checkApprovalStatus = async (emailToCheck: string) => {
    try {
      const res = await fetch(`/api/auth/approval-status?email=${encodeURIComponent(emailToCheck)}`);
      const data = await res.json();

      if (data.status === 'approved') {
        // Clear the stored email since they're approved
        localStorage.removeItem('pendingRegistrationEmail');
        setStatus('approved');
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login?approved=true');
        }, 3000);
      } else if (data.status === 'rejected') {
        // Clear the stored email since they're rejected
        localStorage.removeItem('pendingRegistrationEmail');
        setStatus('rejected');
      } else if (data.status === 'not_found') {
        // User not found - clear local storage
        localStorage.removeItem('pendingRegistrationEmail');
        setStatus('not_found');
      } else {
        setStatus('pending');
      }
    } catch (error) {
      console.error('Error checking approval status:', error);
      setStatus('pending'); // Assume pending if there's an error
    }
  };

  const handleRefreshStatus = () => {
    if (email) {
      setStatus('checking');
      checkApprovalStatus(email);
    }
  };

  const handleClearRegistration = () => {
    localStorage.removeItem('pendingRegistrationEmail');
    router.push('/register');
  };

  if (status === 'checking') {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-6xl mb-4 animate-pulse">...</div>
          <h2 className="text-2xl font-bold text-gray-300 mb-4">Checking Status...</h2>
          <p className="text-gray-400">Please wait while we check your registration status.</p>
        </div>
      </div>
    );
  }

  if (status === 'no_registration') {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-6xl mb-4">
            <span role="img" aria-label="question">?</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-300 mb-4">No Pending Registration</h2>
          <p className="text-gray-400 mb-6">
            No pending registration found on this device.
          </p>
          <div className="space-y-3">
            <Link href="/register" className="block w-full btn-primary text-center">
              Register Now
            </Link>
            <Link href="/login" className="block w-full btn-secondary text-center">
              Already Approved? Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-6xl mb-4">
            <span role="img" aria-label="celebration">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-neon-green mb-4">You're Approved!</h2>
          <p className="text-gray-300 mb-6">
            Great news! Your registration has been approved by an admin.
            You can now log in and participate in the tournament.
          </p>
          <p className="text-sm text-gray-400 mb-4">Redirecting to login...</p>
          <Link href="/login?approved=true" className="btn-primary inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-6xl mb-4">
            <span role="img" aria-label="sad">😔</span>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Registration Rejected</h2>
          <p className="text-gray-300 mb-6">
            Unfortunately, your registration has been rejected.
            Please contact support for more information or try registering again.
          </p>
          <div className="space-y-3">
            <button onClick={handleClearRegistration} className="w-full btn-primary">
              Try Again
            </button>
            <Link href="/" className="block w-full btn-secondary text-center">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'not_found') {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-6xl mb-4">
            <span role="img" aria-label="warning">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Registration Not Found</h2>
          <p className="text-gray-300 mb-6">
            We couldn't find your registration in our system.
            This may have been cleared or there was an issue during registration.
          </p>
          <div className="space-y-3">
            <Link href="/register" className="block w-full btn-primary text-center">
              Register Again
            </Link>
            <Link href="/login" className="block w-full btn-secondary text-center">
              Try Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default: pending status
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card text-center">
        <div className="text-6xl mb-4">
          <span role="img" aria-label="hourglass">⏳</span>
        </div>
        <h2 className="text-2xl font-bold text-neon-green mb-4">Registration Pending</h2>
        <p className="text-gray-300 mb-2">
          Your registration has been received and is awaiting admin approval.
        </p>
        {email && (
          <p className="text-sm text-gray-400 mb-6">
            Registered email: <span className="text-neon-green">{email}</span>
          </p>
        )}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-200 mb-2">What happens next?</h3>
          <ul className="text-sm text-gray-400 text-left space-y-2">
            <li>1. An admin will review your registration</li>
            <li>2. Once approved, you can log in to your account</li>
            <li>3. Check back here to see your approval status</li>
          </ul>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleRefreshStatus}
            className="w-full btn-primary"
          >
            Check Status Again
          </button>
          <button
            onClick={handleClearRegistration}
            className="w-full btn-secondary text-sm"
          >
            Register with Different Account
          </button>
        </div>
        <p className="mt-6 text-xs text-gray-500">
          This page will remain visible on this device until your account is approved or rejected.
        </p>
      </div>
    </div>
  );
}
