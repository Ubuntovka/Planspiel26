'use client';

import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ValidationRulesPage() {
    return (
        <ProtectedRoute>
        <div className="min-h-screen bg-[#e8eaed] relative overflow-hidden" data-page="validation-rules">
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
                <Link href="/editor" className="w-12 h-12">
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
                    <Link
                        href="/editor"
                        className="bg-white text-gray-800 px-8 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm"
                    >
                        Back to Editor
                    </Link>
                </div>
            </header>

            <main className="relative h-[calc(100vh-100px)] flex items-center justify-center">
                <div className="relative z-10 text-center px-4 max-w-3xl -mt-80">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Inria Serif' }}>
                        The rules of WAM
                    </h1>
                    <ol className='text-xl'>
                        <li className="text-left mb-2">1. Trust relationships can only exists between two security realms</li>
                        <li className="text-left mb-2">
                            2. Invocation relationships can only exist in the following forms:
                            <ul className='list-disc list-inside ml-5'>
                                <li className='text-left mb-1'>From application node to service node</li>
                                <li className='text-left mb-1'>From service node to service node</li>
                            </ul>
                        </li>
                        <li className="text-left mb-2">3. Legacy relationships can only exist in the following forms:</li>
                            <ul className='list-disc list-inside ml-5'>
                                <li className='text-left mb-1'>From application node to data unit</li>
                                <li className='text-left mb-1'>From application node to processing unit</li>
                                <li className='text-left mb-1'>From service node to data unit</li>
                                <li className='text-left mb-1'>From service node to processing unit</li>

                            </ul>
                        <li className="text-left mb-2">4. Security realms must contain another node</li>
                        <li className="text-left mb-2">5. Identity providors cannot have any relationships</li>
                    </ol>
                    <div className="text-left mt-10 p-4 bg-white/80 rounded-lg border border-gray-200 shadow-sm" data-validation-card>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">How to check the connection between two realms</h2>
                        <p className="text-gray-700 mb-2">To verify that a trust connection between two security realms is valid:</p>
                        <ol className="list-decimal list-inside space-y-1 text-gray-700">
                            <li>In the editor, use the edge palette to select <strong>Trust</strong>.</li>
                            <li>Draw an edge from one <strong>Security Realm</strong> node to another (drag from the first realm to the second).</li>
                            <li>Click <strong>Validate</strong> in the toolbar. If the connection is correct (realm → realm), you will see <strong>No Validation Errors</strong>. If the edge is invalid (e.g. realm to app), the edge will turn red and an error will list the invalid trust.</li>
                        </ol>
                        <p className="text-gray-600 mt-2 text-sm">So: trust is only valid between two security realms; the Validate button is how you check that the connection works.</p>
                    </div>
                </div>
            </main>
            <style jsx>{`
                :global([data-theme="dark"]) [data-page="validation-rules"] {
                    background: var(--editor-bg);
                    color: var(--editor-text);
                }
                :global([data-theme="dark"]) [data-page="validation-rules"] header {
                    background: var(--editor-surface);
                    border-bottom: 1px solid var(--editor-border);
                }
                :global([data-theme="dark"]) [data-page="validation-rules"] h1,
                :global([data-theme="dark"]) [data-page="validation-rules"] h2 {
                    color: var(--editor-text);
                }
                :global([data-theme="dark"]) [data-page="validation-rules"] p,
                :global([data-theme="dark"]) [data-page="validation-rules"] li,
                :global([data-theme="dark"]) [data-page="validation-rules"] .text-gray-700,
                :global([data-theme="dark"]) [data-page="validation-rules"] .text-gray-600 {
                    color: var(--editor-text-secondary);
                }
                :global([data-theme="dark"]) [data-page="validation-rules"] .text-gray-900 {
                    color: var(--editor-text);
                }
                :global([data-theme="dark"]) [data-page="validation-rules"] [data-validation-card] {
                    background: var(--editor-surface) !important;
                    border-color: var(--editor-border) !important;
                }
                :global([data-theme="dark"]) [data-page="validation-rules"] {
                    background-image:
                        linear-gradient(to right, var(--editor-grid) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--editor-grid) 1px, transparent 1px) !important;
                }
            `}</style>
        </div>
        </ProtectedRoute>
    );
}