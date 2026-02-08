'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Inria_Serif } from 'next/font/google';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import UserAvatarMenu from '@/components/UserAvatarMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { updateUser, deleteAccount, type UpdateUserPayload } from '@/features/auth-feature/api';

const inriaSerif = Inria_Serif({
    weight: ['300', '400', '700'],
    subsets: ['latin']
});

export default function AccountPage() {
    const router = useRouter();
    const { t } = useLanguage();
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
            if (avatar.startsWith('data:') && avatar !== (user?.pictureUrl ?? '')) {
                payload.pictureUrl = avatar;
            }
            await updateUser(token, payload);
            await refreshUser();
            setPassword('');
            setSuccess(t('settings.profileUpdated'));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to update profile';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!token) return;
        const confirmed = window.confirm(t('settings.deleteAccountConfirm'));
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

    const resizeImageToDataUrl = (file: File, maxSize = 400, quality = 0.85): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                const w = img.naturalWidth;
                const h = img.naturalHeight;
                const scale = Math.min(1, maxSize / w, maxSize / h);
                const cw = Math.round(w * scale);
                const ch = Math.round(h * scale);
                const canvas = document.createElement('canvas');
                canvas.width = cw;
                canvas.height = ch;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas not supported'));
                    return;
                }
                ctx.drawImage(img, 0, 0, cw, ch);
                try {
                    const dataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(dataUrl);
                } catch {
                    reject(new Error('Failed to encode image'));
                }
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Invalid image file'));
            };
            img.src = url;
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file (e.g. JPG, PNG)');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('Image must be smaller than 10 MB');
            return;
        }
        setError(null);
        try {
            const dataUrl = await resizeImageToDataUrl(file);
            setAvatar(dataUrl);
            setSuccess(t('settings.photoSelectedHint'));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load image');
        }
        e.target.value = '';
    };

    return (
        <div className={`min-h-screen relative overflow-hidden ${inriaSerif.className}`} data-page="account">
            <div
                className="absolute inset-0 pointer-events-none account-grid"
                style={{
                    backgroundSize: '1cm 1cm'
                }}
            />

            <header className="flex py-5 px-6 sm:px-8 justify-between items-center relative z-20 gap-4 account-header">
                <div className="flex items-center gap-3 min-w-0">
                    <Link href="/" className="flex-shrink-0 w-12 h-12" aria-label="Devinche home">
                        <Image src="/devince_log.svg" alt="Devinche" width={48} height={48} className="w-12 h-12" />
                    </Link>
                    <div className="border-l border-white/30 pl-3 sm:pl-4 min-w-0">
                        <h1 className="text-base sm:text-lg font-bold text-white truncate">{t('settings.accountSettings')}</h1>
                        <p className="text-xs text-white/80 truncate hidden sm:block">Manage your profile</p>
                    </div>
                </div>
                <nav className="flex items-center gap-2 sm:gap-3 flex-shrink-0" aria-label="Page actions">
                    <Link
                        href="/editor"
                        className="account-editor-btn bg-white text-gray-800 px-4 sm:px-6 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm"
                    >
                        {t('settings.myDiagrams')}
                    </Link>
                    {/* <LanguageSwitcher variant="darkHeader" /> */}
                    <ThemeToggleButton />
                    <UserAvatarMenu />
                </nav>
            </header>

            <main className="relative z-10 flex justify-center items-start pt-12 pb-20 px-4">
                <div className="w-full max-w-[580px] animate-content-in">
                    <div className="account-card relative rounded-3xl shadow-xl p-8 md:p-12 overflow-hidden">
                        <div className="account-card-overlay absolute inset-0 backdrop-blur-xl" style={{
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}></div>

                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold text-center mb-4 account-title">{t('settings.accountSettings')}</h1>
                            {error && (
                                <div className="mb-4 text-red-600 text-sm text-center account-error">{error}</div>
                            )}
                            {success && (
                                <div className="mb-4 text-green-600 text-sm text-center account-success">{success}</div>
                            )}

                            <div className="flex flex-col items-center mb-6">
                                <div
                                    className="relative w-24 h-24 rounded-full border-4 shadow-lg overflow-hidden cursor-pointer group account-avatar-ring bg-gray-200"
                                    onClick={handleAvatarClick}
                                >
                                    {avatar.startsWith('data:') ? (
                                        <img
                                            src={avatar}
                                            alt="Avatar"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                    ) : (
                                        <Image
                                            src={avatar}
                                            alt="Avatar"
                                            fill
                                            className="object-cover transition-transform group-hover:scale-110"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-bold text-center">{t('settings.changePhoto')}</span>
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
                                        <label className="text-xs font-bold ml-4 mb-1 block uppercase account-label">{t('settings.firstNameLabel')}</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full px-4 py-2 border-b-4 focus:outline-none bg-transparent account-input account-input-border"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold ml-4 mb-1 block uppercase account-label">{t('settings.lastNameLabel')}</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full px-4 py-2 border-b-4 focus:outline-none bg-transparent account-input account-input-border"
                                        />
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <label className="text-xs font-bold ml-4 mb-1 block uppercase account-label">{t('settings.emailAddressLabel')}</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border-b-4 focus:outline-none bg-transparent account-input account-input-border"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold ml-4 mb-1 block uppercase account-label">{t('settings.newPasswordLabel')}</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={t('settings.leaveBlankToKeep')}
                                        className="w-full px-4 py-2 border-b-4 focus:outline-none bg-transparent account-input account-input-border text-sm"
                                    />
                                </div>

                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={isLoading}
                                    className="w-full py-3 rounded-full text-lg font-semibold shadow-md mt-4 disabled:opacity-50 account-save-btn"
                                >
                                    {isLoading ? t('settings.updating') : t('settings.saveChanges')}
                                </button>

                                <hr className="account-divider my-6" />

                                <div className="pt-1">
                                    <h3 className="text-base font-bold text-red-600 mb-2 account-danger-title">{t('settings.dangerZone')}</h3>
                                    <p className="text-xs mb-3 account-label">{t('settings.dangerZoneWarning')}</p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="w-full text-red-600 border-2 border-red-600 px-5 py-2 rounded-full text-sm font-bold hover:bg-red-600 hover:text-white transition-all account-delete-btn"
                                    >
                                        {t('settings.deleteAccount')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                /* Light: page and grid */
                [data-page="account"] {
                    background: #e8eaed;
                }
                [data-page="account"] .account-grid {
                    background-image: linear-gradient(to right, #d1d5db 1px, transparent 1px),
                        linear-gradient(to bottom, #d1d5db 1px, transparent 1px);
                }
                [data-page="account"] .account-header {
                    background: #4a5568;
                }
                [data-page="account"] .account-header h1,
                [data-page="account"] .account-header p {
                    color: white;
                }
                [data-page="account"] .account-header a:not(.account-editor-btn) {
                    color: rgba(255,255,255,0.9);
                }
                [data-page="account"] .account-header .account-editor-btn {
                    color: #1f2937;
                }
                [data-page="account"] .account-card {
                    background: rgba(255,255,255,0.9);
                    border: 1px solid rgba(255,255,255,0.4);
                }
                [data-page="account"] .account-card-overlay {
                    background: #FFC31D;
                    opacity: 0.15;
                }
                [data-page="account"] .account-title { color: #111827; }
                [data-page="account"] .account-label { color: #4b5563; }
                [data-page="account"] .account-input { color: #111827; }
                [data-page="account"] .account-input-border { border-color: #e5e7eb; }
                [data-page="account"] .account-save-btn {
                    background: #6b93c0;
                    color: white;
                }
                [data-page="account"] .account-save-btn:hover {
                    background: #5a7fa8;
                }
                [data-page="account"] .account-divider {
                    border-color: rgba(0,0,0,0.1);
                }
                [data-page="account"] .account-avatar-ring { border-color: #e5e7eb; }

                /* Dark mode: softer dark gray so it doesn’t feel pure black */
                :global([data-theme="dark"]) [data-page="account"] {
                    background: #2d2d30;
                    color: var(--editor-text);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-grid {
                    background-image: linear-gradient(to right, var(--editor-grid) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--editor-grid) 1px, transparent 1px);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-header {
                    background: var(--editor-surface);
                    border-bottom: 1px solid var(--editor-border);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-header h1,
                :global([data-theme="dark"]) [data-page="account"] .account-header p {
                    color: var(--editor-text);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-header a:not(.account-editor-btn) {
                    color: var(--editor-text-secondary);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-header a:not(.account-editor-btn):hover {
                    color: var(--editor-text);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-header .account-editor-btn {
                    color: #1f2937;
                    background: white;
                }
                :global([data-theme="dark"]) [data-page="account"] .account-header .account-editor-btn:hover {
                    background: #f3f4f6;
                }
                :global([data-theme="dark"]) [data-page="account"] .account-card {
                    background: #38383b;
                    border: 1px solid var(--editor-border);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-card-overlay {
                    background: var(--editor-accent);
                    opacity: 0.08;
                }
                :global([data-theme="dark"]) [data-page="account"] .account-title {
                    color: var(--editor-text);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-label,
                :global([data-theme="dark"]) [data-page="account"] .account-danger-title + .account-label {
                    color: var(--editor-text-secondary);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-input {
                    color: var(--editor-text);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-input-border {
                    border-color: var(--editor-border);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-input::placeholder {
                    color: var(--editor-text-muted);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-save-btn {
                    background: var(--editor-accent);
                    color: white;
                }
                :global([data-theme="dark"]) [data-page="account"] .account-save-btn:hover {
                    background: var(--editor-accent-hover);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-divider {
                    border-color: var(--editor-border);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-avatar-ring {
                    border-color: var(--editor-border);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-error {
                    color: var(--editor-error);
                }
                :global([data-theme="dark"]) [data-page="account"] .account-success {
                    color: var(--editor-success);
                }
            `}</style>
        </div>
    );
}