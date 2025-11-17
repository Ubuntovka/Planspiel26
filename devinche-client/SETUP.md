# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and set your API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Installed Packages

The following packages have been added to your project:

- `@tanstack/react-query` - Server state management
- `@tanstack/react-query-devtools` - Development tools for React Query
- `zustand` - Global state management
- `axios` - HTTP client

## Project Structure

```
src/
├── api/                    # API endpoint functions
│   ├── auth.ts            # Authentication API
│   └── index.ts           # Exports
├── components/            # React components
│   └── auth/              # Auth components
│       ├── login-form.tsx
│       ├── signup-form.tsx
│       ├── protected-route.tsx
│       ├── user-profile.tsx
│       └── index.ts
├── hooks/                 # Custom React hooks
│   ├── use-auth.ts        # Authentication hooks
│   ├── use-api.ts         # Generic API hooks
│   └── index.ts
├── lib/                   # Core libraries
│   ├── api-client.ts      # Axios instance & fetcher
│   └── query-client.ts    # TanStack Query config
├── providers/             # React providers
│   └── query-provider.tsx # TanStack Query provider
├── store/                 # Zustand stores
│   └── auth-store.ts      # Auth state store
├── types/                 # TypeScript types
│   ├── auth.ts
│   └── api.ts
└── utils/                 # Utilities
    ├── constants.ts
    ├── errors.ts
    ├── format.ts
    └── validation.ts
```

## Key Features

### 1. Authentication
- Login/Signup forms
- Protected routes
- Token management
- User state persistence

### 2. API Client
- Automatic token injection
- Error handling
- Type-safe requests
- Interceptors for auth

### 3. State Management
- Zustand for global state (auth)
- TanStack Query for server state
- Automatic caching and synchronization

### 4. Type Safety
- Full TypeScript support
- Type-safe API calls
- Type-safe hooks

## Next Steps

1. **Update API endpoints** in `src/api/auth.ts` to match your backend
2. **Customize authentication flow** in `src/hooks/use-auth.ts`
3. **Add more API endpoints** following the pattern in `src/api/`
4. **Create new hooks** for your features
5. **Add more protected routes** as needed

## Troubleshooting

### TypeScript Errors
If you see TypeScript errors about missing modules, make sure you've run `npm install`.

### API Connection Issues
- Check your `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure your backend API is running
- Check CORS settings on your backend

### Authentication Not Working
- Verify your API endpoints match the backend
- Check browser console for errors
- Ensure tokens are being stored in localStorage

## Documentation

- See [BOILERPLATE.md](./BOILERPLATE.md) for detailed documentation
- See [README.md](./README.md) for project overview

