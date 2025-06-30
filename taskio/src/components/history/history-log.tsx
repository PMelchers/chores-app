"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { BarChart3, CalendarIcon, Trophy, Coins, Star, TrendingUp } from "lucide-react"
import { format, subDays, startOfWeek, endOfWeek } from "date-fns"

type HistoryEntry = {
  id: string
  childName: string
  action: "task_completed" | "quest_completed" | "reward_redeemed" | "badge_earned"
  description: string
  coinsEarned?: number
  coinsSpent?: number
  xpEarned?: number
  timestamp: Date
  approved: boolean
}

export function HistoryLog() {
  const [selectedChild, setSelectedChild] = useState("all")
  const [selectedAction, setSelectedAction] = useState("all")
  const [dateRange, setDateRange] = useState("week")
  const [selectedDate, setSelectedDate] = useState<Date>()

  const [historyEntries] = useState<HistoryEntry[]>([
    {
      id: "1",
      childName: "Emma",
      action: "task_completed",
      description: 'Completed "Make Bed"',
      coinsEarned: 5,
      xpEarned: 10,
      timestamp: new Date(),
      approved: true,
    },
    {
      id: "2",
      childName: "Jake",
      action: "quest_completed",
      description: 'Completed "Math Master Challenge"',
      coinsEarned: 50,
      xpEarned: 100,
      timestamp: subDays(new Date(), 1),
      approved: true,
    },
    {
      id: "3",
      childName: "Sophie",
      action: "reward_redeemed",
      description: 'Redeemed "Movie Night"',
      coinsSpent: 50,
      timestamp: subDays(new Date(), 1),
      approved: true,
    },
    {
      id: "4",
      childName: "Emma",
      action: "badge_earned",
      description: 'Earned "Early Bird" badge',
      timestamp: subDays(new Date(), 2),
      approved: true,
    },
    {
      id: "5",
      childName: "Jake",
      action: "task_completed",
      description: 'Completed "Clean Room"',
      coinsEarned: 15,
      xpEarned: 25,
      timestamp: subDays(new Date(), 2),
      approved: false,
    },
    {
      id: "6",
      childName: "Sophie",
      action: "task_completed",
      description: 'Completed "Do Homework"',
      coinsEarned: 20,
      xpEarned: 30,
      timestamp: subDays(new Date(), 3),
      approved: true,
    },
    {
      id: "7",
      childName: "Emma",
      action: "reward_redeemed",
      description: 'Redeemed "Extra Screen Time"',
      coinsSpent: 25,
      timestamp: subDays(new Date(), 4),
      approved: true,
    },
    {
      id: "8",
      childName: "Jake",
      action: "badge_earned",
      description: 'Earned "Quest Hero" badge',
      timestamp: subDays(new Date(), 5),
      approved: true,
    },
  ])

  const getActionIcon = (action: string) => {
    const icons = {
      task_completed: "✅",
      quest_completed: "🏆",
      reward_redeemed: "🎁",
      badge_earned: "🏅",
    }
    return icons[action as keyof typeof icons] || "📝"
  }

  const getActionColor = (action: string) => {
    const colors = {
      task_completed: "bg-green-100 text-green-800",
      quest_completed: "bg-purple-100 text-purple-800",
      reward_redeemed: "bg-blue-100 text-blue-800",
      badge_earned: "bg-yellow-100 text-yellow-800",
    }
    return colors[action as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  // Filter entries
  const filteredEntries = historyEntries.filter((entry) => {
    const matchesChild = selectedChild === "all" || entry.childName === selectedChild
    const matchesAction = selectedAction === "all" || entry.action === selectedAction

    let matchesDate = true
    if (dateRange === "today") {
      matchesDate = entry.timestamp.toDateString() === new Date().toDateString()
    } else if (dateRange === "week") {
      const weekStart = startOfWeek(new Date())
      const weekEnd = endOfWeek(new Date())
      matchesDate = entry.timestamp >= weekStart && entry.timestamp <= weekEnd
    } else if (dateRange === "custom" && selectedDate) {
      matchesDate = entry.timestamp.toDateString() === selectedDate.toDateString()
    }

    return matchesChild && matchesAction && matchesDate
  })

  // Sort by most recent
  filteredEntries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  // Calculate stats
  const totalCoinsEarned = filteredEntries.reduce((sum, entry) => sum + (entry.coinsEarned || 0), 0)
  const totalCoinsSpent = filteredEntries.reduce((sum, entry) => sum + (entry.coinsSpent || 0), 0)
  const totalXpEarned = filteredEntries.reduce((sum, entry) => sum + (entry.xpEarned || 0), 0)
  const tasksCompleted = filteredEntries.filter((entry) => entry.action === "task_completed").length
  const questsCompleted = filteredEntries.filter((entry) => entry.action === "quest_completed").length
  const badgesEarned = filteredEntries.filter((entry) => entry.action === "badge_earned").length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Family Activity History</h2>
          <p className="text-muted-foreground">Track progress, achievements, and spending across all family members</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Coins Earned</p>
                <p className="text-2xl font-bold text-green-600">🪙 {totalCoinsEarned}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Coins Spent</p>
                <p className="text-2xl font-bold text-blue-600">🪙 {totalCoinsSpent}</p>
              </div>
              <Coins className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">XP Earned</p>
                <p className="text-2xl font-bold text-purple-600">⭐ {totalXpEarned}</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks Done</p>
                <p className="text-2xl font-bold text-orange-600">{tasksCompleted}</p>
              </div>
              <Trophy className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedChild} onValueChange={setSelectedChild}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Children</SelectItem>
                <SelectItem value="Emma">Emma</SelectItem>
                <SelectItem value="Jake">Jake</SelectItem>
                <SelectItem value="Sophie">Sophie</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="task_completed">Tasks Completed</SelectItem>
                <SelectItem value="quest_completed">Quests Completed</SelectItem>
                <SelectItem value="reward_redeemed">Rewards Redeemed</SelectItem>
                <SelectItem value="badge_earned">Badges Earned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Date</SelectItem>
              </SelectContent>
            </Select>

            {dateRange === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-48 justify-start text-left font-normal bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Activity Feed ({filteredEntries.length} entries)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-muted-foreground">No activities found for the selected filters</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getActionIcon(entry.action)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.childName}</span>
                      <Badge variant="outline" className={getActionColor(entry.action)}>
                        {entry.action.replace("_", " ")}
                      </Badge>
                      {!entry.approved && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          Pending Approval
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.description}</p>
                    <p className="text-xs text-muted-foreground">{format(entry.timestamp, "PPp")}</p>
                  </div>
                </div>
                <div className="text-right">
                  {entry.coinsEarned && (
                    <div className="text-sm font-medium text-green-600">+🪙 {entry.coinsEarned}</div>
                  )}
                  {entry.coinsSpent && <div className="text-sm font-medium text-red-600">-🪙 {entry.coinsSpent}</div>}
                  {entry.xpEarned && <div className="text-xs text-purple-600">+⭐ {entry.xpEarned} XP</div>}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completion Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Tasks Completed</span>
                <span className="font-bold">{tasksCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Quests Completed</span>
                <span className="font-bold">{questsCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Badges Earned</span>
                <span className="font-bold">{badgesEarned}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coin Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Coins Earned</span>
                <span className="font-bold text-green-600">🪙 {totalCoinsEarned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Coins Spent</span>
                <span className="font-bold text-red-600">🪙 {totalCoinsSpent}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">Net Coins</span>
                <span className="font-bold">🪙 {totalCoinsEarned - totalCoinsSpent}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Experience Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total XP Earned</span>
                <span className="font-bold text-purple-600">⭐ {totalXpEarned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg XP per Task</span>
                <span className="font-bold">
                  ⭐ {tasksCompleted > 0 ? Math.round(totalXpEarned / tasksCompleted) : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
