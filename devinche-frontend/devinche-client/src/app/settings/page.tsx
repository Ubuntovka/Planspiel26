'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Inria_Serif } from 'next/font/google';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { updateUser, deleteAccount, type UpdateUserPayload } from '@/features/auth-feature/api';

const inriaSerif = Inria_Serif({
    weight: ['300', '400', '700'],
    subsets: ['latin']
});

export default function AccountPage() {
    const router = useRouter();
    const { user, token, loading, refreshUser, logout } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('/devince_log.svg');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setAvatar(user.pictureUrl || '/devince_log.svg');
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        if (!token) return;
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const payload: UpdateUserPayload = {
                firstName: firstName?.trim(),
                lastName: lastName?.trim(),
                email: email?.trim(),
            };
            if (password && password.length >= 8) {
                payload.password = password;
            }
            if (avatar && avatar !== (user?.pictureUrl || '/devince_log.svg')) {
                payload.pictureUrl = avatar;
            }
            await updateUser(token, payload);
            await refreshUser();
            setPassword('');
            setSuccess('Profile updated');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to update profile';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!token) return;
        const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmed) return;
        setIsLoading(true);
        setError(null);
        try {
            await deleteAccount(token);
            await logout();
            router.replace('/');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to delete account';
            setError(message);
        } finally {
            setIsLoading(false);
        }
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
        <div className={`min-h-screen bg-[#e8eaed] relative overflow-x-hidden overflow-y-auto md:overflow-visible ${inriaSerif.className}`} data-page="account">
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
                    <Link href="/editor" className="editor-btn bg-white text-gray-800 px-8 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm">
                        Editor
                    </Link>
                </div>
            </header>

            <main className="relative z-10 flex justify-center items-start pt-6 md:pt-12 pb-16 md:pb-20 px-4">
                <div className="w-full max-w-[580px]">
                    <div className="card relative rounded-3xl shadow-xl p-6 md:p-12 border border-white border-opacity-40 overflow-hidden">
                        <div className="card-overlay absolute inset-0 bg-[#FFC31D] opacity-15 backdrop-blur-xl" style={{
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}></div>

                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold text-center mb-4 text-gray-900">Account Settings</h1>
                            {error && (
                                <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
                            )}
                            {success && (
                                <div className="mb-4 text-green-600 text-sm text-center">{success}</div>
                            )}

                            <div className="flex flex-col items-center mb-6">
                                <div
                                    className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden cursor-pointer group"
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

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

                                <div className="mt-2">
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
                                    className="w-full bg-[#6b93c0] text-white py-3 rounded-full text-lg font-semibold hover:bg-[#5a7fa8] transition-colors shadow-md mt-4 disabled:opacity-50"
                                >
                                    {isLoading ? 'Updating...' : 'Save Changes'}
                                </button>

                                <hr className="divider border-white border-opacity-30 my-6" />

                                <div className="pt-1">
                                    <h3 className="text-base font-bold text-red-600 mb-2">Danger Zone</h3>
                                    <p className="text-xs text-gray-600 mb-3">Once you delete your account, there is no going back. Please be certain.</p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="w-full text-red-600 border-2 border-red-600 px-5 py-2 rounded-full text-sm font-bold hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        Delete Account
                                    </button>
                                </div>
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
                :global([data-theme="dark"]) [data-page="account"]{
                    background: var(--editor-surface) !important;
                    color: var(--editor-text) !important;
                    border: 1px solid var(--editor-border);
                }
                :global([data-theme="dark"]) [data-page="account"]  {
                    background: rgba(255,255,255,0.04) !important;
                }
                :global([data-theme="dark"]) [data-page="account"]  {
                    background: var(--editor-surface);
                    border-color: var(--editor-border);
                }
                :global([data-theme="dark"]) [data-page="account"]  {
                    display: none; 
                }
                :global([data-theme="dark"]) [data-page="account"] input {
                    color: var(--editor-text);
                    border-color: var(--editor-border-light) !important;
                }
                :global([data-theme="dark"]) [data-page="account"] input::placeholder {
                    color: var(--editor-text-secondary);
                }
                :global([data-theme="dark"]) [data-page="account"] h1 {
                    color: var(--editor-text);
                }
                :global([data-theme="dark"]) [data-page="account"] label,
                :global([data-theme="dark"]) [data-page="account"] p {
                    color: var(--editor-text-secondary);
                }
                :global([data-theme="dark"]) [data-page="account"] {
                    border-color: var(--editor-border);
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}