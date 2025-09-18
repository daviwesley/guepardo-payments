'use client'

import { useRequireAuthOptimized } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Lock, 
  Key, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Activity,
  Calendar,
  FileText,
  Settings
} from 'lucide-react'

export default function DashboardPage() {
  const { shouldRender, user } = useRequireAuthOptimized()

  // Se não deve renderizar (não autenticado ou redirecionando), não mostrar nada
  if (!shouldRender) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.username || 'User'}! Here&apos;s your overview.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Shield className="w-3 h-3 mr-1" />
          Protected Area
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.7%</div>
            <p className="text-xs text-muted-foreground">
              +4.75% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Security Status */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle>Security Status</CardTitle>
            </div>
            <CardDescription>
              Your account security and authentication status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">Authentication Active</p>
                  <p className="text-sm text-green-700 dark:text-green-300">AWS Cognito JWT Token Valid</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Secure
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-background border rounded-lg">
                <Key className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Session Active</p>
                <p className="text-xs text-muted-foreground">Valid for 24h</p>
              </div>
              <div className="text-center p-4 bg-background border rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Role: User</p>
                <p className="text-xs text-muted-foreground">Standard access</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="ghost">
              <FileText className="mr-2 h-4 w-4" />
              View Reports
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest actions and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Logged in successfully", time: "2 minutes ago", type: "success" },
              { action: "Updated profile settings", time: "1 hour ago", type: "info" },
              { action: "Downloaded monthly report", time: "3 hours ago", type: "info" },
              { action: "Password changed", time: "2 days ago", type: "success" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <span className="text-sm">{activity.action}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}