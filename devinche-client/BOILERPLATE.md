# Devinche App - Complete Boilerplate Documentation

## 🚀 Overview

This is a production-ready Next.js boilerplate with:
- **TanStack Query** for server state management
- **Zustand** for global client state (authentication)
- **Custom API Client** with automatic token handling
- **TypeScript** for type safety
- **Scalable folder structure**

## 📦 Installation

```bash
npm install
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
```

## 📁 Project Structure

```
src/
├── api/              # API endpoint functions
│   └── auth.ts       # Authentication API calls
├── components/       # React components
│   └── auth/         # Authentication components
├── hooks/            # Custom React hooks
│   ├── use-auth.ts   # Authentication hooks
│   └── use-api.ts    # Generic API hooks
├── lib/              # Core libraries
│   ├── api-client.ts # Axios instance & fetcher
│   └── query-client.ts # TanStack Query config
├── providers/        # React context providers
│   └── query-provider.tsx # TanStack Query provider
├── store/            # Zustand stores
│   └── auth-store.ts # Authentication state
├── types/            # TypeScript types
│   ├── auth.ts       # Auth-related types
│   └── api.ts        # API-related types
└── utils/            # Utility functions
    ├── constants.ts  # App constants
    └── errors.ts     # Error handling utilities
```

## 🔐 Authentication

### Using Authentication Hooks

```typescript
import { useLogin, useSignup, useLogout, useIsAuthenticated } from '@/hooks/use-auth';

function MyComponent() {
  const loginMutation = useLogin();
  const { isAuthenticated, user } = useIsAuthenticated();

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({
        email: 'user@example.com',
        password: 'password123'
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.email}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Protected Routes

```typescript
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

## 🌐 Making API Calls

### Using Custom Hooks

```typescript
import { useApiQuery, useApiMutation } from '@/hooks/use-api';

// GET request
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useApiQuery(
    ['user', userId],
    `/users/${userId}`
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.name}</div>;
}

// POST/PUT/DELETE request
function CreateUser() {
  const createMutation = useApiMutation<User, CreateUserDto>(
    '/users',
    'POST'
  );

  const handleSubmit = async (formData: CreateUserDto) => {
    try {
      const newUser = await createMutation.mutateAsync(formData);
      console.log('User created:', newUser);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  return <button onClick={() => handleSubmit({ name: 'John' })}>Create</button>;
}
```

### Direct API Calls

```typescript
import { api } from '@/lib/api-client';

// In a server component or API route
const user = await api.get<User>('/users/me');
const newUser = await api.post<User, CreateUserDto>('/users', userData);
```

## 📊 State Management

### Authentication State (Zustand)

```typescript
import { useAuthStore } from '@/store/auth-store';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  return (
    <div>
      {isAuthenticated && <p>Logged in as {user?.email}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Server State (TanStack Query)

TanStack Query automatically manages server state, caching, and synchronization. Use the hooks provided:

- `useApiQuery` - For GET requests
- `useApiMutation` - For POST/PUT/DELETE requests
- `useQuery`, `useMutation` - Direct TanStack Query hooks

## 🎨 Adding New API Endpoints

1. **Create API function** in `src/api/`:

```typescript
// src/api/users.ts
import { api } from '@/lib/api-client';
import type { User } from '@/types/auth';

export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: CreateUserDto) => api.post<User>('/users', data),
  update: (id: string, data: UpdateUserDto) => api.put<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};
```

2. **Create custom hook** in `src/hooks/`:

```typescript
// src/hooks/use-users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

## 🛠️ Error Handling

```typescript
import { handleApiError, ApiException } from '@/utils/errors';

try {
  await api.post('/endpoint', data);
} catch (error) {
  if (error instanceof ApiException) {
    console.error('API Error:', error.getFirstError());
    console.error('All errors:', error.getAllErrors());
  } else {
    const message = handleApiError(error);
    console.error('Error:', message);
  }
}
```

## 🔄 Query Invalidation

```typescript
import { useInvalidateQueries } from '@/hooks/use-api';

function MyComponent() {
  const { invalidate } = useInvalidateQueries();

  const handleUpdate = async () => {
    await updateMutation.mutateAsync(data);
    invalidate(['users']); // Refetch users after update
  };
}
```

## 📝 TypeScript Types

All types are defined in `src/types/`:
- `auth.ts` - User, AuthResponse, LoginCredentials, etc.
- `api.ts` - ApiResponse, ApiError, PaginatedResponse, etc.

## 🚦 Routes

Routes are defined in `src/utils/constants.ts`:

```typescript
import { ROUTES } from '@/utils/constants';

// Use in your code
router.push(ROUTES.DASHBOARD);
```

## 🎯 Best Practices

1. **Always use TypeScript types** for API responses
2. **Use custom hooks** instead of direct API calls in components
3. **Handle loading and error states** in your components
4. **Invalidate queries** after mutations to keep data fresh
5. **Use ProtectedRoute** for authenticated pages
6. **Keep API functions** in `src/api/` directory
7. **Keep business logic** in hooks, not components

## 🔍 Development Tools

- **React Query Devtools**: Available in development mode (bottom-left corner)
- **TypeScript**: Full type checking
- **ESLint**: Code quality checks

## 📚 Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [Next.js Docs](https://nextjs.org/docs)
- [Axios Docs](https://axios-http.com/)

