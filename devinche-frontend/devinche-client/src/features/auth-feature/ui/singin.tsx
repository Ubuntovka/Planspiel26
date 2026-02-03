'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Inria_Serif } from 'next/font/google';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import { useAuth } from '@/contexts/AuthContext';
import { login as apiLogin, getApiBase } from '@/features/auth-feature/api';

// Minimal types for Google Identity Services (GIS) OAuth Code flow
type GoogleOAuthCodeResponse = {
    code?: string;
    scope?: string;
    authuser?: string;
    prompt?: string;
};

type GoogleCodeClient = {
    requestCode: () => void;
};

type GoogleInitCodeClientConfig = {
    client_id: string;
    scope: string;
    ux_mode?: 'popup' | 'redirect';
    callback: (response: GoogleOAuthCodeResponse) => void;
};

type GoogleAccountsOAuth2 = {
    initCodeClient: (config: GoogleInitCodeClientConfig) => GoogleCodeClient;
};

type GoogleAccounts = {
    oauth2: GoogleAccountsOAuth2;
};

declare global {
    interface Window {
        google?: { accounts: GoogleAccounts };
    }
}

const inriaSerif = Inria_Serif({
    weight: ['300', '400', '700'],
    subsets: ['latin']
});

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setSession, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const googleScriptLoadedRef = useRef(false);
    const codeClientRef = useRef<GoogleCodeClient | null>(null);

    const returnUrl = searchParams.get('returnUrl') || '/editor';
    // Always redirect to /editor (diagrams selection) after login, never directly to editor/[id]
    const postLoginUrl = returnUrl.startsWith('/editor/') ? '/editor' : returnUrl;

    useEffect(() => {
        if (isAuthenticated) {
            router.replace(postLoginUrl);
        }
    }, [isAuthenticated, router, postLoginUrl]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { user, token } = await apiLogin(email, password);
            setSession(token, user);
            router.push(postLoginUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadGoogleScript = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (googleScriptLoadedRef.current) return resolve();
            if (typeof window === 'undefined') return reject(new Error('Window is undefined'));
            const existing = document.getElementById('google-identity-services');
            if (existing) {
                googleScriptLoadedRef.current = true;
                return resolve();
            }
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.id = 'google-identity-services';
            script.onload = () => { googleScriptLoadedRef.current = true; resolve(); };
            script.onerror = () => reject(new Error('Failed to load Google script'));
            document.body.appendChild(script);
        });
    }, []);

    // Initialize Google OAuth Code Client once (popup flow)
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                await loadGoogleScript();
                if (!mounted) return;
                const googleObj = (typeof window !== 'undefined') ? window.google : undefined;
                const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '332723524164-9hq53ucjcmv5eedbhnb6nosagif20nv9.apps.googleusercontent.com';
                if (googleObj && clientId && !codeClientRef.current) {
                    try {
                        codeClientRef.current = googleObj.accounts.oauth2.initCodeClient({
                            client_id: clientId,
                            ux_mode: 'popup',
                            scope: 'openid email profile',
                            // Redirect URI is managed server-side during code exchange; popup returns code directly
                            callback: async (response: GoogleOAuthCodeResponse) => {
                                try {
                                    const code = response?.code;
                                    if (!code) {
                                        setError('Google authorization code missing');
                                        return;
                                    }
                                    const apiBase = getApiBase();
                                    const res = await fetch(`${apiBase}/api/users/oauth/google/code`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ code })
                                    });
                                    const data = await res.json();
                                    if (!res.ok) {
                                        setError(data?.error || 'Google login failed');
                                        return;
                                    }
                                    if (data.token && data.user) {
                                        setSession(data.token, data.user);
                                    }
                                    router.push(postLoginUrl);
                                } catch (e) {
                                    setError('Failed to login with Google');
                                }
                            },
                        });
                    } catch (e) {
                        // no-op, will surface on click
                    }
                }
            } catch {
                // script load error handled on click
            }
        })();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGoogleLogin = useCallback(async () => {
        setError('');
        try {
            await loadGoogleScript();
            const googleObj = (typeof window !== 'undefined') ? window.google : undefined;
            if (!googleObj) {
                setError('Google client not initialized');
                return;
            }
            if (!codeClientRef.current) {
                setError('Google code client not ready');
                return;
            }
            codeClientRef.current.requestCode();
        } catch (err) {
            setError('Failed to initialize Google login');
        }
    }, [loadGoogleScript, router]);

    const handleGitlabLogin = () => {
        console.log('GitLab login initiated');
        // Implement GitLab OAuth logic here
    };

    return (
        <div className={`min-h-screen bg-[#e8eaed] relative overflow-hidden ${inriaSerif.className}`} data-page="login">
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

            <div className="fixed bottom-0 left-8 z-0">
                <Image
                    src="/mona_2.svg"
                    alt="Mona Lisa"
                    width={550}
                    height={600}
                    priority
                />
            </div>

            <main className="relative min-h-[calc(100vh-88px)] flex items-start justify-end pr-95 pt-27 z-10">
                <div className="w-120">
                    <div className="relative rounded-3xl shadow-xl p-20 border border-white border-opacity-40 overflow-hidden">
                        <div className="absolute inset-0 bg-[#FFC31D] opacity-15 backdrop-blur-xl" style={{
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}></div>

                        <div className="relative z-10">
                            <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
                                Login
                            </h1>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-6">
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

                                {/* Password Field */}
                                <div>
                                    <div className="flex justify-between items-center">
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
                                                    handleLogin(e);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="text-right mt-1">
                                        <Link href="/forgot-password" className="text-xs text-gray-800 hover:text-gray-800">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className="w-full bg-[#6b93c0] text-white py-3 rounded-full text-lg font-semibold hover:bg-[#5a7fa8] transition-colors shadow-md mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>

                            <div className="mt-6">
                                <p className="text-center text-sm text-gray-700 mb-4">
                                    Or log in with:
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={handleGoogleLogin}
                                        className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md"
                                        aria-label="Login with Google"
                                        disabled={isLoading}
                                    >
                                        <Image
                                            src="/google.svg"
                                            alt="Google"
                                            width={30}
                                            height={30}
                                        />
                                    </button>

                                    <button
                                        onClick={handleGitlabLogin}
                                        className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md"
                                        aria-label="Login with GitLab"
                                        disabled={isLoading}
                                    >
                                        <Image
                                            src="/gitlab.svg"
                                            alt="GitLab"
                                            width={80}
                                            height={80}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-700">
                                    Don't you have an account?{' '}
                                    <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <style jsx>{`
              :global([data-theme="dark"]) [data-page="login"] {
                background: var(--editor-bg);
                color: var(--editor-text);
              }
              :global([data-theme="dark"]) [data-page="login"] header {
                background: var(--editor-surface);
                border-bottom: 1px solid var(--editor-border);
              }
              :global([data-theme="dark"]) [data-page="login"] h1 {
                color: var(--editor-text);
              }
              :global([data-theme="dark"]) [data-page="login"] .pointer-events-none {
                background-image:
                  linear-gradient(to right, var(--editor-grid) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--editor-grid) 1px, transparent 1px) !important;
              }
              :global([data-theme="dark"]) [data-page="login"] input::placeholder {
                color: var(--editor-text-secondary);
              }
              :global([data-theme="dark"]) [data-page="login"] input {
                color: var(--editor-text);
                border-color: var(--editor-border-light) !important;
              }
              :global([data-theme="dark"]) [data-page="login"] button.w-full {
                background: var(--editor-accent) !important;
              }
              :global([data-theme="dark"]) [data-page="login"] button.w-full:hover {
                background: var(--editor-accent-hover) !important;
              }
            `}</style>
        </div>
    );
}