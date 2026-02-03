'use client';

import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ValidationRulesPage() {
    return (
        <ProtectedRoute>
        <div className="min-h-screen bg-[#e8eaed] relative overflow-hidden">
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
                <Link
                    href="/login"
                    className="bg-white text-gray-800 px-8 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm"
                >
                    Sign Up
                </Link>
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
                </div>
            </main>
        </div>
        </ProtectedRoute>
    );
}