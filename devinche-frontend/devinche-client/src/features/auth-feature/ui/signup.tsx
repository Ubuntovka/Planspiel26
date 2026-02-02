'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inria_Serif } from 'next/font/google';
import ThemeToggleButton from '@/components/ThemeToggleButton';

const inriaSerif = Inria_Serif({
    weight: ['300', '400', '700'],
    subsets: ['latin']
});

export default function SignUpPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
        setError('');
        setIsLoading(true);

        if (!firstName || !lastName || !email || !password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                }),
            });

            let data: any = null;
            try {
                data = await res.json();
            } catch (_) {

            }

            if (!res.ok) {
                const msg =
                    (data && (data.error || data.message)) ||
                    (res.status ? `${res.status} ${res.statusText}` : 'Registration failed');
                setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
                setIsLoading(false);
                return;
            }

            if (data && data.token) {
                localStorage.setItem('authToken', data.token);
            }

            router.push('/editor');
        } catch (err: any) {
            const msg = err?.message || 'Network error — is the backend running on http://localhost:4000?';
            setError(msg);
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-[#e8eaed] relative overflow-hidden ${inriaSerif.className}`} data-page="signup">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
          `,
                    backgroundSize: '1cm 1cm'
                }}
            />


            <header className="bg-[#4a5568] py-5 px-8 flex justify-between items-center relative z-20">
                <Link href="/" className="w-12 h-12">
                    <Image
                        src="/devince_log.svg"
                        alt="Devinche Logo"
                        width={48}
                        height={48}
                        className="w-full h-full"
                    />
                </Link>
                <div className="flex items-center gap-3">
                    <ThemeToggleButton />
                    <Link
                        href="/"
                        className="bg-white text-gray-800 px-8 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm"
                    >
                        Home
                    </Link>
                </div>
            </header>


            <div className="fixed bottom-0 right-0 z-0">
                <Image
                    src="/menu.svg"
                    alt="Menu illustration"
                    width={500}
                    height={500}
                    priority
                />
            </div>


            <main className="relative min-h-[calc(100vh-88px)] flex items-start justify-start pl-75 pt-27 z-10">
                <div className="w-[580px]">
                    <div className="relative rounded-3xl shadow-xl p-25 border border-white border-opacity-40 overflow-hidden">
                        <div className="absolute inset-0 bg-[#FFC31D] opacity-15 backdrop-blur-xl" style={{
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}></div>
                        <div
                            style={{
                                content: '',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: '28px',
                                boxShadow: 'inset 6px 6px 0px -6px rgba(255, 255, 255, 0.7), inset 0 0 8px 1px rgba(255, 255, 255, 0.7)',
                                pointerEvents: 'none',
                                zIndex: 1,
                            }}
                        />

                        <div className="relative z-15">
                            <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
                                Sign up
                            </h1>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="First name"
                                        className="w-full px-4 py-2 border-b-4 border-white focus:outline-none focus:border-white placeholder:text-gray-800 placeholder:font-semibold text-sm bg-transparent"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Last name"
                                        className="w-full px-4 py-2 border-b-4 border-white focus:outline-none focus:border-white placeholder:text-gray-800 placeholder:font-semibold text-sm bg-transparent"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>


                                <div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        className="w-full px-4 py-2 border-b-4 border-white focus:outline-none focus:border-white placeholder:text-gray-800 placeholder:font-semibold text-sm bg-transparent"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="w-full px-4 py-2 border-b-4 border-white focus:outline-none focus:border-white placeholder:text-gray-800 placeholder:font-semibold text-sm bg-transparent"
                                        required
                                        disabled={isLoading}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSignUp();
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-gray-600 mt-1">
                                        Password must be at least 8 characters long
                                    </p>
                                </div>

                                <button
                                    onClick={handleSignUp}
                                    disabled={isLoading}
                                    className="w-full bg-[#6b93c0] text-white py-3 rounded-full text-lg font-semibold hover:bg-[#5a7fa8] transition-colors shadow-md mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Registering...' : 'Register'}
                                </button>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-700">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <style jsx>{`
              :global([data-theme="dark"]) [data-page="signup"] {
                background: var(--editor-bg);
                color: var(--editor-text);
              }
              :global([data-theme="dark"]) [data-page="signup"] header {
                background: var(--editor-surface);
                border-bottom: 1px solid var(--editor-border);
              }
              :global([data-theme="dark"]) [data-page="signup"] h1 {
                color: var(--editor-text);
              }
              :global([data-theme="dark"]) [data-page="signup"] .pointer-events-none {
                background-image:
                  linear-gradient(to right, var(--editor-grid) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--editor-grid) 1px, transparent 1px) !important;
              }
              :global([data-theme="dark"]) [data-page="signup"] input::placeholder {
                color: var(--editor-text-secondary);
              }
              :global([data-theme="dark"]) [data-page="signup"] input {
                color: var(--editor-text);
                border-color: var(--editor-border-light) !important;
              }
              :global([data-theme="dark"]) [data-page="signup"] button.w-full {
                background: var(--editor-accent) !important;
              }
              :global([data-theme="dark"]) [data-page="signup"] button.w-full:hover {
                background: var(--editor-accent-hover) !important;
              }
              :global([data-theme="dark"]) [data-page="signup"] p.text-xs {
                color: var(--editor-text-secondary);
              }
              :global([data-theme="dark"]) [data-page="signup"] .rounded-3xl {
                box-shadow: 0 8px 16px var(--editor-shadow-lg) !important;
              }
            `}</style>
        </div>
    );
}