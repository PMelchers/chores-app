"use client"

import { useState } from "react"
import { useAuth } from "./components/providers/auth-provider"
import { useTasks } from "./hooks/useTasks"
import { ParentDashboard } from "./components/dashboards/parent-dashboard"
import { ChildDashboard } from "./components/dashboards/child-dashboard"
import { AuthPage } from "./components/auth/auth-page"
import { LoadingSpinner } from "./components/ui/loading-spinner"
import { Header } from "./components/layout/header"
import { PageLayout } from "./components/layout/page-layout"
import { FamilyAdmin } from "./components/family/family-admin"
import { TaskCreator } from "./components/tasks/task-creator"
import { ChoreList } from "./components/tasks/chore-list"
import { RewardShop } from "./components/rewards/reward-shop"
import { HistoryLog } from "./components/history/history-log"

export default function HomePage() {
  const { user, userRole, loading } = useAuth()
  const { tasks } = useTasks()
  const [currentPage, setCurrentPage] = useState("dashboard")

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

  // Calculate stats for header
  const completedTasks = tasks.filter(task => task.completed)
  const totalPoints = completedTasks.reduce((sum, task) => sum + (task.points || 0), 0)
  
  const stats = {
    points: totalPoints,
    completedTasks: completedTasks.length,
    totalTasks: tasks.length
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return userRole === "parent" ? "Parent Dashboard" : "Child Dashboard"
      case "tasks":
        return "Task Management"
      case "quests":
        return "Quest Creator"
      case "rewards":
        return userRole === "parent" ? "Reward Management" : "Reward Shop"
      case "family":
        return "Family Management"
      case "history":
        return "Activity History"
      default:
        return "Dashboard"
    }
  }

  const getPageSubtitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Your family's command center"
      case "tasks":
        return "Manage daily tasks and chores"
      case "quests":
        return "Create epic adventures"
      case "rewards":
        return userRole === "parent" ? "Set up rewards" : "Spend your hard-earned points"
      case "family":
        return "Manage family members"
      case "history":
        return "Track progress and achievements"
      default:
        return "Welcome to your family dashboard"
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return userRole === "parent" ? <ParentDashboard /> : <ChildDashboard />
      case "tasks":
        return userRole === "parent" ? <TaskCreator /> : <ChoreList />
      case "quests":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Quest System</h2>
            <p className="text-gray-600">Coming soon! Epic adventures and challenges await.</p>
          </div>
        )
      case "rewards":
        return <RewardShop />
      case "family":
        return <FamilyAdmin />
      case "history":
        return <HistoryLog />
      default:
        return userRole === "parent" ? <ParentDashboard /> : <ChildDashboard />
    }
  }

  return (
    <div className="min-h-screen">
      <PageLayout>
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <Header
            title={getPageTitle()}
            subtitle={getPageSubtitle()}
            userRole={userRole as "parent" | "child"}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            stats={stats}
          />
        </div>
        <div className="flex-1">
          {renderCurrentPage()}
        </div>
      </PageLayout>
    </div>
  )
}
