"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ApiUser } from "@/features/auth-feature/api";
import { User, LogIn, UserPlus, Settings, LogOut } from "lucide-react";
import Image from "next/image";

function getInitials(user: ApiUser): string {
  const first = (user.firstName || "").trim();
  const last = (user.lastName || "").trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  if (user.email) return user.email.slice(0, 2).toUpperCase();
  return "?";
}

export default function UserAvatarMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDocClick, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-[1.5px] border-gray-200 hover:border-gray-300 transition-all bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer shadow-sm"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {isAuthenticated && user ? (
          user.pictureUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={user.pictureUrl}
                alt="User profile"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <span className="text-sm font-bold select-none antialiased">
              {getInitials(user)}
            </span>
          )
        ) : (
          <User size={20} strokeWidth={2.5} className="text-gray-500" />
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-xl z-50 overflow-hidden py-1"
          style={{
            backgroundColor: "var(--editor-panel-bg)",
            borderColor: "var(--editor-border)",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          }}
          role="menu"
        >
          {isAuthenticated && user ? (
            <>
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: "var(--editor-border)" }}
              >
                <p
                  className="text-sm font-bold truncate"
                  style={{ color: "var(--editor-text)" }}
                >
                  {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
                    user.email}
                </p>
                <p
                  className="text-xs truncate opacity-70"
                  style={{ color: "var(--editor-text)" }}
                >
                  {user.email}
                </p>
              </div>

              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-[var(--editor-surface-hover)] transition-colors"
                style={{ color: "var(--editor-text)" }}
              >
                <Settings size={16} strokeWidth={2} />
                {t("auth.settings")}
              </Link>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-[var(--editor-surface-hover)] transition-colors text-red-500"
              >
                <LogOut size={16} strokeWidth={2} />
                {t("auth.signOut")}
              </button>
            </>
          ) : (
            <>
              <div
                className="px-4 py-3 border-b mb-1"
                style={{ borderColor: "var(--editor-border)" }}
              >
                <p
                  className="text-[10px] font-black uppercase tracking-widest opacity-50"
                  style={{ color: "var(--editor-text)" }}
                >
                  WELCOME
                </p>
              </div>

              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-[var(--editor-surface-hover)] transition-colors"
                style={{ color: "var(--editor-text)" }}
              >
                <LogIn size={16} strokeWidth={2} />
                {t("home.signIn")}
              </Link>

              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-[var(--editor-surface-hover)] transition-colors"
                style={{ color: "var(--editor-text)" }}
              >
                <UserPlus size={16} strokeWidth={2} />
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
