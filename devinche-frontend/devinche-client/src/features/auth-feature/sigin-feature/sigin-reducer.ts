// src/features/auth/signin/signInReducer.ts

export interface SignInState {
  email: string;
  password: string;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export type SignInAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; payload: string };

export const initialSignInState: SignInState = {
  email: "",
  password: "",
  isSubmitting: false,
  errorMessage: null,
};

export function signInReducer(
  state: SignInState,
  action: SignInAction
): SignInState {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload, errorMessage: null };
    case "SET_PASSWORD":
      return { ...state, password: action.payload, errorMessage: null };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, errorMessage: null };
    case "SUBMIT_SUCCESS":
      return { ...state, isSubmitting: false };
    case "SUBMIT_ERROR":
      return { ...state, isSubmitting: false, errorMessage: action.payload };
    default:
      return state;
  }
}