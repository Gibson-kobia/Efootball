import { Suspense } from 'react';
import LoginContent from './login-content';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-12"><div className="card">Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}

