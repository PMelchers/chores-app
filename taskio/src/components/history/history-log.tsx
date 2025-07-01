"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { PageLayout } from "../layout/page-layout"
import { CalendarIcon, Trophy, Star, CheckCircle, Gift, Zap, TrendingUp, Award } from "lucide-react"
import { format, subDays, isAfter, isBefore } from "date-fns"

type HistoryEntry = {
  id: string
  type: "task" | "quest" | "reward" | "achievement"
  title: string
  description: string
  points: number
  coins?: number
  date: Date
  status: "completed" | "purchased" | "earned"
  category: string
}

export function HistoryLog() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  const [historyEntries] = useState<HistoryEntry[]>([
    {
      id: "1",
      type: "task",
      title: "Made Bed",
      description: "Completed morning bed making task",
      points: 10,
      coins: 5,
      date: new Date(),
      status: "completed",
      category: "bedroom",
    },
    {
      id: "2",
      type: "task",
      title: "Brushed Teeth",
      description: "Completed morning dental hygiene",
      points: 5,
      coins: 3,
      date: new Date(),
      status: "completed",
      category: "bathroom",
    },
    {
      id: "3",
      type: "quest",
      title: "Math Master Challenge",
      description: "Completed all math homework without mistakes",
      points: 100,
      coins: 50,
      date: subDays(new Date(), 1),
      status: "completed",
      category: "education",
    },
    {
      id: "4",
      type: "reward",
      title: "Extra Screen Time",
      description: "Purchased 1 hour of extra screen time",
      points: 0,
      coins: -25,
      date: subDays(new Date(), 1),
      status: "purchased",
      category: "entertainment",
    },
    {
      id: "5",
      type: "achievement",
      title: "Task Starter",
      description: "Completed your first task",
      points: 25,
      date: subDays(new Date(), 2),
      status: "earned",
      category: "milestone",
    },
    {
      id: "6",
      type: "task",
      title: "Cleaned Room",
      description: "Organized bedroom and put away toys",
      points: 25,
      coins: 15,
      date: subDays(new Date(), 2),
      status: "completed",
      category: "bedroom",
    },
    {
      id: "7",
      type: "quest",
      title: "Reading Adventure",
      description: "Read 3 books and wrote reviews",
      points: 200,
      coins: 100,
      date: subDays(new Date(), 3),
      status: "completed",
      category: "education",
    },
    {
      id: "8",
      type: "reward",
      title: "Movie Night Choice",
      description: "Chose the family movie for tonight",
      points: 0,
      coins: -50,
      date: subDays(new Date(), 4),
      status: "purchased",
      category: "entertainment",
    },
    {
      id: "9",
      type: "task",
      title: "Fed Pet",
      description: "Gave food and water to family pet",
      points: 15,
      coins: 8,
      date: subDays(new Date(), 5),
      status: "completed",
      category: "pets",
    },
    {
      id: "10",
      type: "achievement",
      title: "Streak Master",
      description: "Maintained a 7-day task completion streak",
      points: 50,
      date: subDays(new Date(), 6),
      status: "earned",
      category: "milestone",
    },
  ])

  const getTypeIcon = (type: string) => {
    const icons = {
      task: CheckCircle,
      quest: Zap,
      reward: Gift,
      achievement: Trophy,
    }
    return icons[type as keyof typeof icons] || CheckCircle
  }

  const getTypeColor = (type: string) => {
    const colors = {
      task: "from-green-500 to-emerald-500",
      quest: "from-purple-500 to-pink-500",
      reward: "from-yellow-500 to-orange-500",
      achievement: "from-blue-500 to-indigo-500",
    }
    return colors[type as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "bg-green-500/20 text-green-300 border-green-400/30",
      purchased: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
      earned: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500/20 text-gray-300 border-gray-400/30"
  }

  const filterByPeriod = (entries: HistoryEntry[]) => {
    const now = new Date()
    switch (selectedPeriod) {
      case "today":
        return entries.filter((entry) => entry.date.toDateString() === now.toDateString())
      case "week":
        return entries.filter((entry) => isAfter(entry.date, subDays(now, 7)))
      case "month":
        return entries.filter((entry) => isAfter(entry.date, subDays(now, 30)))
      case "custom":
        if (dateRange.from && dateRange.to) {
          return entries.filter((entry) => isAfter(entry.date, dateRange.from!) && isBefore(entry.date, dateRange.to!))
        }
        return entries
      default:
        return entries
    }
  }

  const filteredEntries = filterByPeriod(historyEntries).filter((entry) => {
    if (selectedFilter === "all") return true
    return entry.type === selectedFilter
  })

  const totalPoints = filteredEntries.reduce((sum, entry) => sum + entry.points, 0)
  const totalCoins = filteredEntries.reduce((sum, entry) => sum + (entry.coins || 0), 0)
  const completedTasks = filteredEntries.filter((entry) => entry.type === "task").length
  const completedQuests = filteredEntries.filter((entry) => entry.type === "quest").length

  return (
    <PageLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-100">Total Points</CardTitle>
                <Star className="h-8 w-8 text-green-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalPoints}</div>
                <p className="text-xs text-green-100 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  Points earned
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-100">Coins Balance</CardTitle>
                <div className="text-2xl">🪙</div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalCoins}</div>
                <p className="text-xs text-yellow-100 flex items-center gap-1 mt-1">
                  <Award className="h-3 w-3" />
                  Net coins
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Tasks Done</CardTitle>
                <CheckCircle className="h-8 w-8 text-blue-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedTasks}</div>
                <p className="text-xs text-blue-100 flex items-center gap-1 mt-1">
                  <Trophy className="h-3 w-3" />
                  Tasks completed
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">Quests Done</CardTitle>
                <Zap className="h-8 w-8 text-purple-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedQuests}</div>
                <p className="text-xs text-purple-100 flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3" />
                  Epic quests
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activities</SelectItem>
                      <SelectItem value="task">Tasks Only</SelectItem>
                      <SelectItem value="quest">Quests Only</SelectItem>
                      <SelectItem value="reward">Rewards Only</SelectItem>
                      <SelectItem value="achievement">Achievements Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedPeriod === "custom" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "MMM dd") : "Pick dates"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="range"
                        selected={{ from: dateRange.from, to: dateRange.to }}
                        onSelect={(range) => setDateRange(range || {})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </CardContent>
          </Card>

          {/* History Timeline */}
          <div className="space-y-4">
            {filteredEntries.map((entry) => {
              const Icon = getTypeIcon(entry.type)
              return (
                <Card
                  key={entry.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`bg-gradient-to-r ${getTypeColor(entry.type)} p-3 rounded-xl shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg text-white">{entry.title}</h4>
                            <Badge className={`${getStatusColor(entry.status)} capitalize`}>{entry.status}</Badge>
                            <Badge
                              variant="outline"
                              className="bg-white/20 text-white border-white/30 capitalize text-xs"
                            >
                              {entry.type}
                            </Badge>
                          </div>
                          <p className="text-purple-200 mb-3">{entry.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-white font-medium">+{entry.points} points</span>
                            </div>
                            {entry.coins !== undefined && (
                              <div className="flex items-center gap-2 text-sm">
                                <div className="text-lg">🪙</div>
                                <span className={`font-medium ${entry.coins > 0 ? "text-green-400" : "text-red-400"}`}>
                                  {entry.coins > 0 ? "+" : ""}
                                  {entry.coins} coins
                                </span>
                              </div>
                            )}
                            <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                              {entry.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{format(entry.date, "MMM dd")}</div>
                        <div className="text-purple-300 text-sm">{format(entry.date, "h:mm a")}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredEntries.length === 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardContent className="text-center py-16">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-white mb-2">No Activity Found</h3>
                <p className="text-purple-200">Try adjusting your filters to see more history</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
