(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/devinche-client/src/contexts/ThemeContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const defaultTheme = 'dark';
function ThemeProvider({ children }) {
    _s();
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultTheme);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            const saved = localStorage.getItem('theme');
            if (saved) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setThemeState(saved);
            }
            document.documentElement.setAttribute('data-theme', saved || defaultTheme);
        }
    }["ThemeProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            const root = document.documentElement;
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
    }["ThemeProvider.useEffect"], [
        theme
    ]);
    const toggleTheme = ()=>{
        setThemeState((prev)=>prev === 'light' ? 'dark' : 'light');
    };
    const setTheme = (newTheme)=>{
        setThemeState(newTheme);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme,
            toggleTheme,
            setTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/devinche-client/src/contexts/ThemeContext.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(ThemeProvider, "k6dzeur0VfpYXzUmlPfFPYm3/qk=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/devinche-client/src/features/auth-feature/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteAccount",
    ()=>deleteAccount,
    "getApiBase",
    ()=>getApiBase,
    "getMe",
    ()=>getMe,
    "login",
    ()=>login,
    "logout",
    ()=>logout,
    "register",
    ()=>register,
    "resetPassword",
    ()=>resetPassword,
    "updateUser",
    ()=>updateUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * Auth API – all requests use the same API base (backend).
 * Use NEXT_PUBLIC_API_BASE_URL (e.g. http://localhost:4000) or leave empty for same-origin.
 */ const getApiBase = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return (("TURBOPACK compile-time value", "http://localhost:4000") || __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');
};
async function login(email, password) {
    const base = getApiBase();
    const res = await fetch(`${base}/api/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) {
        throw new Error(data.error || 'Login failed');
    }
    return data;
}
async function register(payload) {
    const base = getApiBase();
    const res = await fetch(`${base}/api/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
    }
    return data;
}
async function getMe(token) {
    const base = getApiBase();
    const res = await fetch(`${base}/api/users/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) {
        throw new Error(data.error || 'Session invalid');
    }
    return data;
}
async function logout(token) {
    const base = getApiBase();
    try {
        await fetch(`${base}/api/users/logout`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch  {
    // Ignore network errors on logout
    }
}
;
async function resetPassword(email, newPassword) {
    const base = getApiBase();
    const res = await fetch(`${base}/api/users/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            newPassword
        })
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) {
        throw new Error(data.error || 'Reset password failed');
    }
    return data;
}
async function updateUser(token, payload) {
    const base = getApiBase();
    const res = await fetch(`${base}/api/users/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) {
        throw new Error(data.error || 'Update failed');
    }
    return data;
}
async function deleteAccount(token) {
    const base = getApiBase();
    const res = await fetch(`${base}/api/users/delete`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const data = await res.json().catch(()=>({}));
        throw new Error(data.error || 'Delete failed');
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/devinche-client/src/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$features$2f$auth$2d$feature$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/src/features/auth-feature/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AUTH_TOKEN_KEY = 'authToken';
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function readStoredToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch  {
        return null;
    }
}
function writeToken(token) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
        else localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch  {
    // ignore
    }
}
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const setSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[setSession]": (newToken, newUser)=>{
            writeToken(newToken);
            setToken(newToken);
            if (newUser) setUser(newUser);
        }
    }["AuthProvider.useCallback[setSession]"], []);
    const refreshUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[refreshUser]": async ()=>{
            const t = readStoredToken();
            if (!t) {
                setUser(null);
                setToken(null);
                setLoading(false);
                return;
            }
            try {
                const u = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$features$2f$auth$2d$feature$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMe"])(t);
                setToken(t);
                setUser(u);
            } catch  {
                writeToken(null);
                setToken(null);
                setUser(null);
            } finally{
                setLoading(false);
            }
        }
    }["AuthProvider.useCallback[refreshUser]"], []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async ()=>{
            const t = token ?? readStoredToken();
            if (t) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$features$2f$auth$2d$feature$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logout"])(t);
            writeToken(null);
            setToken(null);
            setUser(null);
        }
    }["AuthProvider.useCallback[logout]"], [
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const t = readStoredToken();
            if (!t) {
                setToken(null);
                setUser(null);
                setLoading(false);
                return;
            }
            setToken(t);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$features$2f$auth$2d$feature$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMe"])(t).then({
                "AuthProvider.useEffect": (u)=>{
                    setUser(u);
                }
            }["AuthProvider.useEffect"]).catch({
                "AuthProvider.useEffect": ()=>{
                    writeToken(null);
                    setToken(null);
                    setUser(null);
                }
            }["AuthProvider.useEffect"]).finally({
                "AuthProvider.useEffect": ()=>{
                    setLoading(false);
                }
            }["AuthProvider.useEffect"]);
        }
    }["AuthProvider.useEffect"], []);
    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        setSession,
        logout,
        getToken: ()=>token ?? readStoredToken(),
        refreshUser
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/devinche-client/src/contexts/AuthContext.tsx",
        lineNumber: 121,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "4dytuKFECXLLk7vcpycVVYruv/A=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (ctx === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}
_s1(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/devinche-client/src/locales/en.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"close":"Close","save":"Save","cancel":"Cancel","loading":"Loading…","error":"Error","success":"Success","back":"Back","delete":"Delete","send":"Send","sending":"Sending…"},"home":{"signIn":"Sign In","createDiagram":"Create Diagram","myDiagrams":"My Diagrams","letsGo":"Let's go","headline":"Difficult diagrams are easier\nwith the Devinche's editor.","subheadline":"Space, where people work together to achieve\nthe highest results."},"auth":{"signIn":"Sign In","signUp":"Sign Up","signOut":"Log out","email":"Email","password":"Password","confirmPassword":"Confirm password","firstName":"First name","lastName":"Last name","settings":"Settings","userMenu":"User menu"},"toolbar":{"diagrams":"Diagrams","viewOnly":"View only","untitledDiagram":"Untitled Diagram","saving":"Saving…","saved":"Saved","saveFailed":"Save failed","file":"File","edit":"Edit","view":"View","diagram":"Diagram","share":"Share","shareDiagram":"Share diagram","comments":"Comments","viewing":"Viewing","you":"You","saveMenuItem":"Save","saveAs":"Save As…","importJson":"Import JSON","exportJson":"Export JSON","exportPng":"Export PNG","exportRdf":"Export RDF","exportXml":"Export XML","undo":"Undo","redo":"Redo","zoomIn":"Zoom In","zoomOut":"Zoom Out","fitView":"Fit View","validate":"Validate","costBreakdown":"Cost breakdown","shareAndComments":"Share and comments","newDiagramName":"New diagram name"},"comments":{"title":"Comments","loading":"Loading comments…","commentCount":"{count} comment","commentCount_other":"{count} comments","noCommentsYet":"No comments yet.","noCommentsHint":"Add one below or click on the diagram to attach a comment.","addComment":"Add a comment… Use @ to mention others","comment":"Comment","attachingTo":"Attaching to {type}","canvas":"canvas","resolve":"Resolve","reopen":"Reopen","delete":"Delete","mentionedUsers":"Mentioned {count} user","mentionedUsers_other":"Mentioned {count} users","closePanel":"Close panel","deleteCommentConfirm":"Delete this comment?","failedToUpdate":"Failed to update","failedToDelete":"Failed to delete"},"shareDialog":{"title":"Share diagram","subtitle":"Invite people by email to view or edit","addPeople":"Add people","emailPlaceholder":"email@example.com","canView":"Can view","canEdit":"Can edit","owner":"Owner","theyNeedAccount":"They need an account. Access is by email.","add":"Add","adding":"Adding…","peopleWithAccess":"People with access","total":"{count} total","loading":"Loading…","noOneElse":"No one else has access yet.","addPeopleAbove":"Add people above to share this diagram.","transferOwner":"Transfer owner","removeAccess":"Remove access","closeAria":"Close","failedToLoad":"Failed to load","failedToShare":"Failed to share","failedToRemoveAccess":"Failed to remove access","failedToUpdateAccess":"Failed to update access","failedToTransferOwnership":"Failed to transfer ownership","transferConfirm":"Make {email} the new owner? You will become an editor."},"validation":{"noErrors":"No Validation Errors","noErrorsDetail":"All WAM rules are satisfied, including trust between realms, invocation, legacy, and realm containment.","validationErrors":"Validation Errors","learnMore":"Learn more about validation rules"},"settings":{"accountSettings":"Account Settings","myDiagrams":"My Diagrams","profile":"Profile","profileUpdated":"Profile updated","updateProfile":"Update profile","failedToUpdate":"Failed to update profile","deleteAccount":"Delete account","deleteAccountConfirm":"Are you sure you want to delete your account? This action cannot be undone.","photo":"Photo","changePhoto":"Change photo","removePhoto":"Remove photo","firstNameLabel":"First Name","lastNameLabel":"Last Name","emailAddressLabel":"Email Address","newPasswordLabel":"New Password","leaveBlankToKeep":"Leave blank to keep current","saveChanges":"Save Changes","updating":"Updating…","dangerZone":"Danger Zone","dangerZoneWarning":"Once you delete your account, there is no going back. Please be certain.","photoSelectedHint":"Photo selected. Click \"Save Changes\" to update.","backToEditor":"Editor"},"editor":{"myDiagrams":"My Diagrams","newDiagram":"New diagram","noDiagrams":"No diagrams yet.","createFirst":"Create your first diagram to get started.","deleteConfirm":"Delete this diagram?","creating":"Creating…","yourDiagrams":"Your diagrams","yourDiagramsSubtitle":"Create, edit, or manage your own diagrams","edited":"Edited","owner":"Owner","editor":"Editor","viewer":"Viewer","open":"Open","rename":"Rename","delete":"Delete","sharedWithMe":"Shared with me","sharedWithMeSubtitle":"Diagrams shared with you by other people","diagramActions":"Diagram actions"},"login":{"title":"Sign in","emailPlaceholder":"Email","passwordPlaceholder":"Password","submit":"Sign In","successRedirecting":"Success! Redirecting…","success":"Success!","redirecting":"Redirecting…","loggingIn":"Logging in…","orLoginWith":"Or log in with:","forgotPassword":"Forgot password?","loginWithGoogle":"Login with Google","home":"Home","errorOccurred":"An error occurred. Please try again.","googleCodeMissing":"Google authorization code missing","googleLoginFailed":"Google login failed","failedGoogleLogin":"Failed to login with Google","googleNotInitialized":"Google client not initialized","googleNotReady":"Google code client not ready","failedInitGoogle":"Failed to initialize Google login","dontHaveAccount":"Don't you have an account?"},"contextMenu":{"canvas":"Canvas","diagram":"Diagram","node":"Node","edge":"Edge","element":"Element","details":"Details","actions":"Actions","addCommentHere":"Add comment here","resetCanvas":"Reset canvas","selectAll":"Select all","properties":"Properties","duplicateNode":"Duplicate node","deleteNode":"Delete node","deleteEdge":"Delete edge","id":"ID","size":"Size","source":"Source","target":"Target"},"diagram":{"trust":"Trust","trustEdge":"Trust Edge","invocationEdge":"Invocation Edge","legacyEdge":"Legacy Edge"}});}),
"[project]/devinche-client/src/locales/de.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"close":"Schließen","save":"Speichern","cancel":"Abbrechen","loading":"Laden…","error":"Fehler","success":"Erfolg","back":"Zurück","delete":"Löschen","send":"Senden","sending":"Wird gesendet…"},"home":{"signIn":"Anmelden","createDiagram":"Diagramm erstellen","myDiagrams":"Meine Diagramme","letsGo":"Los geht's","headline":"Schwierige Diagramme sind\nmit dem Devinche-Editor einfacher.","subheadline":"Ein Ort, an dem Menschen zusammenarbeiten,\num die besten Ergebnisse zu erzielen."},"auth":{"signIn":"Anmelden","signUp":"Registrieren","signOut":"Abmelden","email":"E-Mail","password":"Passwort","confirmPassword":"Passwort bestätigen","firstName":"Vorname","lastName":"Nachname","settings":"Einstellungen","userMenu":"Benutzermenü"},"toolbar":{"diagrams":"Diagramme","viewOnly":"Nur Ansicht","untitledDiagram":"Unbenanntes Diagramm","saving":"Wird gespeichert…","saved":"Gespeichert","saveFailed":"Speichern fehlgeschlagen","file":"Datei","edit":"Bearbeiten","view":"Ansicht","diagram":"Diagramm","share":"Teilen","shareDiagram":"Diagramm teilen","comments":"Kommentare","viewing":"Betrachter","you":"Sie","saveMenuItem":"Speichern","saveAs":"Speichern unter…","importJson":"JSON importieren","exportJson":"JSON exportieren","exportPng":"PNG exportieren","exportRdf":"RDF exportieren","exportXml":"XML exportieren","undo":"Rückgängig","redo":"Wiederholen","zoomIn":"Vergrößern","zoomOut":"Verkleinern","fitView":"Anpassen","validate":"Validieren","costBreakdown":"Kostenaufstellung","shareAndComments":"Teilen und Kommentare","newDiagramName":"Neuer Diagrammname"},"comments":{"title":"Kommentare","loading":"Kommentare werden geladen…","commentCount":"{count} Kommentar","commentCount_other":"{count} Kommentare","noCommentsYet":"Noch keine Kommentare.","noCommentsHint":"Einen unten hinzufügen oder auf das Diagramm klicken, um einen Kommentar zu verknüpfen.","addComment":"Kommentar hinzufügen… Mit @ andere erwähnen","comment":"Kommentar","attachingTo":"Verknüpfen mit {type}","canvas":"Leinwand","resolve":"Erledigen","reopen":"Wieder öffnen","delete":"Löschen","mentionedUsers":"{count} Benutzer erwähnt","mentionedUsers_other":"{count} Benutzer erwähnt","closePanel":"Panel schließen","deleteCommentConfirm":"Diesen Kommentar löschen?","failedToUpdate":"Aktualisierung fehlgeschlagen","failedToDelete":"Löschen fehlgeschlagen"},"shareDialog":{"title":"Diagramm teilen","subtitle":"Personen per E-Mail zum Ansehen oder Bearbeiten einladen","addPeople":"Personen hinzufügen","emailPlaceholder":"email@beispiel.de","canView":"Kann ansehen","canEdit":"Kann bearbeiten","owner":"Eigentümer","theyNeedAccount":"Sie benötigen ein Konto. Zugriff per E-Mail.","add":"Hinzufügen","adding":"Wird hinzugefügt…","peopleWithAccess":"Personen mit Zugriff","total":"{count} insgesamt","loading":"Laden…","noOneElse":"Noch hat niemand sonst Zugriff.","addPeopleAbove":"Fügen Sie oben Personen hinzu, um dieses Diagramm zu teilen.","transferOwner":"Eigentum übertragen","removeAccess":"Zugriff entfernen","closeAria":"Schließen","failedToLoad":"Laden fehlgeschlagen","failedToShare":"Teilen fehlgeschlagen","failedToRemoveAccess":"Zugriff entfernen fehlgeschlagen","failedToUpdateAccess":"Zugriff aktualisieren fehlgeschlagen","failedToTransferOwnership":"Eigentumsübertragung fehlgeschlagen","transferConfirm":"{email} zum neuen Eigentümer machen? Sie werden Bearbeiter."},"validation":{"noErrors":"Keine Validierungsfehler","noErrorsDetail":"Alle WAM-Regeln sind erfüllt, inkl. Vertrauen zwischen Realms, Aufruf, Legacy und Realm-Enthaltensein.","validationErrors":"Validierungsfehler","learnMore":"Mehr zu Validierungsregeln"},"settings":{"accountSettings":"Kontoeinstellungen","myDiagrams":"Meine Diagramme","profile":"Profil","profileUpdated":"Profil aktualisiert","updateProfile":"Profil aktualisieren","failedToUpdate":"Profil konnte nicht aktualisiert werden","deleteAccount":"Konto löschen","deleteAccountConfirm":"Möchten Sie Ihr Konto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.","photo":"Foto","changePhoto":"Foto ändern","removePhoto":"Foto entfernen","firstNameLabel":"Vorname","lastNameLabel":"Nachname","emailAddressLabel":"E-Mail-Adresse","newPasswordLabel":"Neues Passwort","leaveBlankToKeep":"Leer lassen, um das aktuelle beizubehalten","saveChanges":"Änderungen speichern","updating":"Wird aktualisiert…","dangerZone":"Gefahrenzone","dangerZoneWarning":"Wenn Sie Ihr Konto löschen, gibt es kein Zurück. Bitte seien Sie sich sicher.","photoSelectedHint":"Foto ausgewählt. Klicken Sie auf \"Änderungen speichern\", um zu aktualisieren.","backToEditor":"Editor"},"editor":{"myDiagrams":"Meine Diagramme","newDiagram":"Neues Diagramm","noDiagrams":"Noch keine Diagramme.","createFirst":"Erstellen Sie Ihr erstes Diagramm.","deleteConfirm":"Dieses Diagramm löschen?","creating":"Wird erstellt…","yourDiagrams":"Ihre Diagramme","yourDiagramsSubtitle":"Erstellen, bearbeiten oder verwalten Sie Ihre Diagramme","edited":"Bearbeitet","owner":"Besitzer","editor":"Bearbeiter","viewer":"Betrachter","open":"Öffnen","rename":"Umbenennen","delete":"Löschen","sharedWithMe":"Mit mir geteilt","sharedWithMeSubtitle":"Diagramme, die andere mit Ihnen geteilt haben","diagramActions":"Diagramm-Aktionen"},"login":{"title":"Anmelden","emailPlaceholder":"E-Mail","passwordPlaceholder":"Passwort","submit":"Anmelden","successRedirecting":"Erfolg! Weiterleitung…","success":"Erfolg!","redirecting":"Weiterleitung…","loggingIn":"Anmeldung läuft…","orLoginWith":"Oder anmelden mit:","forgotPassword":"Passwort vergessen?","loginWithGoogle":"Mit Google anmelden","home":"Startseite","errorOccurred":"Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.","googleCodeMissing":"Google-Autorisierungscode fehlt","googleLoginFailed":"Google-Anmeldung fehlgeschlagen","failedGoogleLogin":"Anmeldung mit Google fehlgeschlagen","googleNotInitialized":"Google-Client nicht initialisiert","googleNotReady":"Google-Code-Client nicht bereit","failedInitGoogle":"Google-Anmeldung konnte nicht initialisiert werden","dontHaveAccount":"Noch kein Konto?"},"contextMenu":{"canvas":"Leinwand","diagram":"Diagramm","node":"Knoten","edge":"Kante","element":"Element","details":"Details","actions":"Aktionen","addCommentHere":"Hier Kommentar hinzufügen","resetCanvas":"Leinwand zurücksetzen","selectAll":"Alles auswählen","properties":"Eigenschaften","duplicateNode":"Knoten duplizieren","deleteNode":"Knoten löschen","deleteEdge":"Kante löschen","id":"ID","size":"Größe","source":"Quelle","target":"Ziel"},"diagram":{"trust":"Vertrauen","trustEdge":"Vertrauens-Kante","invocationEdge":"Aufruf-Kante","legacyEdge":"Legacy-Kante"}});}),
"[project]/devinche-client/src/locales/uk.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"close":"Закрити","save":"Зберегти","cancel":"Скасувати","loading":"Завантаження…","error":"Помилка","success":"Успіх","back":"Назад","delete":"Видалити","send":"Надіслати","sending":"Надсилається…"},"home":{"signIn":"Увійти","createDiagram":"Створити діаграму","myDiagrams":"Мої діаграми","letsGo":"Поїхали","headline":"Складні діаграми простіші з редактором Devinche.","subheadline":"Простір, де люди разом досягають найкращих результатів."},"auth":{"signIn":"Увійти","signUp":"Реєстрація","signOut":"Вийти","email":"Email","password":"Пароль","confirmPassword":"Підтвердіть пароль","firstName":"Ім'я","lastName":"Прізвище","settings":"Налаштування","userMenu":"Меню користувача"},"toolbar":{"diagrams":"Діаграми","viewOnly":"Тільки перегляд","untitledDiagram":"Без назви","saving":"Збереження…","saved":"Збережено","saveFailed":"Помилка збереження","file":"Файл","edit":"Редагувати","view":"Вид","diagram":"Діаграма","share":"Поділитися","shareDiagram":"Поділитися діаграмою","comments":"Коментарі","viewing":"Переглядачі","you":"Ви","saveMenuItem":"Зберегти","saveAs":"Зберегти як…","importJson":"Імпорт JSON","exportJson":"Експорт JSON","exportPng":"Експорт PNG","exportRdf":"Експорт RDF","exportXml":"Експорт XML","undo":"Скасувати","redo":"Повторити","zoomIn":"Збільшити","zoomOut":"Зменшити","fitView":"Вмістити","validate":"Перевірити","costBreakdown":"Кошторис","shareAndComments":"Поділитися та коментарі","newDiagramName":"Назва діаграми"},"comments":{"title":"Коментарі","loading":"Завантаження коментарів…","commentCount":"{count} коментар","commentCount_other":"{count} коментарів","noCommentsYet":"Коментарів ще немає.","noCommentsHint":"Додайте нижче або клікніть на діаграму, щоб прив’язати коментар.","addComment":"Додати коментар… Використовуйте @ для згадування","comment":"Коментар","attachingTo":"Прив’язка до {type}","canvas":"полотно","resolve":"Вирішити","reopen":"Відкрити знову","delete":"Видалити","mentionedUsers":"Згадано {count} користувача","mentionedUsers_other":"Згадано {count} користувачів","closePanel":"Закрити панель","deleteCommentConfirm":"Видалити цей коментар?","failedToUpdate":"Не вдалося оновити","failedToDelete":"Не вдалося видалити"},"shareDialog":{"title":"Поділитися діаграмою","subtitle":"Запросіть людей електронною поштою для перегляду або редагування","addPeople":"Додати людей","emailPlaceholder":"email@example.com","canView":"Може переглядати","canEdit":"Може редагувати","owner":"Власник","theyNeedAccount":"Потрібен обліковий запис. Доступ за email.","add":"Додати","adding":"Додавання…","peopleWithAccess":"Люди з доступом","total":"{count} всього","loading":"Завантаження…","noOneElse":"Ще ніхто не має доступу.","addPeopleAbove":"Додайте людей вище, щоб поділитися цією діаграмою.","transferOwner":"Передати власність","removeAccess":"Прибрати доступ","closeAria":"Закрити","failedToLoad":"Не вдалося завантажити","failedToShare":"Не вдалося поділитися","failedToRemoveAccess":"Не вдалося прибрати доступ","failedToUpdateAccess":"Не вдалося оновити доступ","failedToTransferOwnership":"Не вдалося передати власність","transferConfirm":"Зробити {email} новим власником? Ви станете редактором."},"validation":{"noErrors":"Помилок не знайдено","noErrorsDetail":"Усі правила WAM виконано, включно з довірою між realm, викликами та контейнерами.","validationErrors":"Помилки перевірки","learnMore":"Детальніше про правила перевірки"},"settings":{"accountSettings":"Налаштування облікового запису","myDiagrams":"Мої діаграми","profile":"Профіль","profileUpdated":"Профіль оновлено","updateProfile":"Оновити профіль","failedToUpdate":"Не вдалося оновити профіль","deleteAccount":"Видалити обліковий запис","deleteAccountConfirm":"Ви впевнені, що хочете видалити обліковий запис? Цю дію не можна скасувати.","photo":"Фото","changePhoto":"Змінити фото","removePhoto":"Видалити фото","firstNameLabel":"Ім'я","lastNameLabel":"Прізвище","emailAddressLabel":"Email","newPasswordLabel":"Новий пароль","leaveBlankToKeep":"Залиште порожнім, щоб залишити поточний","saveChanges":"Зберегти зміни","updating":"Оновлення…","dangerZone":"Небезпечна зона","dangerZoneWarning":"Після видалення облікового запису відновити його неможливо. Будьте впевнені.","photoSelectedHint":"Фото вибрано. Натисніть «Зберегти зміни» для оновлення."},"editor":{"myDiagrams":"Мої діаграми","newDiagram":"Нова діаграма","noDiagrams":"Діаграм ще немає.","createFirst":"Створіть першу діаграму.","deleteConfirm":"Видалити цю діаграму?","creating":"Створення…","yourDiagrams":"Ваші діаграми","yourDiagramsSubtitle":"Створюйте, редагуйте та керуйте діаграмами","edited":"Редаговано","owner":"Власник","editor":"Редактор","viewer":"Переглядач","open":"Відкрити","rename":"Перейменувати","delete":"Видалити","sharedWithMe":"Поділено зі мною","sharedWithMeSubtitle":"Діаграми, якими з вами поділилися","diagramActions":"Дії з діаграмою"},"login":{"title":"Увійти","emailPlaceholder":"Email","passwordPlaceholder":"Пароль","submit":"Увійти","successRedirecting":"Успіх! Перенаправлення…","success":"Успіх!","redirecting":"Перенаправлення…","loggingIn":"Вхід…","orLoginWith":"Або увійти через:","forgotPassword":"Забули пароль?","loginWithGoogle":"Увійти через Google","home":"Головна"},"contextMenu":{"canvas":"Полотно","diagram":"Діаграма","node":"Вузол","edge":"Ребро","element":"Елемент","details":"Деталі","actions":"Дії","addCommentHere":"Додати коментар тут","resetCanvas":"Скинути полотно","selectAll":"Вибрати все","properties":"Властивості","duplicateNode":"Дублювати вузол","deleteNode":"Видалити вузол","deleteEdge":"Видалити ребро","id":"ID","size":"Розмір","source":"Джерело","target":"Ціль"},"diagram":{"trust":"Довіра","trustEdge":"Ребро довіри","invocationEdge":"Ребро виклику","legacyEdge":"Ребро спадкоємності"}});}),
"[project]/devinche-client/src/locales/ru.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"close":"Закрыть","save":"Сохранить","cancel":"Отмена","loading":"Загрузка…","error":"Ошибка","success":"Успех","back":"Назад","delete":"Удалить","send":"Отправить","sending":"Отправка…"},"home":{"signIn":"Войти","createDiagram":"Создать диаграмму","myDiagrams":"Мои диаграммы","letsGo":"Поехали","headline":"Сложные диаграммы проще с редактором Devinche.","subheadline":"Пространство, где люди вместе достигают лучших результатов."},"auth":{"signIn":"Войти","signUp":"Регистрация","signOut":"Выйти","email":"Email","password":"Пароль","confirmPassword":"Подтвердите пароль","firstName":"Имя","lastName":"Фамилия","settings":"Настройки","userMenu":"Меню пользователя"},"toolbar":{"diagrams":"Диаграммы","viewOnly":"Только просмотр","untitledDiagram":"Без названия","saving":"Сохранение…","saved":"Сохранено","saveFailed":"Ошибка сохранения","file":"Файл","edit":"Правка","view":"Вид","diagram":"Диаграмма","share":"Поделиться","shareDiagram":"Поделиться диаграммой","comments":"Комментарии","viewing":"Наблюдатели","you":"Вы","saveMenuItem":"Сохранить","saveAs":"Сохранить как…","importJson":"Импорт JSON","exportJson":"Экспорт JSON","exportPng":"Экспорт PNG","exportRdf":"Экспорт RDF","exportXml":"Экспорт XML","undo":"Отменить","redo":"Повторить","zoomIn":"Увеличить","zoomOut":"Уменьшить","fitView":"Вместить","validate":"Проверить","costBreakdown":"Смета","shareAndComments":"Поделиться и комментарии","newDiagramName":"Название диаграммы"},"comments":{"title":"Комментарии","loading":"Загрузка комментариев…","commentCount":"{count} комментарий","commentCount_other":"{count} комментариев","noCommentsYet":"Комментариев пока нет.","noCommentsHint":"Добавьте ниже или нажмите на диаграмму, чтобы привязать комментарий.","addComment":"Добавить комментарий… Используйте @ для упоминания","comment":"Комментарий","attachingTo":"Привязка к {type}","canvas":"холст","resolve":"Решить","reopen":"Открыть снова","delete":"Удалить","mentionedUsers":"Упомянуто {count} пользователя","mentionedUsers_other":"Упомянуто {count} пользователей","closePanel":"Закрыть панель","deleteCommentConfirm":"Удалить этот комментарий?","failedToUpdate":"Не удалось обновить","failedToDelete":"Не удалось удалить"},"shareDialog":{"title":"Поделиться диаграммой","subtitle":"Пригласите по email для просмотра или редактирования","addPeople":"Добавить людей","emailPlaceholder":"email@example.com","canView":"Может просматривать","canEdit":"Может редактировать","owner":"Владелец","theyNeedAccount":"Нужна учётная запись. Доступ по email.","add":"Добавить","adding":"Добавление…","peopleWithAccess":"Люди с доступом","total":"{count} всего","loading":"Загрузка…","noOneElse":"Пока ни у кого нет доступа.","addPeopleAbove":"Добавьте людей выше, чтобы поделиться диаграммой.","transferOwner":"Передать владельцу","removeAccess":"Убрать доступ","closeAria":"Закрыть","failedToLoad":"Не удалось загрузить","failedToShare":"Не удалось поделиться","failedToRemoveAccess":"Не удалось убрать доступ","failedToUpdateAccess":"Не удалось обновить доступ","failedToTransferOwnership":"Не удалось передать владение","transferConfirm":"Сделать {email} новым владельцем? Вы станете редактором."},"validation":{"noErrors":"Ошибок не найдено","noErrorsDetail":"Все правила WAM выполнены, включая доверие между realm, вызовы и контейнеры.","validationErrors":"Ошибки проверки","learnMore":"Подробнее о правилах проверки"},"settings":{"accountSettings":"Настройки аккаунта","myDiagrams":"Мои диаграммы","profile":"Профиль","profileUpdated":"Профиль обновлён","updateProfile":"Обновить профиль","failedToUpdate":"Не удалось обновить профиль","deleteAccount":"Удалить аккаунт","deleteAccountConfirm":"Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.","photo":"Фото","changePhoto":"Изменить фото","removePhoto":"Удалить фото","firstNameLabel":"Имя","lastNameLabel":"Фамилия","emailAddressLabel":"Email","newPasswordLabel":"Новый пароль","leaveBlankToKeep":"Оставьте пустым, чтобы сохранить текущий","saveChanges":"Сохранить изменения","updating":"Обновление…","dangerZone":"Опасная зона","dangerZoneWarning":"После удаления аккаунта восстановить его невозможно. Убедитесь.","photoSelectedHint":"Фото выбрано. Нажмите «Сохранить изменения» для обновления."},"editor":{"myDiagrams":"Мои диаграммы","newDiagram":"Новая диаграмма","noDiagrams":"Диаграмм пока нет.","createFirst":"Создайте первую диаграмму.","deleteConfirm":"Удалить эту диаграмму?","creating":"Создание…","yourDiagrams":"Ваши диаграммы","yourDiagramsSubtitle":"Создавайте, редактируйте и управляйте диаграммами","edited":"Изменено","owner":"Владелец","editor":"Редактор","viewer":"Наблюдатель","open":"Открыть","rename":"Переименовать","delete":"Удалить","sharedWithMe":"Поделились со мной","sharedWithMeSubtitle":"Диаграммы, которыми с вами поделились","diagramActions":"Действия с диаграммой"},"login":{"title":"Войти","emailPlaceholder":"Email","passwordPlaceholder":"Пароль","submit":"Войти","successRedirecting":"Успех! Перенаправление…","success":"Успех!","redirecting":"Перенаправление…","loggingIn":"Вход…","orLoginWith":"Или войти через:","forgotPassword":"Забыли пароль?","loginWithGoogle":"Войти через Google","home":"Главная"},"contextMenu":{"canvas":"Холст","diagram":"Диаграмма","node":"Узел","edge":"Ребро","element":"Элемент","details":"Подробности","actions":"Действия","addCommentHere":"Добавить комментарий здесь","resetCanvas":"Сбросить холст","selectAll":"Выбрать всё","properties":"Свойства","duplicateNode":"Дублировать узел","deleteNode":"Удалить узел","deleteEdge":"Удалить ребро","id":"ID","size":"Размер","source":"Источник","target":"Цель"},"diagram":{"trust":"Доверие","trustEdge":"Ребро доверия","invocationEdge":"Ребро вызова","legacyEdge":"Ребро наследования"}});}),
"[project]/devinche-client/src/locales/ko.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"close":"닫기","save":"저장","cancel":"취소","loading":"로딩 중…","error":"오류","success":"성공","back":"뒤로","delete":"삭제","send":"보내기","sending":"전송 중…"},"home":{"signIn":"로그인","createDiagram":"다이어그램 만들기","myDiagrams":"내 다이어그램","letsGo":"시작하기","headline":"Devinche 에디터로 어려운 다이어그램도 쉽게.","subheadline":"함께 최고의 결과를 이루는 공간."},"auth":{"signIn":"로그인","signUp":"회원가입","signOut":"로그아웃","email":"이메일","password":"비밀번호","confirmPassword":"비밀번호 확인","firstName":"이름","lastName":"성","settings":"설정","userMenu":"사용자 메뉴"},"toolbar":{"diagrams":"다이어그램","viewOnly":"보기 전용","untitledDiagram":"제목 없음","saving":"저장 중…","saved":"저장됨","saveFailed":"저장 실패","file":"파일","edit":"편집","view":"보기","diagram":"다이어그램","share":"공유","shareDiagram":"다이어그램 공유","comments":"댓글","viewing":"보는 사람","you":"나","saveMenuItem":"저장","saveAs":"다른 이름으로 저장…","importJson":"JSON 가져오기","exportJson":"JSON 내보내기","exportPng":"PNG 내보내기","exportRdf":"RDF 내보내기","exportXml":"XML 내보내기","undo":"실행 취소","redo":"다시 실행","zoomIn":"확대","zoomOut":"축소","fitView":"맞춤","validate":"검증","costBreakdown":"비용 요약","shareAndComments":"공유 및 댓글","newDiagramName":"다이어그램 이름"},"comments":{"title":"댓글","loading":"댓글 로딩 중…","commentCount":"댓글 {count}개","commentCount_other":"댓글 {count}개","noCommentsYet":"아직 댓글이 없습니다.","noCommentsHint":"아래에서 추가하거나 다이어그램을 클릭하여 댓글을 연결하세요.","addComment":"댓글 추가… @로 멘션","comment":"댓글","attachingTo":"{type}(으)로 연결","canvas":"캔버스","resolve":"해결","reopen":"다시 열기","delete":"삭제","mentionedUsers":"{count}명 멘션","mentionedUsers_other":"{count}명 멘션","closePanel":"패널 닫기","deleteCommentConfirm":"이 댓글을 삭제할까요?","failedToUpdate":"업데이트에 실패했습니다","failedToDelete":"삭제에 실패했습니다"},"shareDialog":{"title":"다이어그램 공유","subtitle":"이메일로 보기 또는 편집 권한 초대","addPeople":"사람 추가","emailPlaceholder":"email@example.com","canView":"보기 권한","canEdit":"편집 권한","owner":"소유자","theyNeedAccount":"계정이 필요합니다. 이메일로 접근합니다.","add":"추가","adding":"추가 중…","peopleWithAccess":"액세스 권한이 있는 사람","total":"총 {count}명","loading":"로딩 중…","noOneElse":"아직 다른 사용자에게 권한이 없습니다.","addPeopleAbove":"위에서 사람을 추가하여 이 다이어그램을 공유하세요.","transferOwner":"소유권 양도","removeAccess":"액세스 제거","closeAria":"닫기","failedToLoad":"로드에 실패했습니다","failedToShare":"공유에 실패했습니다","failedToRemoveAccess":"액세스 제거에 실패했습니다","failedToUpdateAccess":"액세스 업데이트에 실패했습니다","failedToTransferOwnership":"소유권 양도에 실패했습니다","transferConfirm":"{email}을(를) 새 소유자로 지정할까요? 귀하는 편집자가 됩니다."},"validation":{"noErrors":"오류 없음","noErrorsDetail":"realm 간 신뢰, 호출, 레거시 및 컨테이너를 포함한 모든 WAM 규칙이 충족됩니다.","validationErrors":"검증 오류","learnMore":"검증 규칙 자세히 보기"},"settings":{"accountSettings":"계정 설정","myDiagrams":"내 다이어그램","profile":"프로필","profileUpdated":"프로필이 업데이트되었습니다","updateProfile":"프로필 업데이트","failedToUpdate":"프로필 업데이트 실패","deleteAccount":"계정 삭제","deleteAccountConfirm":"계정을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.","photo":"사진","changePhoto":"사진 변경","removePhoto":"사진 제거","firstNameLabel":"이름","lastNameLabel":"성","emailAddressLabel":"이메일","newPasswordLabel":"새 비밀번호","leaveBlankToKeep":"비워두면 현재 비밀번호 유지","saveChanges":"변경 사항 저장","updating":"업데이트 중…","dangerZone":"위험 구역","dangerZoneWarning":"계정을 삭제하면 복구할 수 없습니다. 신중히 결정하세요.","photoSelectedHint":"사진이 선택되었습니다. \"변경 사항 저장\"을 클릭하여 업데이트하세요."},"editor":{"myDiagrams":"내 다이어그램","newDiagram":"새 다이어그램","noDiagrams":"아직 다이어그램이 없습니다.","createFirst":"첫 다이어그램을 만들어 보세요.","deleteConfirm":"이 다이어그램을 삭제하시겠습니까?","creating":"만드는 중…","yourDiagrams":"내 다이어그램","yourDiagramsSubtitle":"다이어그램을 만들고, 편집하고, 관리하세요","edited":"수정됨","owner":"소유자","editor":"편집자","viewer":"뷰어","open":"열기","rename":"이름 변경","delete":"삭제","sharedWithMe":"나와 공유됨","sharedWithMeSubtitle":"다른 사용자가 나와 공유한 다이어그램","diagramActions":"다이어그램 작업"},"login":{"title":"로그인","emailPlaceholder":"이메일","passwordPlaceholder":"비밀번호","submit":"로그인","successRedirecting":"성공! 리디렉션 중…","success":"성공!","redirecting":"리디렉션 중…","loggingIn":"로그인 중…","orLoginWith":"또는 다음으로 로그인:","forgotPassword":"비밀번호를 잊으셨나요?","loginWithGoogle":"Google로 로그인","home":"홈"},"contextMenu":{"canvas":"캔버스","diagram":"다이어그램","node":"노드","edge":"엣지","element":"요소","details":"세부정보","actions":"작업","addCommentHere":"여기에 댓글 추가","resetCanvas":"캔버스 초기화","selectAll":"전체 선택","properties":"속성","duplicateNode":"노드 복제","deleteNode":"노드 삭제","deleteEdge":"엣지 삭제","id":"ID","size":"크기","source":"소스","target":"대상"},"diagram":{"trust":"신뢰","trustEdge":"신뢰 엣지","invocationEdge":"호출 엣지","legacyEdge":"레거시 엣지"}});}),
"[project]/devinche-client/src/locales/ur.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"close":"بند کریں","save":"محفوظ کریں","cancel":"منسوخ کریں","loading":"لوڈ ہو رہا ہے…","error":"خرابی","success":"کامیابی","back":"واپس","delete":"حذف کریں","send":"بھیجیں","sending":"بھیجا جا رہا ہے…"},"home":{"signIn":"سائن ان","createDiagram":"ڈایاگرام بنائیں","myDiagrams":"میرے ڈایاگرام","letsGo":"شروع کریں","headline":"Devinche ایڈیٹر سے مشکل ڈایاگرام آسان۔","subheadline":"جہاں لوگ مل کر بہترین نتائج حاصل کرتے ہیں۔"},"auth":{"signIn":"سائن ان","signUp":"سائن اپ","signOut":"سائن آؤٹ","email":"ای میل","password":"پاس ورڈ","confirmPassword":"پاس ورڈ کی تصدیق کریں","firstName":"پہلا نام","lastName":"آخری نام","settings":"ترتیبات","userMenu":"صارف مینو"},"toolbar":{"diagrams":"ڈایاگرام","viewOnly":"صرف دیکھیں","untitledDiagram":"بے عنوان ڈایاگرام","saving":"محفوظ ہو رہا ہے…","saved":"محفوظ ہو گیا","saveFailed":"محفوظ نہیں ہو سکا","file":"فائل","edit":"ترمیم","view":"نظارہ","diagram":"ڈایاگرام","share":"شیئر کریں","shareDiagram":"ڈایاگرام شیئر کریں","comments":"تبصرے","viewing":"دیکھنے والے","you":"آپ","saveMenuItem":"محفوظ کریں","saveAs":"محفوظ کریں بطور…","importJson":"JSON درآمد کریں","exportJson":"JSON برآمد کریں","exportPng":"PNG برآمد کریں","exportRdf":"RDF برآمد کریں","exportXml":"XML برآمد کریں","undo":"واپس لیں","redo":"دہرائیں","zoomIn":"بڑا کریں","zoomOut":"چھوٹا کریں","fitView":"فٹ کریں","validate":"تصدیق کریں","costBreakdown":"لاگت","shareAndComments":"شیئر اور تبصرے","newDiagramName":"ڈایاگرام کا نام"},"comments":{"title":"تبصرے","loading":"تبصرے لوڈ ہو رہے ہیں…","commentCount":"{count} تبصرہ","commentCount_other":"{count} تبصرے","noCommentsYet":"ابھی تبصرے نہیں۔","noCommentsHint":"نیچے شامل کریں یا ڈایاگرام پر کلک کر کے تبصرہ جوڑیں۔","addComment":"تبصرہ شامل کریں… @ سے mention کریں","comment":"تبصرہ","attachingTo":"{type} سے جوڑ رہے ہیں","canvas":"کینوس","resolve":"حل کریں","reopen":"دوبارہ کھولیں","delete":"حذف کریں","mentionedUsers":"{count} صارف mention","mentionedUsers_other":"{count} صارفین mention","closePanel":"پینل بند کریں","deleteCommentConfirm":"یہ تبصرہ حذف کریں؟","failedToUpdate":"اپڈیٹ نہیں ہو سکی","failedToDelete":"حذف نہیں ہو سکی"},"shareDialog":{"title":"ڈایاگرام شیئر کریں","subtitle":"دیکھنے یا ترمیم کے لیے ای میل سے لوگوں کو مدعو کریں","addPeople":"لوگ شامل کریں","emailPlaceholder":"email@example.com","canView":"دیکھ سکتے ہیں","canEdit":"ترمیم کر سکتے ہیں","owner":"مالک","theyNeedAccount":"اکاؤنٹ درکار۔ رسائی ای میل سے۔","add":"شامل کریں","adding":"شامل ہو رہا ہے…","peopleWithAccess":"رسائی والے لوگ","total":"{count} کل","loading":"لوڈ ہو رہا ہے…","noOneElse":"ابھی کسی اور کے پاس رسائی نہیں۔","addPeopleAbove":"اس ڈایاگرام کو شیئر کرنے کے لیے اوپر لوگ شامل کریں۔","transferOwner":"مالک منتقل کریں","removeAccess":"رسائی ہٹائیں","closeAria":"بند کریں","failedToLoad":"لوڈ نہیں ہو سکی","failedToShare":"شیئر نہیں ہو سکی","failedToRemoveAccess":"رسائی ہٹانا نہیں ہو سکی","failedToUpdateAccess":"رسائی اپڈیٹ نہیں ہو سکی","failedToTransferOwnership":"مالکیت منتقل نہیں ہو سکی","transferConfirm":"{email} کو نیا مالک بنائیں؟ آپ ایڈیٹر بن جائیں گے۔"},"validation":{"noErrors":"کوئی خرابی نہیں","noErrorsDetail":"تمام WAM قواعد پورے ہیں، realm کے درمیان اعتماد، invocation اور containment سمیت۔","validationErrors":"تصدیق کی خرابیاں","learnMore":"تصدیق کے قواعد کے بارے میں مزید"},"settings":{"accountSettings":"اکاؤنٹ کی ترتیبات","myDiagrams":"میرے ڈایاگرام","profile":"پروفائل","profileUpdated":"پروفائل اپڈیٹ ہو گئی","updateProfile":"پروفائل اپڈیٹ کریں","failedToUpdate":"پروفائل اپڈیٹ نہیں ہو سکی","deleteAccount":"اکاؤنٹ حذف کریں","deleteAccountConfirm":"کیا آپ واقعی اپنا اکاؤنٹ حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں لیا جا سکتا۔","photo":"تصویر","changePhoto":"تصویر بدلیں","removePhoto":"تصویر ہٹائیں","firstNameLabel":"پہلا نام","lastNameLabel":"آخری نام","emailAddressLabel":"ای میل","newPasswordLabel":"نیا پاس ورڈ","leaveBlankToKeep":"موجودہ رکھنے کے لیے خالی چھوڑیں","saveChanges":"تبدیلیاں محفوظ کریں","updating":"اپڈیٹ ہو رہا ہے…","dangerZone":"خطرے کا زون","dangerZoneWarning":"اکاؤنٹ حذف ہونے کے بعد واپسی ممکن نہیں۔ یقینی بنائیں۔","photoSelectedHint":"تصویر منتخب ہو گئی۔ اپڈیٹ کے لیے \"تبدیلیاں محفوظ کریں\" پر کلک کریں۔"},"editor":{"myDiagrams":"میرے ڈایاگرام","newDiagram":"نیا ڈایاگرام","noDiagrams":"ابھی ڈایاگرام نہیں۔","createFirst":"اپنا پہلا ڈایاگرام بنائیں۔","deleteConfirm":"یہ ڈایاگرام حذف کریں؟","creating":"بن رہا ہے…","yourDiagrams":"آپ کے ڈایاگرام","yourDiagramsSubtitle":"ڈایاگرام بنائیں، ترمیم کریں یا منظم کریں","edited":"ترمیم شدہ","owner":"مالک","editor":"ایڈیٹر","viewer":"ناظر","open":"کھولیں","rename":"نام بدلیں","delete":"حذف کریں","sharedWithMe":"میرے ساتھ شیئر","sharedWithMeSubtitle":"دوسروں نے آپ کے ساتھ شیئر کیے گئے ڈایاگرام","diagramActions":"ڈایاگرام کے اختیارات"},"login":{"title":"سائن ان","emailPlaceholder":"ای میل","passwordPlaceholder":"پاس ورڈ","submit":"سائن ان","successRedirecting":"کامیابی! ری ڈائریکٹ ہو رہا ہے…","success":"کامیابی!","redirecting":"ری ڈائریکٹ ہو رہا ہے…","loggingIn":"سائن ان ہو رہا ہے…","orLoginWith":"یا اس سے سائن ان کریں:","forgotPassword":"پاس ورڈ بھول گئے؟","loginWithGoogle":"Google سے سائن ان","home":"ہوم"},"contextMenu":{"canvas":"کینوس","diagram":"ڈایاگرام","node":"نوڈ","edge":"کنارہ","element":"عنصر","details":"تفصیلات","actions":"اعمال","addCommentHere":"یہاں تبصرہ شامل کریں","resetCanvas":"کینوس دوبارہ سیٹ کریں","selectAll":"سب منتخب کریں","properties":"خصائص","duplicateNode":"نوڈ ڈپلیکیٹ کریں","deleteNode":"نوڈ حذف کریں","deleteEdge":"کنارہ حذف کریں","id":"ID","size":"سائز","source":"ماخذ","target":"ہدف"},"diagram":{"trust":"اعتماد","trustEdge":"ٹرسٹ کنارہ","invocationEdge":"انوکیشن کنارہ","legacyEdge":"لیگیسی کنارہ"}});}),
"[project]/devinche-client/src/locales/ar.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"close":"إغلاق","save":"حفظ","cancel":"إلغاء","loading":"جاري التحميل…","error":"خطأ","success":"نجاح","back":"رجوع","delete":"حذف","send":"إرسال","sending":"جاري الإرسال…"},"home":{"signIn":"تسجيل الدخول","createDiagram":"إنشاء رسم بياني","myDiagrams":"رسومي البيانية","letsGo":"لنبدأ","headline":"الرسوم البيانية المعقدة أسهل مع محرر Devinche.","subheadline":"فضاء يعمل فيه الناس معاً لتحقيق أفضل النتائج."},"auth":{"signIn":"تسجيل الدخول","signUp":"إنشاء حساب","signOut":"تسجيل الخروج","email":"البريد الإلكتروني","password":"كلمة المرور","confirmPassword":"تأكيد كلمة المرور","firstName":"الاسم الأول","lastName":"اسم العائلة","settings":"الإعدادات","userMenu":"قائمة المستخدم"},"toolbar":{"diagrams":"الرسوم البيانية","viewOnly":"عرض فقط","untitledDiagram":"رسم بياني بدون عنوان","saving":"جاري الحفظ…","saved":"تم الحفظ","saveFailed":"فشل الحفظ","file":"ملف","edit":"تحرير","view":"عرض","diagram":"رسم بياني","share":"مشاركة","shareDiagram":"مشاركة الرسم البياني","comments":"التعليقات","viewing":"عرض","you":"أنت","saveMenuItem":"حفظ","saveAs":"حفظ باسم…","importJson":"استيراد JSON","exportJson":"تصدير JSON","exportPng":"تصدير PNG","exportRdf":"تصدير RDF","exportXml":"تصدير XML","undo":"تراجع","redo":"إعادة","zoomIn":"تكبير","zoomOut":"تصغير","fitView":"ملاءمة العرض","validate":"التحقق","costBreakdown":"تفصيل التكلفة","shareAndComments":"المشاركة والتعليقات","newDiagramName":"اسم الرسم البياني الجديد"},"comments":{"title":"التعليقات","loading":"جاري تحميل التعليقات…","commentCount":"{count} تعليق","commentCount_other":"{count} تعليقات","noCommentsYet":"لا توجد تعليقات بعد.","noCommentsHint":"أضف تعليقاً أدناه أو انقر على الرسم لربط تعليق.","addComment":"أضف تعليقاً… استخدم @ للإشارة إلى الآخرين","comment":"تعليق","attachingTo":"الربط بـ {type}","canvas":"لوحة","resolve":"حل","reopen":"إعادة فتح","delete":"حذف","mentionedUsers":"الإشارة إلى {count} مستخدم","mentionedUsers_other":"الإشارة إلى {count} مستخدمين","closePanel":"إغلاق اللوحة","deleteCommentConfirm":"حذف هذا التعليق؟","failedToUpdate":"فشل التحديث","failedToDelete":"فشل الحذف"},"shareDialog":{"title":"مشاركة الرسم البياني","subtitle":"ادعُ أشخاصاً بالبريد لعرض أو تعديل","addPeople":"إضافة أشخاص","emailPlaceholder":"email@example.com","canView":"يمكنه العرض","canEdit":"يمكنه التعديل","owner":"مالك","theyNeedAccount":"يحتاجون حساباً. الوصول بالبريد.","add":"إضافة","adding":"جاري الإضافة…","peopleWithAccess":"الأشخاص ذوو الوصول","total":"{count} الإجمالي","loading":"جاري التحميل…","noOneElse":"لا يملك أحد آخر الوصول بعد.","addPeopleAbove":"أضف أشخاصاً أعلاه لمشاركة هذا الرسم.","transferOwner":"نقل الملكية","removeAccess":"إزالة الوصول","closeAria":"إغلاق","failedToLoad":"فشل التحميل","failedToShare":"فشلت المشاركة","failedToRemoveAccess":"فشل إزالة الوصول","failedToUpdateAccess":"فشل تحديث الوصول","failedToTransferOwnership":"فشل نقل الملكية","transferConfirm":"جعل {email} المالك الجديد؟ ستصبح محرراً."},"validation":{"noErrors":"لا توجد أخطاء","noErrorsDetail":"جميع قواعد WAM مستوفاة، بما في ذلك الثقة بين النطاقات والاستدعاء والتضمين.","validationErrors":"أخطاء التحقق","learnMore":"المزيد عن قواعد التحقق"},"settings":{"accountSettings":"إعدادات الحساب","myDiagrams":"رسومي البيانية","profile":"الملف الشخصي","profileUpdated":"تم تحديث الملف الشخصي","updateProfile":"تحديث الملف الشخصي","failedToUpdate":"فشل تحديث الملف الشخصي","deleteAccount":"حذف الحساب","deleteAccountConfirm":"هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.","photo":"الصورة","changePhoto":"تغيير الصورة","removePhoto":"إزالة الصورة","firstNameLabel":"الاسم الأول","lastNameLabel":"اسم العائلة","emailAddressLabel":"البريد الإلكتروني","newPasswordLabel":"كلمة المرور الجديدة","leaveBlankToKeep":"اتركه فارغاً للاحتفاظ بالحالي","saveChanges":"حفظ التغييرات","updating":"جاري التحديث…","dangerZone":"منطقة الخطر","dangerZoneWarning":"بعد حذف حسابك لا يمكن الرجوع. كن متأكداً.","photoSelectedHint":"تم اختيار صورة. انقر \"حفظ التغييرات\" للتحديث."},"editor":{"myDiagrams":"رسومي البيانية","newDiagram":"رسم بياني جديد","noDiagrams":"لا توجد رسوم بيانية بعد.","createFirst":"أنشئ رسمك الأول للبدء.","deleteConfirm":"حذف هذا الرسم البياني؟","creating":"جاري الإنشاء…","yourDiagrams":"رسومك البيانية","yourDiagramsSubtitle":"إنشاء أو تحرير أو إدارة رسومك البيانية","edited":"تم التحرير","owner":"المالك","editor":"محرر","viewer":"عارض","open":"فتح","rename":"إعادة تسمية","delete":"حذف","sharedWithMe":"مشارك معي","sharedWithMeSubtitle":"رسوم بيانية شاركها معك آخرون","diagramActions":"إجراءات الرسم البياني"},"login":{"title":"تسجيل الدخول","emailPlaceholder":"البريد الإلكتروني","passwordPlaceholder":"كلمة المرور","submit":"تسجيل الدخول","successRedirecting":"نجاح! جاري إعادة التوجيه…","success":"نجاح!","redirecting":"جاري إعادة التوجيه…","loggingIn":"جاري تسجيل الدخول…","orLoginWith":"أو سجّل الدخول باستخدام:","forgotPassword":"نسيت كلمة المرور؟","loginWithGoogle":"تسجيل الدخول بـ Google","home":"الرئيسية"},"contextMenu":{"canvas":"لوحة","diagram":"رسم بياني","node":"عقدة","edge":"حافة","element":"عنصر","details":"تفاصيل","actions":"إجراءات","addCommentHere":"أضف تعليقاً هنا","resetCanvas":"إعادة تعيين اللوحة","selectAll":"تحديد الكل","properties":"خصائص","duplicateNode":"تكرار العقدة","deleteNode":"حذف العقدة","deleteEdge":"حذف الحافة","id":"المعرف","size":"الحجم","source":"المصدر","target":"الهدف"},"diagram":{"trust":"ثقة","trustEdge":"حافة الثقة","invocationEdge":"حافة الاستدعاء","legacyEdge":"حافة الموروث"}});}),
"[project]/devinche-client/src/locales/ja.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"close":"閉じる","save":"保存","cancel":"キャンセル","loading":"読み込み中…","error":"エラー","success":"成功","back":"戻る","delete":"削除","send":"送信","sending":"送信中…"},"home":{"signIn":"サインイン","createDiagram":"図を作成","myDiagrams":"マイ図","letsGo":"始める","headline":"Devincheのエディタで難しい図も簡単に。","subheadline":"人々が協力して最高の結果を出す場所。"},"auth":{"signIn":"サインイン","signUp":"サインアップ","signOut":"ログアウト","email":"メール","password":"パスワード","confirmPassword":"パスワード確認","firstName":"名","lastName":"姓","settings":"設定","userMenu":"ユーザーメニュー"},"toolbar":{"diagrams":"図","viewOnly":"閲覧のみ","untitledDiagram":"無題の図","saving":"保存中…","saved":"保存済み","saveFailed":"保存に失敗","file":"ファイル","edit":"編集","view":"表示","diagram":"図","share":"共有","shareDiagram":"図を共有","comments":"コメント","viewing":"表示中","you":"あなた","saveMenuItem":"保存","saveAs":"名前を付けて保存…","importJson":"JSONをインポート","exportJson":"JSONをエクスポート","exportPng":"PNGをエクスポート","exportRdf":"RDFをエクスポート","exportXml":"XMLをエクスポート","undo":"元に戻す","redo":"やり直す","zoomIn":"拡大","zoomOut":"縮小","fitView":"表示に合わせる","validate":"検証","costBreakdown":"コスト内訳","shareAndComments":"共有とコメント","newDiagramName":"新しい図の名前"},"comments":{"title":"コメント","loading":"コメントを読み込み中…","commentCount":"{count}件のコメント","commentCount_other":"{count}件のコメント","noCommentsYet":"コメントはまだありません。","noCommentsHint":"下に追加するか、図をクリックしてコメントを添付してください。","addComment":"コメントを追加… @でメンション","comment":"コメント","attachingTo":"{type}に添付中","canvas":"キャンバス","resolve":"解決","reopen":"再開","delete":"削除","mentionedUsers":"{count}人がメンション","mentionedUsers_other":"{count}人がメンション","closePanel":"パネルを閉じる","deleteCommentConfirm":"このコメントを削除しますか？","failedToUpdate":"更新に失敗しました","failedToDelete":"削除に失敗しました"},"shareDialog":{"title":"図を共有","subtitle":"メールで閲覧・編集を招待","addPeople":"人を追加","emailPlaceholder":"email@example.com","canView":"閲覧可","canEdit":"編集可","owner":"所有者","theyNeedAccount":"アカウントが必要です。メールでアクセス。","add":"追加","adding":"追加中…","peopleWithAccess":"アクセス権がある人","total":"{count} 件","loading":"読み込み中…","noOneElse":"まだ他の人はアクセスできません。","addPeopleAbove":"上で人を追加してこの図を共有してください。","transferOwner":"所有者を譲渡","removeAccess":"アクセスを削除","closeAria":"閉じる","failedToLoad":"読み込みに失敗","failedToShare":"共有に失敗","failedToRemoveAccess":"アクセス削除に失敗","failedToUpdateAccess":"アクセス更新に失敗","failedToTransferOwnership":"所有者の譲渡に失敗","transferConfirm":"{email}を新しい所有者にしますか？あなたは編集者になります。"},"validation":{"noErrors":"検証エラーなし","noErrorsDetail":"レルム間の信頼、呼び出し、レガシー、包含を含むすべてのWAMルールを満たしています。","validationErrors":"検証エラー","learnMore":"検証ルールの詳細"},"settings":{"accountSettings":"アカウント設定","myDiagrams":"マイ図","profile":"プロフィール","profileUpdated":"プロフィールを更新しました","updateProfile":"プロフィールを更新","failedToUpdate":"プロフィールの更新に失敗","deleteAccount":"アカウントを削除","deleteAccountConfirm":"アカウントを削除してもよろしいですか？この操作は取り消せません。","photo":"写真","changePhoto":"写真を変更","removePhoto":"写真を削除","firstNameLabel":"名","lastNameLabel":"姓","emailAddressLabel":"メールアドレス","newPasswordLabel":"新しいパスワード","leaveBlankToKeep":"変更しない場合は空欄のまま","saveChanges":"変更を保存","updating":"更新中…","dangerZone":"危険ゾーン","dangerZoneWarning":"アカウントを削除すると元に戻せません。よく確認してください。","photoSelectedHint":"写真を選択しました。「変更を保存」をクリックして更新してください。"},"editor":{"myDiagrams":"マイ図","newDiagram":"新しい図","noDiagrams":"図はまだありません。","createFirst":"最初の図を作成して始めましょう。","deleteConfirm":"この図を削除しますか？","creating":"作成中…","yourDiagrams":"あなたの図","yourDiagramsSubtitle":"図の作成、編集、管理","edited":"編集済み","owner":"所有者","editor":"編集者","viewer":"閲覧者","open":"開く","rename":"名前を変更","delete":"削除","sharedWithMe":"共有された図","sharedWithMeSubtitle":"他のユーザーが共有した図","diagramActions":"図の操作"},"login":{"title":"サインイン","emailPlaceholder":"メール","passwordPlaceholder":"パスワード","submit":"サインイン","successRedirecting":"成功！リダイレクト中…","success":"成功！","redirecting":"リダイレクト中…","loggingIn":"ログイン中…","orLoginWith":"または以下でログイン：","forgotPassword":"パスワードをお忘れですか？","loginWithGoogle":"Googleでログイン","home":"ホーム"},"contextMenu":{"canvas":"キャンバス","diagram":"図","node":"ノード","edge":"エッジ","element":"要素","details":"詳細","actions":"操作","addCommentHere":"ここにコメントを追加","resetCanvas":"キャンバスをリセット","selectAll":"すべて選択","properties":"プロパティ","duplicateNode":"ノードを複製","deleteNode":"ノードを削除","deleteEdge":"エッジを削除","id":"ID","size":"サイズ","source":"ソース","target":"ターゲット"},"diagram":{"trust":"信頼","trustEdge":"信頼エッジ","invocationEdge":"呼び出しエッジ","legacyEdge":"レガシーエッジ"}});}),
"[project]/devinche-client/src/locales/zh.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"close":"关闭","save":"保存","cancel":"取消","loading":"加载中…","error":"错误","success":"成功","back":"返回","delete":"删除","send":"发送","sending":"发送中…"},"home":{"signIn":"登录","createDiagram":"创建图表","myDiagrams":"我的图表","letsGo":"开始","headline":"用Devinche编辑器，复杂图表更简单。","subheadline":"人们协作达成最佳成果的空间。"},"auth":{"signIn":"登录","signUp":"注册","signOut":"退出登录","email":"邮箱","password":"密码","confirmPassword":"确认密码","firstName":"名","lastName":"姓","settings":"设置","userMenu":"用户菜单"},"toolbar":{"diagrams":"图表","viewOnly":"仅查看","untitledDiagram":"未命名图表","saving":"保存中…","saved":"已保存","saveFailed":"保存失败","file":"文件","edit":"编辑","view":"查看","diagram":"图表","share":"分享","shareDiagram":"分享图表","comments":"评论","viewing":"查看中","you":"你","saveMenuItem":"保存","saveAs":"另存为…","importJson":"导入 JSON","exportJson":"导出 JSON","exportPng":"导出 PNG","exportRdf":"导出 RDF","exportXml":"导出 XML","undo":"撤销","redo":"重做","zoomIn":"放大","zoomOut":"缩小","fitView":"适应视图","validate":"验证","costBreakdown":"成本明细","shareAndComments":"分享与评论","newDiagramName":"新图表名称"},"comments":{"title":"评论","loading":"加载评论中…","commentCount":"{count} 条评论","commentCount_other":"{count} 条评论","noCommentsYet":"暂无评论。","noCommentsHint":"在下方添加，或点击图表添加评论。","addComment":"添加评论… 使用 @ 提及他人","comment":"评论","attachingTo":"附加到 {type}","canvas":"画布","resolve":"解决","reopen":"重新打开","delete":"删除","mentionedUsers":"提及 {count} 位用户","mentionedUsers_other":"提及 {count} 位用户","closePanel":"关闭面板","deleteCommentConfirm":"删除这条评论？","failedToUpdate":"更新失败","failedToDelete":"删除失败"},"shareDialog":{"title":"分享图表","subtitle":"通过邮箱邀请他人查看或编辑","addPeople":"添加成员","emailPlaceholder":"email@example.com","canView":"可查看","canEdit":"可编辑","owner":"所有者","theyNeedAccount":"需要账户。通过邮箱访问。","add":"添加","adding":"添加中…","peopleWithAccess":"有访问权限的人","total":"共 {count} 人","loading":"加载中…","noOneElse":"暂无其他人有访问权限。","addPeopleAbove":"在上方添加成员以分享此图表。","transferOwner":"转移所有权","removeAccess":"移除访问","closeAria":"关闭","failedToLoad":"加载失败","failedToShare":"分享失败","failedToRemoveAccess":"移除访问失败","failedToUpdateAccess":"更新访问失败","failedToTransferOwnership":"转移所有权失败","transferConfirm":"将 {email} 设为新所有者？您将变为编辑者。"},"validation":{"noErrors":"无验证错误","noErrorsDetail":"所有 WAM 规则均已满足，包括领域间信任、调用与包含。","validationErrors":"验证错误","learnMore":"了解验证规则"},"settings":{"accountSettings":"账户设置","myDiagrams":"我的图表","profile":"个人资料","profileUpdated":"个人资料已更新","updateProfile":"更新个人资料","failedToUpdate":"更新失败","deleteAccount":"删除账户","deleteAccountConfirm":"确定要删除账户吗？此操作无法撤销。","photo":"照片","changePhoto":"更换照片","removePhoto":"移除照片","firstNameLabel":"名","lastNameLabel":"姓","emailAddressLabel":"邮箱地址","newPasswordLabel":"新密码","leaveBlankToKeep":"留空以保持当前密码","saveChanges":"保存更改","updating":"更新中…","dangerZone":"危险区域","dangerZoneWarning":"删除账户后无法恢复，请确认。","photoSelectedHint":"已选择照片。点击「保存更改」以更新。"},"editor":{"myDiagrams":"我的图表","newDiagram":"新建图表","noDiagrams":"暂无图表。","createFirst":"创建你的第一个图表开始吧。","deleteConfirm":"删除此图表？","creating":"创建中…","yourDiagrams":"你的图表","yourDiagramsSubtitle":"创建、编辑或管理你的图表","edited":"已编辑","owner":"所有者","editor":"编辑者","viewer":"查看者","open":"打开","rename":"重命名","delete":"删除","sharedWithMe":"与我共享","sharedWithMeSubtitle":"他人与你共享的图表","diagramActions":"图表操作"},"login":{"title":"登录","emailPlaceholder":"邮箱","passwordPlaceholder":"密码","submit":"登录","successRedirecting":"成功！正在跳转…","success":"成功！","redirecting":"正在跳转…","loggingIn":"登录中…","orLoginWith":"或使用以下方式登录：","forgotPassword":"忘记密码？","loginWithGoogle":"使用 Google 登录","home":"首页"},"contextMenu":{"canvas":"画布","diagram":"图表","node":"节点","edge":"边","element":"元素","details":"详情","actions":"操作","addCommentHere":"在此添加评论","resetCanvas":"重置画布","selectAll":"全选","properties":"属性","duplicateNode":"复制节点","deleteNode":"删除节点","deleteEdge":"删除边","id":"ID","size":"大小","source":"源","target":"目标"},"diagram":{"trust":"信任","trustEdge":"信任边","invocationEdge":"调用边","legacyEdge":"遗留边"}});}),
"[project]/devinche-client/src/locales/fr.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"close":"Fermer","save":"Enregistrer","cancel":"Annuler","loading":"Chargement…","error":"Erreur","success":"Succès","back":"Retour","delete":"Supprimer","send":"Envoyer","sending":"Envoi en cours…"},"home":{"signIn":"Connexion","createDiagram":"Créer un diagramme","myDiagrams":"Mes diagrammes","letsGo":"C'est parti","headline":"Les diagrammes complexes sont plus simples avec l'éditeur Devinche.","subheadline":"Un espace où les gens collaborent pour atteindre les meilleurs résultats."},"auth":{"signIn":"Connexion","signUp":"S'inscrire","signOut":"Déconnexion","email":"E-mail","password":"Mot de passe","confirmPassword":"Confirmer le mot de passe","firstName":"Prénom","lastName":"Nom","settings":"Paramètres","userMenu":"Menu utilisateur"},"toolbar":{"diagrams":"Diagrammes","viewOnly":"Lecture seule","untitledDiagram":"Diagramme sans titre","saving":"Enregistrement…","saved":"Enregistré","saveFailed":"Échec de l'enregistrement","file":"Fichier","edit":"Modifier","view":"Affichage","diagram":"Diagramme","share":"Partager","shareDiagram":"Partager le diagramme","comments":"Commentaires","viewing":"Affichage","you":"Vous","saveMenuItem":"Enregistrer","saveAs":"Enregistrer sous…","importJson":"Importer JSON","exportJson":"Exporter JSON","exportPng":"Exporter PNG","exportRdf":"Exporter RDF","exportXml":"Exporter XML","undo":"Annuler","redo":"Rétablir","zoomIn":"Zoom avant","zoomOut":"Zoom arrière","fitView":"Ajuster à l'écran","validate":"Valider","costBreakdown":"Détail des coûts","shareAndComments":"Partage et commentaires","newDiagramName":"Nom du nouveau diagramme"},"comments":{"title":"Commentaires","loading":"Chargement des commentaires…","commentCount":"{count} commentaire","commentCount_other":"{count} commentaires","noCommentsYet":"Aucun commentaire pour l'instant.","noCommentsHint":"Ajoutez-en un ci-dessous ou cliquez sur le diagramme pour attacher un commentaire.","addComment":"Ajouter un commentaire… Utilisez @ pour mentionner","comment":"Commentaire","attachingTo":"Attachement à {type}","canvas":"canevas","resolve":"Résoudre","reopen":"Rouvrir","delete":"Supprimer","mentionedUsers":"{count} utilisateur mentionné","mentionedUsers_other":"{count} utilisateurs mentionnés","closePanel":"Fermer le panneau","deleteCommentConfirm":"Supprimer ce commentaire ?","failedToUpdate":"Échec de la mise à jour","failedToDelete":"Échec de la suppression"},"shareDialog":{"title":"Partager le diagramme","subtitle":"Invitez des personnes par e-mail à voir ou modifier","addPeople":"Ajouter des personnes","emailPlaceholder":"email@exemple.fr","canView":"Peut voir","canEdit":"Peut modifier","owner":"Propriétaire","theyNeedAccount":"Un compte est requis. Accès par e-mail.","add":"Ajouter","adding":"Ajout…","peopleWithAccess":"Personnes ayant accès","total":"{count} au total","loading":"Chargement…","noOneElse":"Personne d'autre n'a encore accès.","addPeopleAbove":"Ajoutez des personnes ci-dessus pour partager ce diagramme.","transferOwner":"Transférer la propriété","removeAccess":"Retirer l'accès","closeAria":"Fermer","failedToLoad":"Échec du chargement","failedToShare":"Échec du partage","failedToRemoveAccess":"Échec du retrait d'accès","failedToUpdateAccess":"Échec de la mise à jour d'accès","failedToTransferOwnership":"Échec du transfert de propriété","transferConfirm":"Faire de {email} le nouveau propriétaire ? Vous deviendrez éditeur."},"validation":{"noErrors":"Aucune erreur de validation","noErrorsDetail":"Toutes les règles WAM sont satisfaites, y compris la confiance entre domaines, l'invocation et la containment.","validationErrors":"Erreurs de validation","learnMore":"En savoir plus sur les règles de validation"},"settings":{"accountSettings":"Paramètres du compte","myDiagrams":"Mes diagrammes","profile":"Profil","profileUpdated":"Profil mis à jour","updateProfile":"Mettre à jour le profil","failedToUpdate":"Échec de la mise à jour du profil","deleteAccount":"Supprimer le compte","deleteAccountConfirm":"Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.","photo":"Photo","changePhoto":"Changer la photo","removePhoto":"Supprimer la photo","firstNameLabel":"Prénom","lastNameLabel":"Nom","emailAddressLabel":"Adresse e-mail","newPasswordLabel":"Nouveau mot de passe","leaveBlankToKeep":"Laisser vide pour conserver l'actuel","saveChanges":"Enregistrer les modifications","updating":"Mise à jour…","dangerZone":"Zone de danger","dangerZoneWarning":"Une fois le compte supprimé, il n'y a pas de retour en arrière. Soyez certain.","photoSelectedHint":"Photo sélectionnée. Cliquez sur « Enregistrer les modifications » pour mettre à jour."},"editor":{"myDiagrams":"Mes diagrammes","newDiagram":"Nouveau diagramme","noDiagrams":"Aucun diagramme pour l'instant.","createFirst":"Créez votre premier diagramme pour commencer.","deleteConfirm":"Supprimer ce diagramme ?","creating":"Création…","yourDiagrams":"Vos diagrammes","yourDiagramsSubtitle":"Créez, modifiez ou gérez vos diagrammes","edited":"Modifié","owner":"Propriétaire","editor":"Éditeur","viewer":"Visualiseur","open":"Ouvrir","rename":"Renommer","delete":"Supprimer","sharedWithMe":"Partagés avec moi","sharedWithMeSubtitle":"Diagrammes partagés avec vous par d'autres","diagramActions":"Actions sur le diagramme"},"login":{"title":"Connexion","emailPlaceholder":"E-mail","passwordPlaceholder":"Mot de passe","submit":"Connexion","successRedirecting":"Succès ! Redirection…","success":"Succès !","redirecting":"Redirection…","loggingIn":"Connexion en cours…","orLoginWith":"Ou connectez-vous avec :","forgotPassword":"Mot de passe oublié ?","loginWithGoogle":"Connexion avec Google","home":"Accueil"},"contextMenu":{"canvas":"Canevas","diagram":"Diagramme","node":"Nœud","edge":"Lien","element":"Élément","details":"Détails","actions":"Actions","addCommentHere":"Ajouter un commentaire ici","resetCanvas":"Réinitialiser le canevas","selectAll":"Tout sélectionner","properties":"Propriétés","duplicateNode":"Dupliquer le nœud","deleteNode":"Supprimer le nœud","deleteEdge":"Supprimer le lien","id":"ID","size":"Taille","source":"Source","target":"Cible"},"diagram":{"trust":"Confiance","trustEdge":"Lien de confiance","invocationEdge":"Lien d'invocation","legacyEdge":"Lien legacy"}});}),
"[project]/devinche-client/src/locales/tr.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"close":"Kapat","save":"Kaydet","cancel":"İptal","loading":"Yükleniyor…","error":"Hata","success":"Başarılı","back":"Geri","delete":"Sil","send":"Gönder","sending":"Gönderiliyor…"},"home":{"signIn":"Giriş yap","createDiagram":"Diyagram oluştur","myDiagrams":"Diyagramlarım","letsGo":"Başlayalım","headline":"Zor diyagramlar Devinche düzenleyicisiyle daha kolay.","subheadline":"İnsanların en iyi sonuçlara ulaşmak için birlikte çalıştığı alan."},"auth":{"signIn":"Giriş yap","signUp":"Kayıt ol","signOut":"Çıkış yap","email":"E-posta","password":"Parola","confirmPassword":"Parolayı onayla","firstName":"Ad","lastName":"Soyad","settings":"Ayarlar","userMenu":"Kullanıcı menüsü"},"toolbar":{"diagrams":"Diyagramlar","viewOnly":"Sadece görüntüle","untitledDiagram":"Başlıksız diyagram","saving":"Kaydediliyor…","saved":"Kaydedildi","saveFailed":"Kaydetme başarısız","file":"Dosya","edit":"Düzenle","view":"Görünüm","diagram":"Diyagram","share":"Paylaş","shareDiagram":"Diyagramı paylaş","comments":"Yorumlar","viewing":"Görüntüleme","you":"Siz","saveMenuItem":"Kaydet","saveAs":"Farklı kaydet…","importJson":"JSON içe aktar","exportJson":"JSON dışa aktar","exportPng":"PNG dışa aktar","exportRdf":"RDF dışa aktar","exportXml":"XML dışa aktar","undo":"Geri al","redo":"Yinele","zoomIn":"Yakınlaştır","zoomOut":"Uzaklaştır","fitView":"Sığdır","validate":"Doğrula","costBreakdown":"Maliyet dökümü","shareAndComments":"Paylaşım ve yorumlar","newDiagramName":"Yeni diyagram adı"},"comments":{"title":"Yorumlar","loading":"Yorumlar yükleniyor…","commentCount":"{count} yorum","commentCount_other":"{count} yorum","noCommentsYet":"Henüz yorum yok.","noCommentsHint":"Aşağıya ekleyin veya diyagrama tıklayarak yorum ekleyin.","addComment":"Yorum ekleyin… Bahsetmek için @ kullanın","comment":"Yorum","attachingTo":"{type} ile ilişkilendiriliyor","canvas":"tuval","resolve":"Çöz","reopen":"Yeniden aç","delete":"Sil","mentionedUsers":"{count} kullanıcı bahsedildi","mentionedUsers_other":"{count} kullanıcı bahsedildi","closePanel":"Paneli kapat","deleteCommentConfirm":"Bu yorum silinsin mi?","failedToUpdate":"Güncelleme başarısız","failedToDelete":"Silme başarısız"},"shareDialog":{"title":"Diyagramı paylaş","subtitle":"Görüntülemek veya düzenlemek için e-posta ile davet edin","addPeople":"Kişi ekle","emailPlaceholder":"email@example.com","canView":"Görüntüleyebilir","canEdit":"Düzenleyebilir","owner":"Sahip","theyNeedAccount":"Hesap gerekir. E-posta ile erişim.","add":"Ekle","adding":"Ekleniyor…","peopleWithAccess":"Erişimi olan kişiler","total":"Toplam {count}","loading":"Yükleniyor…","noOneElse":"Henüz başka kimsenin erişimi yok.","addPeopleAbove":"Bu diyagramı paylaşmak için yukarıdan kişi ekleyin.","transferOwner":"Sahipliği devret","removeAccess":"Erişimi kaldır","closeAria":"Kapat","failedToLoad":"Yükleme başarısız","failedToShare":"Paylaşım başarısız","failedToRemoveAccess":"Erişim kaldırma başarısız","failedToUpdateAccess":"Erişim güncelleme başarısız","failedToTransferOwnership":"Sahiplik devri başarısız","transferConfirm":"{email} yeni sahip olsun mu? Siz düzenleyici olursunuz."},"validation":{"noErrors":"Doğrulama hatası yok","noErrorsDetail":"Alanlar arası güven, çağrı ve kapsama dahil tüm WAM kuralları karşılanıyor.","validationErrors":"Doğrulama hataları","learnMore":"Doğrulama kuralları hakkında bilgi"},"settings":{"accountSettings":"Hesap ayarları","myDiagrams":"Diyagramlarım","profile":"Profil","profileUpdated":"Profil güncellendi","updateProfile":"Profili güncelle","failedToUpdate":"Profil güncellenemedi","deleteAccount":"Hesabı sil","deleteAccountConfirm":"Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.","photo":"Fotoğraf","changePhoto":"Fotoğrafı değiştir","removePhoto":"Fotoğrafı kaldır","firstNameLabel":"Ad","lastNameLabel":"Soyad","emailAddressLabel":"E-posta adresi","newPasswordLabel":"Yeni parola","leaveBlankToKeep":"Mevcut kalsın diye boş bırakın","saveChanges":"Değişiklikleri kaydet","updating":"Güncelleniyor…","dangerZone":"Tehlikeli bölge","dangerZoneWarning":"Hesabı sildikten sonra geri dönüş yoktur. Emin olun.","photoSelectedHint":"Fotoğraf seçildi. Güncellemek için \"Değişiklikleri kaydet\"e tıklayın."},"editor":{"myDiagrams":"Diyagramlarım","newDiagram":"Yeni diyagram","noDiagrams":"Henüz diyagram yok.","createFirst":"Başlamak için ilk diyagramınızı oluşturun.","deleteConfirm":"Bu diyagram silinsin mi?","creating":"Oluşturuluyor…","yourDiagrams":"Diyagramlarınız","yourDiagramsSubtitle":"Diyagramlarınızı oluşturun, düzenleyin veya yönetin","edited":"Düzenlendi","owner":"Sahip","editor":"Düzenleyici","viewer":"Görüntüleyici","open":"Aç","rename":"Yeniden adlandır","delete":"Sil","sharedWithMe":"Benimle paylaşılanlar","sharedWithMeSubtitle":"Başkaları tarafından sizinle paylaşılan diyagramlar","diagramActions":"Diyagram işlemleri"},"login":{"title":"Giriş yap","emailPlaceholder":"E-posta","passwordPlaceholder":"Parola","submit":"Giriş yap","successRedirecting":"Başarılı! Yönlendiriliyor…","success":"Başarılı!","redirecting":"Yönlendiriliyor…","loggingIn":"Giriş yapılıyor…","orLoginWith":"Veya şununla giriş yapın:","forgotPassword":"Parolamı unuttum?","loginWithGoogle":"Google ile giriş yap","home":"Ana sayfa"},"contextMenu":{"canvas":"Tuval","diagram":"Diyagram","node":"Düğüm","edge":"Kenar","element":"Öğe","details":"Ayrıntılar","actions":"İşlemler","addCommentHere":"Buraya yorum ekle","resetCanvas":"Tuvali sıfırla","selectAll":"Tümünü seç","properties":"Özellikler","duplicateNode":"Düğümü çoğalt","deleteNode":"Düğümü sil","deleteEdge":"Kenarı sil","id":"ID","size":"Boyut","source":"Kaynak","target":"Hedef"},"diagram":{"trust":"Güven","trustEdge":"Güven kenarı","invocationEdge":"Çağrı kenarı","legacyEdge":"Eski kenar"}});}),
"[project]/devinche-client/src/locales/sq.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"common":{"close":"Mbyll","save":"Ruaj","cancel":"Anulo","loading":"Duke ngarkuar…","error":"Gabim","success":"Sukses","back":"Mbrapa","delete":"Fshi","send":"Dërgo","sending":"Duke dërguar…"},"home":{"signIn":"Hyr","createDiagram":"Krijo diagramë","myDiagrams":"Diagramet e mia","letsGo":"Fillojmë","headline":"Diagramet e vështira janë më të lehta me redaktuesin Devinche.","subheadline":"Hapësira ku njerëzit punojnë së bashku për rezultatet më të larta."},"auth":{"signIn":"Hyr","signUp":"Regjistrohu","signOut":"Dil","email":"Email","password":"Fjalëkalimi","confirmPassword":"Konfirmo fjalëkalimin","firstName":"Emri","lastName":"Mbiemri","settings":"Cilësimet","userMenu":"Menyja e përdoruesit"},"toolbar":{"diagrams":"Diagramet","viewOnly":"Vetëm shikim","untitledDiagram":"Diagramë pa titull","saving":"Duke ruajtur…","saved":"U ruajt","saveFailed":"Ruajtja dështoi","file":"Skedar","edit":"Ndrysho","view":"Shiko","diagram":"Diagramë","share":"Ndaj","shareDiagram":"Ndaj diagramin","comments":"Komentet","viewing":"Duke parë","you":"Ju","saveMenuItem":"Ruaj","saveAs":"Ruaj si…","importJson":"Importo JSON","exportJson":"Eksporto JSON","exportPng":"Eksporto PNG","exportRdf":"Eksporto RDF","exportXml":"Eksporto XML","undo":"Zhbëj","redo":"Ribëj","zoomIn":"Zmadho","zoomOut":"Zvogëlo","fitView":"Përshtat pamjen","validate":"Vleftëso","costBreakdown":"Ndarja e kostos","shareAndComments":"Ndarja dhe komentet","newDiagramName":"Emri i diagramit të ri"},"comments":{"title":"Komentet","loading":"Duke ngarkuar komentet…","commentCount":"{count} koment","commentCount_other":"{count} komente","noCommentsYet":"Ende pa komente.","noCommentsHint":"Shto një më poshtë ose kliko mbi diagramën për të bashkangjitur një koment.","addComment":"Shto një koment… Përdor @ për të përmendur","comment":"Koment","attachingTo":"Duke bashkangjitur te {type}","canvas":"kanavacë","resolve":"Zgjidh","reopen":"Hap përsëri","delete":"Fshi","mentionedUsers":"{count} përdorues i përmendur","mentionedUsers_other":"{count} përdorues të përmendur","closePanel":"Mbyll panelin","deleteCommentConfirm":"Fshi këtë koment?","failedToUpdate":"Përditësimi dështoi","failedToDelete":"Fshirja dështoi"},"shareDialog":{"title":"Ndaj diagramën","subtitle":"Fto njerëz me email për të parë ose redaktuar","addPeople":"Shto njerëz","emailPlaceholder":"email@example.com","canView":"Mund të shohë","canEdit":"Mund të redaktojë","owner":"Pronar","theyNeedAccount":"Nevitet llogari. Aksesi me email.","add":"Shto","adding":"Duke shtuar…","peopleWithAccess":"Njerëz me akses","total":"{count} gjithsej","loading":"Duke ngarkuar…","noOneElse":"Ende askush tjetër nuk ka akses.","addPeopleAbove":"Shto njerëz më sipër për të ndarë këtë diagramë.","transferOwner":"Transfero pronarin","removeAccess":"Hiq aksesin","closeAria":"Mbyll","failedToLoad":"Ngarkimi dështoi","failedToShare":"Ndarja dështoi","failedToRemoveAccess":"Heqja e aksesit dështoi","failedToUpdateAccess":"Përditësimi i aksesit dështoi","failedToTransferOwnership":"Transferimi i pronësisë dështoi","transferConfirm":"Bëj {email} pronar të ri? Ju do të bëheni redaktor."},"validation":{"noErrors":"Pa gabime vleftësimi","noErrorsDetail":"Të gjitha rregullat WAM janë të kënaqura, përfshirë besimin ndërmjet realm-ave dhe përmbajtjen.","validationErrors":"Gabime vleftësimi","learnMore":"Mëso më shumë për rregullat e vleftësimit"},"settings":{"accountSettings":"Cilësimet e llogarisë","myDiagrams":"Diagramet e mia","profile":"Profili","profileUpdated":"Profili u përditësua","updateProfile":"Përditëso profilin","failedToUpdate":"Përditësimi i profilit dështoi","deleteAccount":"Fshi llogarinë","deleteAccountConfirm":"Jeni të sigurt që dëshironi të fshini llogarinë? Ky veprim nuk mund të kthehet.","photo":"Foto","changePhoto":"Ndrysho foton","removePhoto":"Hiq foton","firstNameLabel":"Emri","lastNameLabel":"Mbiemri","emailAddressLabel":"Adresa e emailit","newPasswordLabel":"Fjalëkalimi i ri","leaveBlankToKeep":"Lëre bosh për të mbajtur atë aktual","saveChanges":"Ruaj ndryshimet","updating":"Duke përditësuar…","dangerZone":"Zona e rrezikshme","dangerZoneWarning":"Pasi të fshini llogarinë nuk ka kthim. Ju lutemi jini të sigurt.","photoSelectedHint":"Foto e zgjedhur. Klikoni \"Ruaj ndryshimet\" për të përditësuar."},"editor":{"myDiagrams":"Diagramet e mia","newDiagram":"Diagramë e re","noDiagrams":"Ende pa diagrame.","createFirst":"Krijo diagramën tënde të parë për të filluar.","deleteConfirm":"Fshi këtë diagramë?","creating":"Duke krijuar…","yourDiagrams":"Diagramet e tua","yourDiagramsSubtitle":"Krijo, ndrysho ose menaxho diagramet e tua","edited":"E ndryshuar","owner":"Pronar","editor":"Redaktor","viewer":"Shikues","open":"Hap","rename":"Riemërto","delete":"Fshi","sharedWithMe":"Të ndara me mua","sharedWithMeSubtitle":"Diagrame të ndara me ty nga të tjerët","diagramActions":"Veprimet e diagramit"},"login":{"title":"Hyr","emailPlaceholder":"Email","passwordPlaceholder":"Fjalëkalimi","submit":"Hyr","successRedirecting":"Sukses! Duke ridrejtuar…","success":"Sukses!","redirecting":"Duke ridrejtuar…","loggingIn":"Duke hyrë…","orLoginWith":"Ose hy me:","forgotPassword":"Harruat fjalëkalimin?","loginWithGoogle":"Hyr me Google","home":"Kryefaqja"},"contextMenu":{"canvas":"Kanavacë","diagram":"Diagramë","node":"Nyjë","edge":"Skaj","element":"Element","details":"Detaje","actions":"Veprime","addCommentHere":"Shto koment këtu","resetCanvas":"Rivendos kanavacën","selectAll":"Zgjidh të gjitha","properties":"Vetitë","duplicateNode":"Dublo nyjën","deleteNode":"Fshi nyjën","deleteEdge":"Fshi skajin","id":"ID","size":"Madhësia","source":"Burimi","target":"Synimi"},"diagram":{"trust":"Besim","trustEdge":"Skaj besimi","invocationEdge":"Skaj thirrje","legacyEdge":"Skaj trashëgimi"}});}),
"[project]/devinche-client/src/contexts/LanguageContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$en$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/devinche-client/src/locales/en.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$de$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/devinche-client/src/locales/de.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$uk$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/devinche-client/src/locales/uk.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$ru$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/devinche-client/src/locales/ru.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$ko$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/devinche-client/src/locales/ko.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$ur$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/devinche-client/src/locales/ur.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$ar$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/devinche-client/src/locales/ar.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$ja$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/devinche-client/src/locales/ja.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$zh$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/devinche-client/src/locales/zh.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$fr$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/devinche-client/src/locales/fr.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$tr$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/devinche-client/src/locales/tr.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$sq$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/devinche-client/src/locales/sq.json (json)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
const LOCALE_STORAGE_KEY = 'devinche-locale';
const VALID_LOCALES = [
    'en',
    'de',
    'uk',
    'ru',
    'ko',
    'ur',
    'ar',
    'ja',
    'zh',
    'fr',
    'tr',
    'sq'
];
const messages = {
    en: __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$en$2e$json__$28$json$29$__["default"],
    de: __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$de$2e$json__$28$json$29$__["default"],
    uk: __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$uk$2e$json__$28$json$29$__["default"],
    ru: __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$ru$2e$json__$28$json$29$__["default"],
    ko: __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$ko$2e$json__$28$json$29$__["default"],
    ur: __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$ur$2e$json__$28$json$29$__["default"],
    ar: __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$ar$2e$json__$28$json$29$__["default"],
    ja: __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$ja$2e$json__$28$json$29$__["default"],
    zh: __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$zh$2e$json__$28$json$29$__["default"],
    fr: __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$fr$2e$json__$28$json$29$__["default"],
    tr: __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$tr$2e$json__$28$json$29$__["default"],
    sq: __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$src$2f$locales$2f$sq$2e$json__$28$json$29$__["default"]
};
function getNested(obj, path) {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys){
        if (current == null || typeof current !== 'object') return undefined;
        current = current[key];
    }
    return current;
}
function interpolate(str, params) {
    if (!params) return str;
    return Object.entries(params).reduce((acc, [k, v])=>acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)), str);
}
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function LanguageProvider({ children }) {
    _s();
    const [locale, setLocaleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('en');
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LanguageProvider.useEffect": ()=>{
            const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
            if (stored && VALID_LOCALES.includes(stored)) setLocaleState(stored);
            else if (typeof navigator !== 'undefined') {
                const lang = navigator.language?.toLowerCase().slice(0, 2);
                if (lang === 'de') setLocaleState('de');
                else if (lang === 'uk') setLocaleState('uk');
                else if (lang === 'ru') setLocaleState('ru');
                else if (lang === 'ko') setLocaleState('ko');
                else if (lang === 'ur') setLocaleState('ur');
                else if (lang === 'ar') setLocaleState('ar');
                else if (lang === 'ja') setLocaleState('ja');
                else if (lang === 'zh') setLocaleState('zh');
                else if (lang === 'fr') setLocaleState('fr');
                else if (lang === 'tr') setLocaleState('tr');
                else if (lang === 'sq') setLocaleState('sq');
            }
            setMounted(true);
        }
    }["LanguageProvider.useEffect"], []);
    const setLocale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LanguageProvider.useCallback[setLocale]": (next)=>{
            setLocaleState(next);
            if ("TURBOPACK compile-time truthy", 1) localStorage.setItem(LOCALE_STORAGE_KEY, next);
        }
    }["LanguageProvider.useCallback[setLocale]"], []);
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LanguageProvider.useCallback[t]": (key, params)=>{
            const dict = mounted ? messages[locale] : messages.en;
            const fallbackDict = messages.en;
            const count = params?.count;
            const lookupKey = count !== undefined && count !== 1 ? key + '_other' : key;
            let value = getNested(dict, lookupKey);
            if (value == null) value = getNested(fallbackDict, lookupKey);
            if (value == null) value = getNested(dict, key) ?? getNested(fallbackDict, key);
            if (value == null) return key;
            const str = typeof value === 'string' ? value : String(value);
            return interpolate(str, params);
        }
    }["LanguageProvider.useCallback[t]"], [
        locale,
        mounted
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LanguageProvider.useMemo[value]": ()=>({
                locale,
                setLocale,
                t
            })
    }["LanguageProvider.useMemo[value]"], [
        locale,
        setLocale,
        t
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/devinche-client/src/contexts/LanguageContext.tsx",
        lineNumber: 99,
        columnNumber: 10
    }, this);
}
_s(LanguageProvider, "MrzQBsofELI2Ee6YyZEur5MPB24=");
_c = LanguageProvider;
function useLanguage() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
    return ctx;
}
_s1(useLanguage, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "LanguageProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/devinche-client/src/components/PageTransition.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PageTransition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/devinche-client/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function PageTransition({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page-transition-wrap",
        children: children
    }, pathname, false, {
        fileName: "[project]/devinche-client/src/components/PageTransition.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_s(PageTransition, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = PageTransition;
var _c;
__turbopack_context__.k.register(_c, "PageTransition");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/devinche-client/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/devinche-client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/devinche-client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$devinche$2d$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/devinche-client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/devinche-client/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/devinche-client/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/devinche-client/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=devinche-client_58e91d01._.js.map