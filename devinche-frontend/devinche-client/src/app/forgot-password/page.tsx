'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Inria_Serif } from 'next/font/google';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import { resetPassword } from '@/features/auth-feature/api';

const inriaSerif = Inria_Serif({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(email, password);
      setSuccess(res.message || 'Password has been reset successfully.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset password';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#e8eaed] relative overflow-hidden ${inriaSerif.className}`} data-page="forgot-password">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
          `,
          backgroundSize: '1cm 1cm',
        }}
      />

      <header className="bg-[#4a5568] py-5 px-8 flex justify-between items-center relative z-20">
        <Link href="/" className="w-12 h-12">
          <Image src="/devince_log.svg" alt="Devinche Logo" width={48} height={48} className="w-full h-full" />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggleButton />
          <Link href="/" className="bg-white text-gray-800 px-8 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm">
            Home
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <div className="container mx-auto px-6 md:px-12 min-h-[calc(100vh-88px)] flex items-center justify-center">
          <div className="w-full max-w-[550px] py-10 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">Forgot your password</h1>
            <p className="text-gray-700 mb-8 text-center">Enter your email and set a new password.</p>

            <form onSubmit={handleSubmit} className="relative rounded-3xl shadow-xl p-8 sm:p-12 md:p-20 border border-white border-opacity-40 overflow-hidden">
              <div
                className="absolute inset-0 bg-[#FFC31D] opacity-20 backdrop-blur-xl"
                style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
              />
              <div className="relative z-10">
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full px-4 py-2 border-b-4 border-white focus:outline-none bg-transparent text-gray-900"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      id="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full px-4 py-2 border-b-4 border-white focus:outline-none bg-transparent text-gray-900"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-4 py-2 border-b-4 border-white focus:outline-none bg-transparent text-gray-900"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>
                )}
                {success && (
                  <div className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">{success}</div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-full font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Resetting…' : 'Reset password'}
                </button>

                <div className="mt-6 text-center text-sm text-gray-700">
                  Remembered it?{' '}
                  <Link href="/login" className="underline hover:text-gray-900">Back to login</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
