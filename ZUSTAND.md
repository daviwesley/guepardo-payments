# Zustand Global State Management

This project uses Zustand for global state management, configured for Next.js with proper hydration handling and TypeScript support.

## 🏗️ **Store Architecture**

### **Auth Store** (`/lib/stores/auth-store.ts`)
Manages authentication state with persistence:

```typescript
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
```

**Actions:**
- `setUser(user)` - Set authenticated user
- `clearUser()` - Clear user data
- `setLoading(loading)` - Set loading state
- `setError(error)` - Set error message
- `logout()` - Complete logout

### **PIX Store** (`/lib/stores/pix-store.ts`)
Manages PIX dashboard data and UI state:

```typescript
interface PixState {
  pixData: PixBankData[]
  transactions: PixTransaction[]
  details: PixDetails | null
  dateRange: DateRange
  selectedBank: string | null
  isLoading: boolean
  error: string | null
  searchTerm: string
  statusFilter: string | null
}
```

## 🚀 **Usage Examples**

### **Basic Store Usage**

```typescript
'use client'

import { useAuthStore, usePixStore } from '@/lib/stores'

function MyComponent() {
  // Select specific state
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
  // Select actions
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)
  
  // PIX store
  const pixData = usePixStore((state) => state.pixData)
  const setDateRange = usePixStore((state) => state.setDateRange)
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.email}</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  )
}
```

### **Using Convenience Hooks**

```typescript
import { useAuth } from '@/lib/stores/hooks'

function AuthComponent() {
  const { user, isAuthenticated, setUser, logout } = useAuth()
  
  // All auth state and actions in one hook
}
```

### **Optimized Selectors**

```typescript
// ✅ Good - Only re-renders when user changes
const user = useAuthStore((state) => state.user)

// ❌ Bad - Re-renders on any auth state change
const authStore = useAuthStore()
```

## 🔧 **Store Features**

### **Persistence**
Auth store automatically persists user data to localStorage:

```typescript
// Persisted fields
{
  user: state.user,
  isAuthenticated: state.isAuthenticated,
}
```

### **DevTools Integration**
All stores have Redux DevTools integration for debugging.

### **Immer Integration**
State updates use Immer for immutable updates:

```typescript
setUser: (user) =>
  set((state) => {
    state.user = user
    state.isAuthenticated = true
    state.error = null
  }),
```

## 📱 **Next.js Integration**

### **Hydration Safety**
Uses `ClientOnly` component to prevent hydration mismatches:

```typescript
import { ClientOnly } from '@/components/client-only'

function MyComponent() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      <ComponentUsingStores />
    </ClientOnly>
  )
}
```

### **Store Provider**
Wrapped in root layout for global access:

```typescript
// app/layout.tsx
<StoreProvider>
  <YourApp />
</StoreProvider>
```

## 🎯 **Best Practices**

### **1. Selective State Access**
```typescript
// ✅ Good - Selective subscription
const userName = useAuthStore((state) => state.user?.name)

// ❌ Bad - Full store subscription
const authStore = useAuthStore()
const userName = authStore.user?.name
```

### **2. Action Organization**
```typescript
// ✅ Good - Separate concerns
const setUser = useAuthStore((state) => state.setUser)
const clearUser = useAuthStore((state) => state.clearUser)

// Use actions directly
const handleLogin = () => setUser(userData)
```

### **3. Error Handling**
```typescript
const { error, setError } = useAuth()

const handleApiCall = async () => {
  try {
    const data = await apiCall()
    // Handle success
  } catch (err) {
    setError(err.message)
  }
}
```

## 🔄 **Migration from Context**

To migrate from React Context to Zustand:

1. **Replace Context Usage:**
```typescript
// Before (Context)
const { user, login } = useAuth()

// After (Zustand)
const user = useAuthStore((state) => state.user)
const setUser = useAuthStore((state) => state.setUser)
```

2. **Update Components:**
```typescript
// Before
<AuthContext.Provider value={authValue}>

// After
<StoreProvider>
```

## 📊 **Performance Benefits**

- **Selective Re-renders**: Only components using changed state re-render
- **No Provider Hell**: Direct store access without nested providers
- **Bundle Size**: Smaller than Redux/Context solutions
- **DevTools**: Built-in debugging capabilities
- **Persistence**: Automatic localStorage sync for auth

## 🛠️ **Available Stores**

- `useAuthStore` - Authentication state
- `usePixStore` - PIX dashboard data
- Convenience hooks in `/lib/stores/hooks.ts`

Import from: `@/lib/stores`