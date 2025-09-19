'use client'

import { usePixStore, useAuthStore } from '@/lib/stores'
import { useAuth } from '@/lib/stores/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StoreExample() {
  // Using direct store access
  const pixData = usePixStore((state) => state.pixData)
  const setPixData = usePixStore((state) => state.setPixData)
  const dateRange = usePixStore((state) => state.dateRange)
  const setDateRange = usePixStore((state) => state.setDateRange)

  // Using convenience hooks
  const { user, isAuthenticated, setUser, logout } = useAuth()

  // Example actions
  const handleUpdateDateRange = () => {
    setDateRange({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    })
  }

  const handleMockLogin = () => {
    setUser({
      email: 'user@example.com',
      username: 'testuser',
      sub: '123-456-789',
      accessToken: 'mock-token',
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Zustand Store Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auth State */}
          <div>
            <h3 className="font-semibold">Auth State:</h3>
            <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
            {user && <p>User: {user.email}</p>}
            <div className="flex gap-2 mt-2">
              <Button onClick={handleMockLogin} disabled={isAuthenticated}>
                Mock Login
              </Button>
              <Button onClick={logout} disabled={!isAuthenticated} variant="outline">
                Logout
              </Button>
            </div>
          </div>

          {/* PIX State */}
          <div>
            <h3 className="font-semibold">PIX State:</h3>
            <p>PIX Data Length: {pixData.length}</p>
            <p>
              Date Range: {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}
            </p>
            <Button onClick={handleUpdateDateRange}>Update Date Range</Button>
          </div>

          {/* Store Actions Demo */}
          <div>
            <h3 className="font-semibold">Available Actions:</h3>
            <ul className="text-sm text-muted-foreground list-disc pl-5">
              <li>Auth: setUser, clearUser, setLoading, setError, logout</li>
              <li>PIX: setPixData, setTransactions, setDetails, setDateRange</li>
              <li>Filters: setSearchTerm, setStatusFilter, clearFilters</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}