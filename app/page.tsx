'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks'
import { ArrowRight, Sidebar, Users, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Expo Learning
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A modern Next.js application with AWS Cognito authentication, shadcn/ui components, and a beautiful sidebar navigation.
        </p>
        {!isAuthenticated && (
          <div className="pt-4">
            <Button asChild size="lg">
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sidebar className="h-5 w-5 text-primary" />
              <CardTitle>Modern Sidebar</CardTitle>
            </div>
            <CardDescription>
              Beautiful collapsible sidebar with navigation, user menu, and project organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Built with shadcn/ui sidebar component, featuring responsive design and smooth animations.
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>AWS Cognito Auth</CardTitle>
            </div>
            <CardDescription>
              Secure authentication with AWS Cognito, JWT tokens, and protected routes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Enterprise-grade security with user management, password policies, and session handling.
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>shadcn/ui</CardTitle>
            </div>
            <CardDescription>
              Beautiful, accessible components built with Radix UI and Tailwind CSS.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              High-quality components with consistent design system and excellent developer experience.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {isAuthenticated && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Link href="/dashboard" className="flex items-center justify-between w-full">
                    View Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardTitle>
                <CardDescription>
                  Access your personal dashboard with analytics and insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Link href="/components" className="flex items-center justify-between w-full">
                    Explore Components
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardTitle>
                <CardDescription>
                  Browse through all available shadcn/ui components and examples.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      )}

      {/* Development Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-blue-900 dark:text-blue-100">Development Status</CardTitle>
          </div>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            This application is fully configured for GitHub Pages deployment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>✅ Next.js 14+ with App Router</li>
            <li>✅ TypeScript for type safety</li>
            <li>✅ Tailwind CSS for styling</li>
            <li>✅ shadcn/ui component library</li>
            <li>✅ AWS Cognito authentication</li>
            <li>✅ Responsive sidebar navigation</li>
            <li>✅ Static export for GitHub Pages</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}