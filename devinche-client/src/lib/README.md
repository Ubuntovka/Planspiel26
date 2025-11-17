# Library Documentation

## API Client (`api-client.ts`)

The API client provides a centralized way to make HTTP requests with automatic token injection and error handling.

### Features:
- Automatic Bearer token injection from localStorage
- Global error handling (401 redirects, error transformation)
- Type-safe API calls
- Custom fetcher for TanStack Query

### Usage:

```typescript
import { api } from '@/lib/api-client';

// GET request
const data = await api.get<User>('/users/me');

// POST request
const newUser = await api.post<User, CreateUserDto>('/users', { name: 'John', email: 'john@example.com' });

// PUT request
const updatedUser = await api.put<User, UpdateUserDto>('/users/1', { name: 'Jane' });

// DELETE request
await api.delete('/users/1');
```

## Query Client (`query-client.ts`)

Configured TanStack Query client with sensible defaults:
- 5-minute stale time
- 10-minute cache time
- Automatic retry with exponential backoff
- Refetch on reconnect

