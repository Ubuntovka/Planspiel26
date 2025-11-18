// src/features/auth/signin/SignInScreen.tsx
import React from "react";
import { useSiginController } from "./sigin-controller";


export function SignInScreen() {
  const {
    state: { email, password, isSubmitting, errorMessage },
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useSiginController((result) => {
    console.log("Signed in:", result.userName);
    // e.g. navigate or store token somewhere
  });

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">Sign In</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}