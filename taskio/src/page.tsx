"use client"

import { useState } from "react"
import { useAuth } from "./components/providers/auth-provider"
import { ParentDashboard } from "./components/dashboards/parent-dashboard"
import { ChildDashboard } from "./components/dashboards/child-dashboard"
import { RewardShop } from "./components/rewards/reward-shop"
import { QuestList } from "./components/quests/quest-list-new"
import { CreateQuest } from "./components/quests/create-quest"
import { FamilyManagement } from "./components/family/family-management"
import { NotificationBell } from "./components/notifications/notification-bell"
import { AuthPage } from "./components/auth/auth-page"
import { LoadingSpinner } from "./components/ui/loading-spinner"
import { Button } from "./components/ui/button"
import { Home, Gift, Sword, Users, LogOut } from "lucide-react"

export default function HomePage() {
  const { user, userRole, loading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rewards' | 'quests' | 'family'>('dashboard')

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
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">
                {userRole === 'parent' ? 'Parent Hub' : 'Kid Zone'} 🏠
              </h1>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 ${
                    activeTab === 'dashboard' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  onClick={() => setActiveTab('quests')}
                  className={`flex items-center gap-2 ${
                    activeTab === 'quests' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Sword className="h-4 w-4" />
                  Quests
                </Button>
                <Button
                  onClick={() => setActiveTab('rewards')}
                  className={`flex items-center gap-2 ${
                    activeTab === 'rewards' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Gift className="h-4 w-4" />
                  Rewards Shop
                </Button>
                {userRole === 'parent' && (
                  <Button
                    onClick={() => setActiveTab('family')}
                    className={`flex items-center gap-2 ${
                      activeTab === 'family' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Family
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button
                onClick={signOut}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 bg-transparent hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {activeTab === 'dashboard' ? (
          userRole === "parent" ? <ParentDashboard /> : <ChildDashboard />
        ) : activeTab === 'quests' ? (
          userRole === "parent" ? (
            <div className="space-y-6">
              <CreateQuest />
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">Manage Quests</h2>
                <QuestList />
              </div>
            </div>
          ) : (
            <QuestList />
          )
        ) : activeTab === 'family' ? (
          <FamilyManagement />
        ) : (
          <RewardShop />
        )}
      </div>
    </div>
  )
}
