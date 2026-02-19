(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/devinche-client/src/components/ProtectedRoute.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProtectedRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function ProtectedRoute({ children, redirectTo = '/login', appendReturnUrl = true }) {
    _s();
    const { isAuthenticated, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProtectedRoute.useEffect": ()=>{
            if (loading) return;
            if (!isAuthenticated) {
                const url = appendReturnUrl && pathname ? `${redirectTo}?returnUrl=${encodeURIComponent(pathname)}` : redirectTo;
                router.replace(url);
            }
        }
    }["ProtectedRoute.useEffect"], [
        loading,
        isAuthenticated,
        router,
        redirectTo,
        pathname,
        appendReturnUrl
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-[var(--editor-bg,#e8eaed)]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-[var(--editor-text,#111)]",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/devinche-client/src/components/ProtectedRoute.tsx",
                lineNumber: 41,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/devinche-client/src/components/ProtectedRoute.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this);
    }
    if (!isAuthenticated) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(ProtectedRoute, "cG2CF7IKDMIpCZbSGG48hYEdX20=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ProtectedRoute;
var _c;
__turbopack_context__.k.register(_c, "ProtectedRoute");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/devinche-client/src/components/ThemeToggleButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThemeToggleButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/src/contexts/ThemeContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function ThemeToggleButton({ className }) {
    _s();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: toggleTheme,
        title: theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
        "aria-label": theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
        style: {
            background: 'white',
            color: '#1f2937',
            borderColor: '#e5e7eb'
        },
        "data-theme-aware": true,
        className: "jsx-6bbbb852493b489" + " " + `inline-flex items-center px-2.5 py-2 rounded-full border transition-colors ${className || ''}`,
        children: [
            theme === 'dark' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                size: 18
            }, void 0, false, {
                fileName: "[project]/devinche-client/src/components/ThemeToggleButton.tsx",
                lineNumber: 27,
                columnNumber: 27
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                size: 18
            }, void 0, false, {
                fileName: "[project]/devinche-client/src/components/ThemeToggleButton.tsx",
                lineNumber: 27,
                columnNumber: 47
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "6bbbb852493b489",
                children: "[data-theme=dark] [data-theme-aware].jsx-6bbbb852493b489{background:var(--editor-surface);color:var(--editor-text);border-color:var(--editor-border)}[data-theme=dark] [data-theme-aware].jsx-6bbbb852493b489:hover{background:var(--editor-surface-hover)}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/devinche-client/src/components/ThemeToggleButton.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_s(ThemeToggleButton, "Q4eAjrIZ0CuRuhycs6byifK2KBk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeToggleButton;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggleButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/devinche-client/src/components/LanguageSwitcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LOCALE_OPTIONS",
    ()=>LOCALE_OPTIONS,
    "default",
    ()=>LanguageSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/src/contexts/LanguageContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const LOCALE_OPTIONS = [
    {
        value: 'en',
        label: 'English'
    },
    {
        value: 'de',
        label: 'Deutsch'
    },
    {
        value: 'uk',
        label: 'Українська'
    },
    {
        value: 'ru',
        label: 'Русский'
    },
    {
        value: 'ko',
        label: '한국어'
    },
    {
        value: 'ur',
        label: 'اردو'
    },
    {
        value: 'ar',
        label: 'العربية'
    },
    {
        value: 'ja',
        label: '日本語'
    },
    {
        value: 'zh',
        label: '中文'
    },
    {
        value: 'fr',
        label: 'Français'
    },
    {
        value: 'tr',
        label: 'Türkçe'
    },
    {
        value: 'sq',
        label: 'Shqip'
    }
];
function LanguageSwitcher({ className = '', variant = 'default' }) {
    _s();
    const { locale, setLocale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isDark = variant === 'darkHeader';
    const currentLabel = LOCALE_OPTIONS.find((o)=>o.value === locale)?.label ?? locale;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LanguageSwitcher.useEffect": ()=>{
            const onDocClick = {
                "LanguageSwitcher.useEffect.onDocClick": (e)=>{
                    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
                }
            }["LanguageSwitcher.useEffect.onDocClick"];
            const onKey = {
                "LanguageSwitcher.useEffect.onKey": (e)=>{
                    if (e.key === 'Escape') setOpen(false);
                }
            }["LanguageSwitcher.useEffect.onKey"];
            document.addEventListener('mousedown', onDocClick, true);
            document.addEventListener('keydown', onKey, true);
            return ({
                "LanguageSwitcher.useEffect": ()=>{
                    document.removeEventListener('mousedown', onDocClick, true);
                    document.removeEventListener('keydown', onKey, true);
                }
            })["LanguageSwitcher.useEffect"];
        }
    }["LanguageSwitcher.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `relative ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen((v)=>!v),
                className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                style: {
                    borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'var(--editor-bar-border)',
                    backgroundColor: open ? isDark ? 'rgba(255,255,255,0.2)' : 'var(--editor-surface-hover)' : 'transparent',
                    color: isDark ? '#fff' : 'var(--editor-text-secondary)'
                },
                "aria-haspopup": "listbox",
                "aria-expanded": open,
                "aria-label": "Select language",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                        size: 14,
                        className: "flex-shrink-0 opacity-80"
                    }, void 0, false, {
                        fileName: "[project]/devinche-client/src/components/LanguageSwitcher.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "max-w-[100px] truncate",
                        children: currentLabel
                    }, void 0, false, {
                        fileName: "[project]/devinche-client/src/components/LanguageSwitcher.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        size: 12,
                        className: `flex-shrink-0 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`
                    }, void 0, false, {
                        fileName: "[project]/devinche-client/src/components/LanguageSwitcher.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/devinche-client/src/components/LanguageSwitcher.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                role: "listbox",
                className: "absolute right-0 top-full mt-1 min-w-[140px] rounded-lg border py-1 z-50 shadow-lg",
                style: {
                    backgroundColor: 'var(--editor-panel-bg)',
                    borderColor: 'var(--editor-border)',
                    boxShadow: '0 8px 16px var(--editor-shadow-lg)'
                },
                children: LOCALE_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        role: "option",
                        "aria-selected": locale === opt.value,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>{
                                setLocale(opt.value);
                                setOpen(false);
                            },
                            className: "w-full text-left px-3 py-2 text-sm hover:bg-[var(--editor-surface-hover)] transition-colors first:rounded-t-lg last:rounded-b-lg",
                            style: {
                                color: locale === opt.value ? 'var(--editor-accent)' : 'var(--editor-text)',
                                backgroundColor: locale === opt.value ? 'var(--editor-surface-hover)' : 'transparent'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: locale === opt.value ? 'font-medium' : '',
                                children: opt.label
                            }, void 0, false, {
                                fileName: "[project]/devinche-client/src/components/LanguageSwitcher.tsx",
                                lineNumber: 102,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/devinche-client/src/components/LanguageSwitcher.tsx",
                            lineNumber: 90,
                            columnNumber: 15
                        }, this)
                    }, opt.value, false, {
                        fileName: "[project]/devinche-client/src/components/LanguageSwitcher.tsx",
                        lineNumber: 89,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/devinche-client/src/components/LanguageSwitcher.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/devinche-client/src/components/LanguageSwitcher.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s(LanguageSwitcher, "uDpIrS9it5YbCotQn5AWT2ygpA8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"]
    ];
});
_c = LanguageSwitcher;
var _c;
__turbopack_context__.k.register(_c, "LanguageSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/validation-rules/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ValidationRulesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$components$2f$ProtectedRoute$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/src/components/ProtectedRoute.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$components$2f$ThemeToggleButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/src/components/ThemeToggleButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/src/components/LanguageSwitcher.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function ValidationRulesPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$components$2f$ProtectedRoute$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-page": "validation-rules",
            className: "jsx-c97f7e567aa5d3fb" + " " + "min-h-screen bg-[#e8eaed] relative overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
          `,
                        backgroundSize: "4cm 4cm"
                    },
                    className: "jsx-c97f7e567aa5d3fb" + " " + "absolute inset-0 pointer-events-none"
                }, void 0, false, {
                    fileName: "[project]/src/app/validation-rules/page.tsx",
                    lineNumber: 13,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "jsx-c97f7e567aa5d3fb" + " " + "bg-[#4a5568] py-5 px-8 flex justify-between items-center relative z-20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/editor",
                            className: "w-12 h-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/devince_log.svg",
                                alt: "Devinche Logo",
                                width: 48,
                                height: 48,
                                className: "w-full h-full"
                            }, void 0, false, {
                                fileName: "[project]/src/app/validation-rules/page.tsx",
                                lineNumber: 26,
                                columnNumber: 21
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/validation-rules/page.tsx",
                            lineNumber: 25,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-c97f7e567aa5d3fb" + " " + "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$components$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    variant: "darkHeader"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/validation-rules/page.tsx",
                                    lineNumber: 35,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$components$2f$ThemeToggleButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/src/app/validation-rules/page.tsx",
                                    lineNumber: 36,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/editor",
                                    className: "bg-white text-gray-800 px-8 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm",
                                    children: "Back to Editor"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/validation-rules/page.tsx",
                                    lineNumber: 37,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/validation-rules/page.tsx",
                            lineNumber: 34,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/validation-rules/page.tsx",
                    lineNumber: 24,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "jsx-c97f7e567aa5d3fb" + " " + "relative h-[calc(100vh-100px)] flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-c97f7e567aa5d3fb" + " " + "relative z-10 text-center px-4 max-w-3xl -mt-80",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-c97f7e567aa5d3fb" + " " + "text-left mt-10 p-6 bg-white/80 rounded-lg border border-gray-200 shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "jsx-c97f7e567aa5d3fb" + " " + "text-5xl font-bold text-gray-900 mb-6 leading-tight",
                                    children: "The rules of WAM"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/validation-rules/page.tsx",
                                    lineNumber: 49,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                    className: "jsx-c97f7e567aa5d3fb" + " " + "text-xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "jsx-c97f7e567aa5d3fb" + " " + "text-left mb-2",
                                            children: "1. Trust relationships can only exists between two security realms"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/validation-rules/page.tsx",
                                            lineNumber: 55,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "jsx-c97f7e567aa5d3fb" + " " + "text-left mb-2",
                                            children: [
                                                "2. Invocation relationships can only exist in the following forms:",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "jsx-c97f7e567aa5d3fb" + " " + "list-disc list-inside ml-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "jsx-c97f7e567aa5d3fb" + " " + "text-left mb-1",
                                                            children: "From application node to service node"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/validation-rules/page.tsx",
                                                            lineNumber: 63,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "jsx-c97f7e567aa5d3fb" + " " + "text-left mb-1",
                                                            children: "From service node to service node"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/validation-rules/page.tsx",
                                                            lineNumber: 66,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/validation-rules/page.tsx",
                                                    lineNumber: 62,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/validation-rules/page.tsx",
                                            lineNumber: 59,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "jsx-c97f7e567aa5d3fb" + " " + "text-left mb-2",
                                            children: "3. Legacy relationships can only exist in the following forms:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/validation-rules/page.tsx",
                                            lineNumber: 71,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "jsx-c97f7e567aa5d3fb" + " " + "list-disc list-inside ml-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "jsx-c97f7e567aa5d3fb" + " " + "text-left mb-1",
                                                    children: "From application node to data unit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/validation-rules/page.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "jsx-c97f7e567aa5d3fb" + " " + "text-left mb-1",
                                                    children: "From application node to processing unit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/validation-rules/page.tsx",
                                                    lineNumber: 78,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "jsx-c97f7e567aa5d3fb" + " " + "text-left mb-1",
                                                    children: "From service node to data unit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/validation-rules/page.tsx",
                                                    lineNumber: 81,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "jsx-c97f7e567aa5d3fb" + " " + "text-left mb-1",
                                                    children: "From service node to processing unit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/validation-rules/page.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/validation-rules/page.tsx",
                                            lineNumber: 74,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "jsx-c97f7e567aa5d3fb" + " " + "text-left mb-2",
                                            children: "4. Security realms must contain another node"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/validation-rules/page.tsx",
                                            lineNumber: 88,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "jsx-c97f7e567aa5d3fb" + " " + "text-left mb-2",
                                            children: "5. Identity providors cannot have any relationships"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/validation-rules/page.tsx",
                                            lineNumber: 91,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/validation-rules/page.tsx",
                                    lineNumber: 54,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/validation-rules/page.tsx",
                            lineNumber: 48,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/validation-rules/page.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/validation-rules/page.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    id: "c97f7e567aa5d3fb",
                    children: "[data-theme=dark] [data-page=validation-rules].jsx-c97f7e567aa5d3fb{background:var(--editor-bg);color:var(--editor-text)}[data-theme=dark] [data-page=validation-rules].jsx-c97f7e567aa5d3fb header.jsx-c97f7e567aa5d3fb{background:var(--editor-surface);border-bottom:1px solid var(--editor-border)}[data-theme=dark] [data-page=validation-rules].jsx-c97f7e567aa5d3fb h1.jsx-c97f7e567aa5d3fb,[data-theme=dark] [data-page=validation-rules].jsx-c97f7e567aa5d3fb h2.jsx-c97f7e567aa5d3fb{color:var(--editor-text)}[data-theme=dark] [data-page=validation-rules].jsx-c97f7e567aa5d3fb p.jsx-c97f7e567aa5d3fb,[data-theme=dark] [data-page=validation-rules].jsx-c97f7e567aa5d3fb li.jsx-c97f7e567aa5d3fb,[data-theme=dark] [data-page=validation-rules].jsx-c97f7e567aa5d3fb .text-gray-700.jsx-c97f7e567aa5d3fb,[data-theme=dark] [data-page=validation-rules].jsx-c97f7e567aa5d3fb .text-gray-600.jsx-c97f7e567aa5d3fb{color:var(--editor-text-secondary)}[data-theme=dark] [data-page=validation-rules].jsx-c97f7e567aa5d3fb .text-gray-900.jsx-c97f7e567aa5d3fb{color:var(--editor-text)}[data-theme=dark] [data-page=validation-rules].jsx-c97f7e567aa5d3fb [data-validation-card].jsx-c97f7e567aa5d3fb{background:var(--editor-surface)!important;border-color:var(--editor-border)!important}[data-theme=dark] [data-page=validation-rules].jsx-c97f7e567aa5d3fb{background-image:linear-gradient(to right,var(--editor-grid)1px,transparent 1px),linear-gradient(to bottom,var(--editor-grid)1px,transparent 1px)!important}"
                }, void 0, false, void 0, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/validation-rules/page.tsx",
            lineNumber: 12,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/validation-rules/page.tsx",
        lineNumber: 11,
        columnNumber: 9
    }, this);
}
_c = ValidationRulesPage;
var _c;
__turbopack_context__.k.register(_c, "ValidationRulesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__6ba85599._.js.map