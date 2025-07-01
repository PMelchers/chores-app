"use client"

import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useAuth } from "../providers/auth-provider"
import {
  Crown,
  Star,
  Trophy,
  LogOut,
  Settings,
  Bell,
  Shield,
  Sparkles,
  Heart,
  CheckSquare,
  Zap,
  Gift,
  History,
  Users,
  User,
} from "lucide-react"

interface HeaderProps {
  title: string
  subtitle?: string
  userRole?: "parent" | "child"
  currentPage?: string
  onPageChange?: (page: string) => void
  stats?: {
    points?: number
    completedTasks?: number
    totalTasks?: number
  }
}

export function Header({ title, subtitle, userRole, currentPage, onPageChange, stats }: HeaderProps) {
  const { user, signOut } = useAuth()

  const getRoleIcon = () => {
    if (userRole === "parent") {
      return <Shield className="h-8 w-8 text-white" />
    }
    return <Crown className="h-8 w-8 text-white" />
  }

  const getRoleGradient = () => {
    if (userRole === "parent") {
      return "from-blue-500 to-purple-600"
    }
    return "from-yellow-400 to-orange-500"
  }

  const getNavigationPages = () => {
    if (userRole === "parent") {
      return [
        { id: "dashboard", label: "Dashboard", icon: Shield },
        { id: "tasks", label: "Tasks", icon: CheckSquare },
        { id: "quests", label: "Quests", icon: Zap },
        { id: "rewards", label: "Rewards", icon: Gift },
        { id: "history", label: "History", icon: History },
        { id: "family", label: "Family", icon: Users },
      ]
    } else {
      return [
        { id: "dashboard", label: "Dashboard", icon: Crown },
        { id: "tasks", label: "Tasks", icon: CheckSquare },
        { id: "quests", label: "Quests", icon: Zap },
        { id: "rewards", label: "Shop", icon: Gift },
        { id: "history", label: "History", icon: History },
      ]
    }
  }

  const navigationPages = getNavigationPages()

  return (
    <div className="relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Star className="absolute top-4 left-1/4 w-4 h-4 text-yellow-400/30 animate-float" />
        <Trophy className="absolute top-8 right-1/3 w-5 h-5 text-yellow-500/30 animate-float animation-delay-1000" />
        <Heart className="absolute top-6 right-1/4 w-4 h-4 text-red-400/30 animate-pulse" />
        <Sparkles className="absolute top-2 left-1/3 w-4 h-4 text-purple-400/30 animate-float animation-delay-2000" />
      </div>

      {/* Header Content */}
      <div className="relative z-10 p-6">
        {/* Top Row - Title and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`bg-gradient-to-r ${getRoleGradient()} p-4 rounded-2xl shadow-2xl`}>{getRoleIcon()}</div>
              {stats?.completedTasks && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                  {stats.completedTasks}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{title}</h1>
              {subtitle && <p className="text-purple-200 text-lg">{subtitle}</p>}
              {user && (
                <p className="text-purple-300 text-sm mt-1">
                  Welcome back, {user.email?.split("@")[0]}! {userRole === "parent" ? "👑" : "🌟"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats display */}
            {stats && (
              <div className="hidden md:flex items-center gap-3">
                {stats.points !== undefined && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-4 py-2 text-sm">
                    <Star className="h-4 w-4 mr-1" />
                    {stats.points} pts
                  </Badge>
                )}
                {stats.totalTasks !== undefined && (
                  <Badge className="bg-white/20 text-white border border-white/30 px-4 py-2 text-sm">
                    <Trophy className="h-4 w-4 mr-1" />
                    {stats.completedTasks || 0}/{stats.totalTasks}
                  </Badge>
                )}
              </div>
            )}

            {/* Action buttons */}
            <Button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
              <Bell className="h-4 w-4" />
            </Button>

            <Button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
              <Settings className="h-4 w-4" />
            </Button>

            <Button
              onClick={signOut}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {navigationPages.map((page) => {
            const Icon = page.icon
            const isActive = currentPage === page.id

            return (
              <Button
                key={page.id}
                onClick={() => onPageChange?.(page.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
                  ${
                    isActive
                      ? "bg-white text-purple-600 shadow-lg transform scale-105"
                      : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                  }
                  backdrop-blur-sm border border-white/20
                `}
              >
                <Icon className="h-4 w-4" />
                {page.label}
                {isActive && <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />}
              </Button>
            )
          })}
        </div>

        {/* Mobile Navigation Indicator */}
        <div className="md:hidden mt-4 flex justify-center">
          <div className="flex gap-1">
            {navigationPages.map((page) => (
              <div
                key={page.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentPage === page.id ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
