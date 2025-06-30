"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { Badge } from "../ui/badge"
import { ChoreList } from "../tasks/chore-list"
import { QuestList } from "../quests/quest-list"
import { RewardShop } from "../rewards/reward-shop"
import { AvatarPetPanel } from "../avatar/avatar-pet-panel"
import { useAuth } from "../providers/auth-provider"
import { Trophy, Star, Flame, Coins, Gift, Sparkles } from "lucide-react"

export function ChildDashboard() {
  const { user, signOut } = useAuth()
  const [activeView, setActiveView] = useState("today")

  // Mock child data
  const childData = {
    name: "Emma",
    level: 8,
    xp: 1250,
    xpToNext: 1500,
    superCoins: 156,
    streak: 7,
    badges: ["Early Bird", "Streak Master", "Quest Hero"],
    avatar: "👧",
    pet: "🐱",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{childData.avatar}</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Hi, {childData.name}! 🌟
                </h1>
                <p className="text-sm text-gray-500">Ready for today's adventures?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                <Coins className="h-4 w-4 text-yellow-600" />
                <span className="font-bold text-yellow-800">{childData.superCoins}</span>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Level</p>
                  <p className="text-2xl font-bold">{childData.level}</p>
                </div>
                <Star className="h-8 w-8 opacity-80" />
              </div>
              <div className="mt-2">
                <Progress value={(childData.xp / childData.xpToNext) * 100} className="h-2 bg-white/20" />
                <p className="text-xs mt-1 opacity-90">
                  {childData.xp}/{childData.xpToNext} XP
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Streak</p>
                  <p className="text-2xl font-bold">{childData.streak} days</p>
                </div>
                <Flame className="h-8 w-8 opacity-80" />
              </div>
              <p className="text-xs mt-2 opacity-90">Keep it up! 🔥</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Super Coins</p>
                  <p className="text-2xl font-bold">{childData.superCoins}</p>
                </div>
                <Coins className="h-8 w-8 opacity-80" />
              </div>
              <p className="text-xs mt-2 opacity-90">Spend wisely! 💰</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Badges</p>
                  <p className="text-2xl font-bold">{childData.badges.length}</p>
                </div>
                <Trophy className="h-8 w-8 opacity-80" />
              </div>
              <p className="text-xs mt-2 opacity-90">Awesome work! 🏆</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={activeView === "today" ? "default" : "outline"}
            onClick={() => setActiveView("today")}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Today's Tasks
          </Button>
          <Button
            variant={activeView === "quests" ? "default" : "outline"}
            onClick={() => setActiveView("quests")}
            className="flex items-center gap-2"
          >
            <Star className="h-4 w-4" />
            Epic Quests
          </Button>
          <Button
            variant={activeView === "shop" ? "default" : "outline"}
            onClick={() => setActiveView("shop")}
            className="flex items-center gap-2"
          >
            <Gift className="h-4 w-4" />
            Reward Shop
          </Button>
          <Button
            variant={activeView === "avatar" ? "default" : "outline"}
            onClick={() => setActiveView("avatar")}
            className="flex items-center gap-2"
          >
            <span className="text-sm">{childData.pet}</span>
            My Avatar
          </Button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeView === "today" && <ChoreList />}
            {activeView === "quests" && <QuestList />}
            {activeView === "shop" && <RewardShop />}
            {activeView === "avatar" && <AvatarPetPanel />}
          </div>

          <div className="space-y-6">
            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Your Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {childData.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="w-full justify-start">
                    🏆 {badge}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            {/* Pet Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{childData.pet}</span>
                  My Pet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl">{childData.pet}</div>
                  <p className="text-sm text-muted-foreground">Fluffy is happy!</p>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground">Happiness: 85%</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Chores Completed</span>
                  <span className="font-bold">4/6</span>
                </div>
                <Progress value={67} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Coins Earned Today</span>
                  <span className="font-bold text-yellow-600">+25 🪙</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
