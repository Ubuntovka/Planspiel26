'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Inria_Serif } from 'next/font/google';
import ThemeToggleButton from '@/components/ThemeToggleButton';

const inriaSerif = Inria_Serif({
    weight: ['300', '400', '700'],
    subsets: ['latin']
});

//WIP
export default function AccountPage() {
    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('/devince_log.svg');
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpdateProfile = async () => {
        setIsLoading(true);
        // WIP
        setTimeout(() => setIsLoading(false), 800);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatar(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`min-h-screen bg-[#e8eaed] relative overflow-hidden ${inriaSerif.className}`} data-page="account">
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

            <header className="flex bg-[#4a5568] py-5 px-8 justify-between items-center relative z-20">
                <Link href="/editor" className="w-12 h-12">
                    <Image src="/devince_log.svg" alt="Logo" width={48} height={48} />
                </Link>
                <div className="flex items-center gap-3">
                    <ThemeToggleButton />
                    <Link href="/editor" className="bg-white text-gray-800 px-8 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm">
                        Editor
                    </Link>
                </div>
            </header>

            <main className="relative z-10 flex justify-center items-start pt-12 pb-12 px-4">
                <div className="w-full max-w-[580px]">
                    <div className="relative rounded-3xl shadow-xl p-8 md:p-12 border border-white border-opacity-40 overflow-hidden">
                        <div className="absolute inset-0 bg-[#FFC31D] opacity-15 backdrop-blur-xl" style={{
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}></div>

                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Account Settings</h1>

                            <div className="flex flex-col items-center mb-10">
                                <div
                                    className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden cursor-pointer group"
                                    onClick={handleAvatarClick}
                                >
                                    <Image
                                        src={avatar}
                                        alt="Avatar"
                                        fill
                                        className="object-cover transition-transform group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-bold text-center">Change Photo</span>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 ml-4 mb-1 block uppercase">First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full px-4 py-2 border-b-4 border-white focus:outline-none bg-transparent text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 ml-4 mb-1 block uppercase">Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full px-4 py-2 border-b-4 border-white focus:outline-none bg-transparent text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-600 ml-4 mb-1 block uppercase">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border-b-4 border-white focus:outline-none bg-transparent text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-600 ml-4 mb-1 block uppercase">New Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Leave blank to keep current"
                                        className="w-full px-4 py-2 border-b-4 border-white focus:outline-none bg-transparent text-gray-900 placeholder:text-gray-500 text-sm"
                                    />
                                </div>

                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={isLoading}
                                    className="w-full bg-[#6b93c0] text-white py-3 rounded-full text-lg font-semibold hover:bg-[#5a7fa8] transition-colors shadow-md mt-8 disabled:opacity-50"
                                >
                                    {isLoading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                :global([data-theme="dark"]) [data-page="account"] {
                    background: var(--editor-bg);
                    color: var(--editor-text);
                }
                :global([data-theme="dark"]) [data-page="account"] header {
                    background: var(--editor-surface);
                    border-bottom: 1px solid var(--editor-border);
                }
                :global([data-theme="dark"]) [data-page="account"] input {
                    color: var(--editor-text);
                    border-color: var(--editor-border-light) !important;
                }
                :global([data-theme="dark"]) [data-page="account"] h1 {
                    color: var(--editor-text);
                }
                :global([data-theme="dark"]) [data-page="account"] {
                    color: var(--editor-text-secondary);
                }
            `}</style>
        </div>
    );
}