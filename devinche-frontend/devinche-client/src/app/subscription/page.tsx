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
    <div className="min-h-screen bg-[#e8eaed] relative overflow-x-hidden" data-page="subscription">
      <div
        className="absolute inset-0 pointer-events-none"
        data-grid="bg"
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

      <main className="relative flex flex-col items-center justify-start px-4 pt-10 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full pointer-events-none flex items-end justify-center pb-0"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.1s ease-out'
          }}>
        </div>

        <div className="relative z-10 text-center max-w-3xl mt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Devinche</h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4 md:mb-6 leading-tight">
            Choose Your Plan
          </h1>
          <p className="text-base md:text-base text-gray-700">
            Simple, fast, accurate WAM diagramming. Start free, upgrade when you need more.
          </p>
        </div>

        <section className="relative z-10 w-full max-w-6xl mt-10 md:mt-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="min-h-[34rem] relative rounded-3xl shadow-xl p-8 md:p-10 border border-white border-opacity-40 overflow-hidden isolate"
              >
                <div
                  className="card-overlay absolute inset-0 bg-[#FFC31D] opacity-20 backdrop-blur-xl"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                  }}
                />
                <div
                  className="card-shine"
                  style={{
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

                <div className="relative z-10 w-full h-full flex flex-col items-start justify-start gap-4">
                  {i === 0 ? (
                    <>
                      <div className="space-y-2">
                        <span className="plan-tag inline-block text-xs tracking-widest uppercase text-gray-700">Student Exclusive</span>
                        <h3 className="plan-title text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Inria Serif' }}>100% Free for Students</h3>
                        <p className="plan-desc text-gray-800 text-base">Everything you need to master WAM modeling</p>
                      </div>

                      <ul className="grid grid-cols-1 gap-4 w-full mt-2">
                        <li className="feature-item bg-white/50 rounded-xl p-4 border border-white/60">
                          <div className="feature-title font-semibold text-gray-900">Full Access</div>
                          <div className="feature-body text-gray-700 text-sm">Unlimited diagrams, AI-powered modeling, semantic exports</div>
                        </li>
                        <li className="feature-item bg-white/50 rounded-xl p-4 border border-white/60">
                          <div className="feature-title font-semibold text-gray-900">Team Collaboration</div>
                          <div className="feature-body text-gray-700 text-sm">Real-time editing with classmates on group projects</div>
                        </li>
                        <li className="feature-item bg-white/50 rounded-xl p-4 border border-white/60">
                          <div className="feature-title font-semibold text-gray-900">Premium Features</div>
                          <div className="feature-body text-gray-700 text-sm">Access to WAM templates, validation, and priority support</div>
                        </li>
                        <li className="feature-item bg-white/50 rounded-xl p-4 border border-white/60">
                          <div className="feature-title font-semibold text-gray-900">Learning Resources</div>
                          <div className="feature-body text-gray-700 text-sm">Exclusive tutorials, guides, and WAM best practices</div>
                        </li>
                      </ul>

                      <div className="mt-4">
                        <Link
                          href="/signup?student=1"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                        >
                          Verify Student Status &amp; Start Free
                        </Link>
                        <div className="text-xs text-grey mt-2">
                          Requires valid university email or student ID verification
                        </div>
                      </div>
                    </>
                  ) : i === 1 ? (
                    <>
                      <div className="space-y-2">
                        <span className="plan-tag inline-block text-xs tracking-widest uppercase text-gray-700">Popular</span>
                        <h3 className="plan-title text-3xl md:text-4xl font-bold text-gray-900">Standard</h3>
                        <p className="plan-desc text-gray-800 text-base">Perfect for individual professionals and freelancers who need fast, accurate WAM diagrams.</p>
                      </div>

                      <div className="mt-1">
                        <div className="text-3xl md:text-4xl font-bold text-gray-900">
                          <span className="price-amount">€9</span>
                          <span className="text-base font-semibold text-gray-800 price-suffix">/month</span>
                        </div>
                      </div>

                      <ul className="grid grid-cols-1 gap-3 w-full mt-2">
                        {['Unlimited diagrams & projects', 'AI-powered diagram generation', 'Real-time WAM validation', 'Semantic model exports', 'Cloud storage & sync', 'Standard support', 'Export to PNG, SVG, PDF', 'Personal workspace'].map((item) => (
                          <li key={item} className="feature-item bg-white/50 rounded-xl p-3 border border-white/60 text-gray-900">{item}</li>
                        ))}
                      </ul>

                      <div className="mt-4 w-full">
                        <button className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto">
                          Start Standard Plan
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <span className="plan-tag inline-block text-xs tracking-widest uppercase text-gray-700">Enterprise</span>
                        <h3 className="plan-title text-3xl md:text-4xl font-bold text-gray-900">Business</h3>
                        <p className="plan-desc text-gray-800 text-base">Built for teams and organizations that need collaboration, compliance, and control.</p>
                      </div>

                      <div className="mt-1">
                        <div className="text-3xl md:text-4xl font-bold text-gray-900">
                          <span className="price-amount">€29</span>
                          <span className="text-base font-semibold text-gray-800 price-suffix">/user/mo</span>
                        </div>
                        <div className="text-sm text-gray-800 mt-1 price-note">Minimum 5 users</div>
                      </div>

                      <div className="mt-2 text-sm font-semibold text-gray-900 section-lead">Everything in Standard, plus:</div>

                      <ul className="grid grid-cols-1 gap-3 w-full mt-2">
                        {['Unlimited team members', 'Advanced collaboration features', 'Role-based access control', 'Version history & rollback', 'Priority support (24/7)', 'Custom WAM templates library', 'SSO & advanced security', 'API access for integrations', 'Dedicated account manager', 'On-boarding & training sessions', 'Usage analytics dashboard'].map((item) => (
                          <li key={item} className="feature-item bg-white/50 rounded-xl p-3 border border-white/60 text-gray-900">{item}</li>
                        ))}
                      </ul>

                      <div className="mt-4 w-full">
                        <button className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto">
                          Contact Sales
                        </button>
                      </div>
                    </>
                  )}
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
        :global([data-theme="dark"]) [data-page="subscription"] .plan-title {
          color: #f5f5f5 !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] .plan-tag {
          color: #c8c8c8 !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] .plan-desc {
          color: var(--editor-text-secondary) !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] p {
          color: var(--editor-text-secondary);
        }
        :global([data-theme="dark"]) [data-page="subscription"] .price-amount {
          color: #fafafa !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] .price-suffix {
          color: #d0d0d0 !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] .price-note {
          color: #c8c8c8 !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] .section-lead {
          color: #f0f0f0 !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] .card-overlay {
          background: #FFC31D !important;
          opacity: 0.12 !important;
        }
        [data-page="subscription"] button,
        [data-page="subscription"] a.inline-flex {
          background-color: #111827 !important;
          color: #ffffff !important;
        }
        [data-page="subscription"] button:hover,
        [data-page="subscription"] a.inline-flex:hover {
          background-color: #1f2937 !important;
          color: #ffffff !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] .card-shine {
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08) !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] .feature-item {
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #e8e8e8 !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] .feature-title {
          color: #f5f5f5 !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] .feature-body {
          color: #c0c0c0 !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] [data-grid="bg"] {
          background-image:
            linear-gradient(to right, var(--editor-grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--editor-grid) 1px, transparent 1px) !important;
        }
        :global([data-theme="dark"]) [data-page="subscription"] {
          background-image:
            linear-gradient(to right, var(--editor-grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--editor-grid) 1px, transparent 1px) !important;
        }
      `}</style>
    </div>
  );
}
