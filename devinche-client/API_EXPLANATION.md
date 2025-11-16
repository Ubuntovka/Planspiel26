# API Folder Explanation

## 📁 What is the `api` Folder?

The `api` folder contains **organized functions that make HTTP requests to your backend server**. It's like a **service layer** that handles all communication between your frontend and backend.

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Components    │  ← Your React components (UI)
└────────┬────────┘
         │
         │ Uses hooks
         ▼
┌─────────────────┐
│     Hooks       │  ← Custom hooks (use-auth, use-api)
└────────┬────────┘
         │
         │ Calls API functions
         ▼
┌─────────────────┐
│   api/ folder   │  ← API functions (auth.ts, etc.)
└────────┬────────┘
         │
         │ Uses api helper
         ▼
┌─────────────────┐
│  api-client.ts  │  ← Axios instance with interceptors
└────────┬────────┘
         │
         │ Makes HTTP requests
         ▼
┌─────────────────┐
│   Backend API   │  ← Your server
└─────────────────┘
```

---

## 📂 File Structure

### 1. `src/api/auth.ts` - Authentication API Functions

This file contains **all authentication-related API calls**. Think of it as a **collection of functions** that talk to your backend's authentication endpoints.

#### What it does:
- **Groups related API calls together** (all auth-related)
- **Provides type-safe functions** with TypeScript
- **Makes it easy to call backend endpoints** from anywhere in your app

#### Example Breakdown:

```typescript
// This function logs in a user
login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return api.post<AuthResponse>('/auth/login', credentials);
}
```

**What happens:**
1. Takes `credentials` (email & password) as input
2. Calls `api.post()` which sends a POST request to `/auth/login`
3. Returns a Promise that resolves to `AuthResponse` (user data + token)
4. TypeScript ensures type safety

#### All Available Functions:

| Function | What It Does | HTTP Method | Endpoint |
|----------|-------------|-------------|----------|
| `login()` | Logs in a user | POST | `/auth/login` |
| `signup()` | Creates a new user | POST | `/auth/signup` |
| `logout()` | Logs out the user | POST | `/auth/logout` |
| `getCurrentUser()` | Gets logged-in user info | GET | `/auth/me` |
| `refreshToken()` | Refreshes auth token | POST | `/auth/refresh` |
| `updateProfile()` | Updates user profile | PATCH | `/auth/profile` |
| `changePassword()` | Changes user password | POST | `/auth/change-password` |

---

### 2. `src/api/index.ts` - Barrel Export

This is a **convenience file** that exports all API functions from one place.

**Why it exists:**
- Instead of: `import { authApi } from '@/api/auth'`
- You can do: `import { authApi } from '@/api'` (if you add more exports)

**Current content:**
```typescript
export * from './auth';  // Exports everything from auth.ts
```

**Future example** (when you add more API files):
```typescript
export * from './auth';
export * from './users';
export * from './products';
// Now you can import from one place!
```

---

## 🔧 How It Works Together

### Step-by-Step Flow:

#### Example: User Logs In

1. **User fills out login form** (`LoginForm` component)
2. **Form calls hook**: `useLogin()` hook
3. **Hook calls API function**: `authApi.login(credentials)`
4. **API function uses helper**: `api.post('/auth/login', credentials)`
5. **Helper uses axios**: Makes actual HTTP request
6. **Interceptor adds token**: Automatically adds `Authorization: Bearer <token>` header
7. **Backend responds**: Returns user data + token
8. **Response transformed**: Extracts data from response wrapper
9. **Hook updates state**: Stores user in Zustand store
10. **Component re-renders**: Shows logged-in state

---

## 🎯 Why This Structure?

### ✅ Benefits:

1. **Separation of Concerns**
   - API logic is separate from UI logic
   - Easy to find and modify API calls

2. **Reusability**
   - Same API function can be used in multiple places
   - No code duplication

3. **Type Safety**
   - TypeScript ensures you pass correct data types
   - Catches errors before runtime

4. **Easy Testing**
   - Can mock API functions easily
   - Test API calls independently

5. **Maintainability**
   - If backend URL changes, update one place
   - If endpoint changes, update one function

6. **Consistency**
   - All API calls use same error handling
   - All requests have auth token automatically

---

## 📝 How to Add New API Endpoints

### Example: Adding a "Users" API

1. **Create new file**: `src/api/users.ts`

```typescript
import { api } from '@/lib/api-client';
import type { User } from '@/types/auth';

export const usersApi = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    return api.get<User[]>('/users');
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    return api.get<User>(`/users/${id}`);
  },

  // Create new user
  create: async (data: CreateUserDto): Promise<User> => {
    return api.post<User>('/users', data);
  },

  // Update user
  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    return api.patch<User>(`/users/${id}`, data);
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    return api.delete(`/users/${id}`);
  },
};
```

2. **Export from index**: `src/api/index.ts`
```typescript
export * from './auth';
export * from './users';  // Add this
```

3. **Use in your code**:
```typescript
import { usersApi } from '@/api';

// In a component or hook
const users = await usersApi.getAll();
```

---

## 🔍 Understanding `api-client.ts`

The `api-client.ts` file is the **foundation** that all API functions use. It provides:

### 1. **Axios Instance** (`apiClient`)
- Pre-configured HTTP client
- Base URL from environment variables
- Default headers (Content-Type: application/json)
- 30-second timeout

### 2. **Request Interceptor**
- **Automatically adds auth token** to every request
- Gets token from `localStorage`
- Adds `Authorization: Bearer <token>` header

### 3. **Response Interceptor**
- **Handles errors globally**
- If 401 (Unauthorized), clears token
- Transforms errors to consistent format

### 4. **Helper Functions** (`api` object)
- `api.get()` - GET requests
- `api.post()` - POST requests
- `api.put()` - PUT requests
- `api.patch()` - PATCH requests
- `api.delete()` - DELETE requests

All these functions:
- Are type-safe (TypeScript generics)
- Handle response unwrapping automatically
- Use the configured axios instance

---

## 💡 Real-World Example

### Complete Flow: User Login

```typescript
// 1. Component (UI)
function LoginForm() {
  const loginMutation = useLogin();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginMutation.mutateAsync({
      email: 'user@example.com',
      password: 'password123'
    });
  };
}

// 2. Hook (Business Logic)
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials), // ← Calls API
    onSuccess: (data) => {
      // Update state, redirect, etc.
    }
  });
};

// 3. API Function (Service Layer)
export const authApi = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials); // ← Uses helper
  }
};

// 4. Helper (HTTP Client)
export const api = {
  post: (url, data) => {
    return apiClient.post(url, data); // ← Uses axios
  }
};

// 5. Axios Instance (Actual HTTP Request)
// - Adds token via interceptor
// - Makes POST request to backend
// - Returns response
```

---

## 🎓 Key Takeaways

1. **`api/` folder = Service layer** for backend communication
2. **Each file = One domain** (auth, users, products, etc.)
3. **Functions = Specific endpoints** (login, signup, etc.)
4. **Type-safe = TypeScript ensures correctness**
5. **Automatic = Token handling, error handling built-in**
6. **Scalable = Easy to add new endpoints**

---

## 🚀 Next Steps

1. **Update endpoints** in `auth.ts` to match your backend
2. **Add more API files** for other features (users, products, etc.)
3. **Use in hooks** to create reusable data fetching logic
4. **Use in components** via hooks for clean, maintainable code

