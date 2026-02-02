'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX - window.innerWidth / 2) / 50;
            const y = (e.clientY - window.innerHeight / 2) / 50;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-[#e8eaed] relative overflow-hidden" data-page="home">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
          `,
                    backgroundSize: '4cm 4cm'
                }}
            />

            <header className="bg-[#4a5568] py-5 px-8 flex justify-between items-center relative z-20">
                <div className="w-12 h-12">
                    <Image
                        src="/devince_log.svg"
                        alt="Devinche Logo"
                        width={48}
                        height={48}
                        className="w-full h-full"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggleButton />
                    {isAuthenticated ? (
                        <button
                            onClick={() => logout()}
                            className="bg-white text-gray-800 px-8 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm"
                            aria-label="Log out"
                        >
                            Log out
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-white text-gray-800 px-8 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </header>

            <main className="relative h-[calc(100vh-100px)] flex items-center justify-center">
                <div
                    className="absolute inset-0 w-full h-full pointer-events-none flex items-end justify-center pb-0"
                    style={{
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                >
                    <div className="relative w-full h-[75%]">
                        <Image
                            src="/bg.svg"
                            alt="Background illustrations"
                            fill
                            className="object-contain object-bottom"
                            priority
                        />
                    </div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-3xl -mt-80">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Inria Serif' }}>
                        Difficult diagrams are easier<br />
                        with the Devinche's editor.
                    </h1>

                    <p className="text-base text-gray-700 mb-10">
                        Space, where people work together to achieve<br />
                        the highest results.
                    </p>

                    <Link
                        href="/editor"
                        className="inline-block bg-[#f5c842] text-gray-900 px-14 py-3.5 rounded-full text-base font-semibold hover:bg-[#f0c030] transition-colors"
                    >
                        Let's go
                    </Link>
                </div>
            </main>
            <style jsx>{`
              :global([data-theme="dark"]) [data-page="home"] {
                background: var(--editor-bg);
                color: var(--editor-text);
              }
              :global([data-theme="dark"]) [data-page="home"] header {
                background: var(--editor-surface);
                border-bottom: 1px solid var(--editor-border);
              }
              :global([data-theme="dark"]) [data-page="home"] h1 {
                color: var(--editor-text);
              }
              :global([data-theme="dark"]) [data-page="home"] p {
                color: var(--editor-text-secondary);
              }
              :global([data-theme="dark"]) [data-page="home"] a.inline-block {
                background: var(--editor-warning);
                color: #111827;
              }
              :global([data-theme="dark"]) [data-page="home"] .pointer-events-none {
                background-image:
                  linear-gradient(to right, var(--editor-grid) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--editor-grid) 1px, transparent 1px) !important;
              }
            `}</style>
        </div>
    );
}