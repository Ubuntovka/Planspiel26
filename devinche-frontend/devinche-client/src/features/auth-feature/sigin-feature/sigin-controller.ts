// src/features/auth/signin/useSignInViewModel.ts
import { FormEvent, useReducer } from "react";
import { useMutation } from "@tanstack/react-query";
import { initialSignInState, signInReducer } from "./sigin-reducer";


type SignInPayload = {
  email: string;
  password: string;
};

type SignInResult = {
  accessToken: string;
  userName: string;
};

async function signInRequest(payload: SignInPayload): Promise<SignInResult> {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Failed to sign in");
  }

  return res.json();
}

export function useSiginController(onSuccess?: (r: SignInResult) => void) {
  const [state, dispatch] = useReducer(signInReducer, initialSignInState);

  const mutation = useMutation({
    mutationFn: signInRequest,
    onSuccess(result) {
      dispatch({ type: "SUBMIT_SUCCESS" });
      onSuccess?.(result);
    },
    onError(error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      dispatch({ type: "SUBMIT_ERROR", payload: msg });
    },
  });

  function handleEmailChange(value: string) {
    dispatch({ type: "SET_EMAIL", payload: value });
  }

  function handlePasswordChange(value: string) {
    dispatch({ type: "SET_PASSWORD", payload: value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!state.email || !state.password) {
      dispatch({
        type: "SUBMIT_ERROR",
        payload: "Email and password are required.",
      });
      return;
    }

    dispatch({ type: "SUBMIT_START" });
    await mutation.mutateAsync({
      email: state.email,
      password: state.password,
    });
  }

  return {
    state, // { email, password, isSubmitting, errorMessage }
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
}