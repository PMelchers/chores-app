"use client"

import { useAuth } from "./components/providers/auth-provider"
import { ParentDashboard } from "./components/dashboards/parent-dashboard"
import { ChildDashboard } from "./components/dashboards/child-dashboard"
import { AuthPage } from "./components/auth/auth-page"
import { LoadingSpinner } from "./components/ui/loading-spinner"

export default function HomePage() {
  const { user, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {userRole === "parent" ? <ParentDashboard /> : <ChildDashboard />}
    </div>
  )
}
