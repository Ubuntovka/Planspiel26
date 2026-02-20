'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';

export default function SubscriptionPage() {
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
    <div className="min-h-screen bg-[#e8eaed] relative overflow-hidden" data-page="subscription">
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
          <LanguageSwitcher variant="darkHeader" />
          <ThemeToggleButton />
          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              className="bg-white text-gray-800 px-8 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-white text-gray-800 px-8 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="relative flex flex-col items-center justify-start px-4 pt-10 pb-16">
        <div
          className="absolute inset-0 w-full h-full pointer-events-none flex items-end justify-center pb-0"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.1s ease-out'
          }}>
        </div>

        <div className="relative z-10 text-center max-w-3xl mt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Inria Serif' }}>Devinche</h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4 md:mb-6 leading-tight" style={{ fontFamily: 'Inria Serif' }}>
            Choose Your Plan
          </h1>
          <p className="text-base md:text-base text-gray-700">
            Simple, fast, accurate WAM diagramming. Start free, upgrade when you need more.
          </p>
        </div>

        <section className="relative z-10 w-full max-w-6xl mt-10 md:mt-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-56 md:h-72 relative rounded-3xl shadow-xl p-8 md:p-10 border border-white border-opacity-40 overflow-hidden">
                <div
                  className="absolute inset-0 bg-[#FFC31D] opacity-20 backdrop-blur-xl"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                  }}
                />
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
                    zIndex: 1
                  }}
                />

                <div className="relative z-10 w-full h-full flex items-center justify-center">

                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        :global([data-theme="dark"]) [data-page="subscription"] {
          background: var(--editor-bg);
          color: var(--editor-text);
        }
        :global([data-theme="dark"]) [data-page="subscription"] header {
          background: var(--editor-surface);
          border-bottom: 1px solid var(--editor-border);
        }
        :global([data-theme="dark"]) [data-page="subscription"] h1,
        :global([data-theme="dark"]) [data-page="subscription"] h2 {
          color: var(--editor-text);
        }
        :global([data-theme="dark"]) [data-page="subscription"] p {
          color: var(--editor-text-secondary);
        }
        :global([data-theme="dark"]) [data-page="subscription"]{
          background-image:
            linear-gradient(to right, var(--editor-grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--editor-grid) 1px, transparent 1px) !important;
        }
      `}</style>
    </div>
  );
}
