# Devinche Client

A production-ready Next.js application with complete authentication, state management, and API integration.

## 🚀 Features

- ✅ **TanStack Query** - Powerful server state management
- ✅ **Zustand** - Lightweight global state management
- ✅ **Custom API Client** - Easy-to-use fetcher with automatic token handling
- ✅ **Authentication** - Complete login/signup flow with protected routes
- ✅ **TypeScript** - Full type safety
- ✅ **Scalable Architecture** - Well-organized folder structure
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Form Validation** - Built-in validation utilities

## 📦 Installation

```bash
npm install
```

## 🔧 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Update `.env.local` with your API URL:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── api/              # API endpoint functions
├── components/       # React components
│   └── auth/         # Authentication components
├── hooks/            # Custom React hooks
├── lib/              # Core libraries (API client, Query client)
├── providers/        # React context providers
├── store/            # Zustand stores
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## 🎯 Quick Start

### Authentication

```typescript
import { useLogin, useIsAuthenticated } from '@/hooks/use-auth';

function MyComponent() {
  const loginMutation = useLogin();
  const { isAuthenticated, user } = useIsAuthenticated();

  const handleLogin = async () => {
    await loginMutation.mutateAsync({
      email: 'user@example.com',
      password: 'password123'
    });
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

### Making API Calls

```typescript
import { useApiQuery, useApiMutation } from '@/hooks/use-api';

// GET request
const { data, isLoading } = useApiQuery(['users'], '/users');

// POST request
const createMutation = useApiMutation('/users', 'POST');
await createMutation.mutateAsync({ name: 'John' });
```

### Protected Routes

```typescript
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

## 📚 Documentation

For detailed documentation, see [BOILERPLATE.md](./BOILERPLATE.md)

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. User logs in/signs up
2. Token is stored in localStorage and Zustand store
3. Token is automatically added to all API requests
4. Protected routes check authentication status
5. On logout, token is cleared and user is redirected

## 🌐 API Integration

The API client automatically:
- Adds Bearer token to requests
- Handles 401 errors (redirects to login)
- Transforms errors to a consistent format
- Provides type-safe API calls

## 📝 Environment Variables

- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `NODE_ENV` - Environment (development/production)

## 🎨 Styling

This project uses Tailwind CSS. All components are styled with Tailwind utility classes and support dark mode.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT
