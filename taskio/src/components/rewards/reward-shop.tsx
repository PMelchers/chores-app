"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { PageLayout } from "../layout/page-layout"
import { Gift, Coins, Star, Search, Filter } from "lucide-react"

type Reward = {
  id: string
  name: string
  description: string
  coinCost: number
  category: string
  requiresApproval: boolean
  available: boolean
  popularity: number
  canAfford: boolean
}

export function RewardShop() {
  const [userCoins] = useState(156) // Mock user coins
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popularity")

  const [rewards] = useState<Reward[]>([
    {
      id: "1",
      name: "Extra Screen Time",
      description: "Get an extra hour of screen time for games or videos",
      coinCost: 25,
      category: "entertainment",
      requiresApproval: false,
      available: true,
      popularity: 95,
      canAfford: true,
    },
    {
      id: "2",
      name: "Movie Night Choice",
      description: "Pick the movie for family movie night",
      coinCost: 50,
      category: "entertainment",
      requiresApproval: false,
      available: true,
      popularity: 88,
      canAfford: true,
    },
    {
      id: "3",
      name: "Special Treat",
      description: "Choose a special dessert or snack",
      coinCost: 30,
      category: "food",
      requiresApproval: false,
      available: true,
      popularity: 92,
      canAfford: true,
    },
    {
      id: "4",
      name: "Stay Up Late",
      description: "Stay up 30 minutes past bedtime on weekend",
      coinCost: 40,
      category: "privileges",
      requiresApproval: true,
      available: true,
      popularity: 85,
      canAfford: true,
    },
    {
      id: "5",
      name: "Friend Sleepover",
      description: "Have a friend over for a sleepover",
      coinCost: 100,
      category: "social",
      requiresApproval: true,
      available: true,
      popularity: 90,
      canAfford: true,
    },
    {
      id: "6",
      name: "New Book",
      description: "Choose a new book to add to your collection",
      coinCost: 75,
      category: "educational",
      requiresApproval: false,
      available: true,
      popularity: 70,
      canAfford: true,
    },
    {
      id: "7",
      name: "Art Supplies",
      description: "Get new art supplies for creative projects",
      coinCost: 60,
      category: "educational",
      requiresApproval: false,
      available: true,
      popularity: 75,
      canAfford: true,
    },
    {
      id: "8",
      name: "Pizza Party",
      description: "Have pizza for dinner with the family",
      coinCost: 80,
      category: "food",
      requiresApproval: true,
      available: true,
      popularity: 93,
      canAfford: true,
    },
    {
      id: "9",
      name: "Skip One Chore",
      description: "Skip one assigned chore for the day",
      coinCost: 35,
      category: "privileges",
      requiresApproval: false,
      available: true,
      popularity: 87,
      canAfford: true,
    },
    {
      id: "10",
      name: "New Toy",
      description: "Choose a small toy or game (under $20)",
      coinCost: 150,
      category: "toys",
      requiresApproval: true,
      available: true,
      popularity: 95,
      canAfford: true,
    },
  ])

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      entertainment: "🎮",
      food: "🍕",
      privileges: "⭐",
      social: "👥",
      educational: "📚",
      toys: "🧸",
    }
    return emojis[category] || "🎁"
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      entertainment: "from-blue-500 to-purple-500",
      food: "from-orange-500 to-red-500",
      privileges: "from-yellow-500 to-orange-500",
      social: "from-green-500 to-emerald-500",
      educational: "from-purple-500 to-pink-500",
      toys: "from-pink-500 to-red-500",
    }
    return colors[category] || "from-gray-500 to-gray-600"
  }

  const handlePurchase = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId)
    if (reward && userCoins >= reward.coinCost) {
      // In a real app, this would make an API call
      alert(`Successfully purchased: ${reward.name}!`)
    }
  }

  const filteredRewards = rewards
    .filter((reward) => {
      const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || reward.category === selectedCategory
      return matchesSearch && matchesCategory && reward.available
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.coinCost - b.coinCost
        case "price-high":
          return b.coinCost - a.coinCost
        case "popularity":
          return b.popularity - a.popularity
        default:
          return 0
      }
    })

  const categories = Array.from(new Set(rewards.map((r) => r.category)))

  return (
    <PageLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header with Coin Balance */}
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-2xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Gift className="h-6 w-6" />
                    Reward Shop
                  </CardTitle>
                  <p className="text-lg opacity-90">Spend your hard-earned coins on amazing rewards!</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Coins className="h-6 w-6" />
                      <span className="text-2xl font-bold">{userCoins}</span>
                    </div>
                    <p className="text-sm opacity-90">Your Coins</p>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Filters and Search */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search rewards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {getCategoryEmoji(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => (
              <Card
                key={reward.id}
                className={`relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 ${
                  userCoins < reward.coinCost ? "opacity-60" : ""
                }`}
              >
                <div
                  className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${getCategoryColor(reward.category)} opacity-20`}
                ></div>

                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getCategoryEmoji(reward.category)}</div>
                      <div>
                        <CardTitle className="text-lg text-white">{reward.name}</CardTitle>
                        <Badge
                          variant="outline"
                          className="mt-1 bg-white/20 text-white border-white/30 capitalize text-xs"
                        >
                          {reward.category}
                        </Badge>
                      </div>
                    </div>
                    {reward.popularity > 90 && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-purple-200">{reward.description}</p>

                  <div className="flex justify-between items-center">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-4 py-2">
                      <Coins className="h-4 w-4 mr-2" />
                      {reward.coinCost} coins
                    </Badge>
                    {reward.requiresApproval && (
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                        Needs Approval
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => handlePurchase(reward.id)}
                    disabled={userCoins < reward.coinCost}
                    className={`w-full rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 ${
                      userCoins >= reward.coinCost
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                        : "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {userCoins >= reward.coinCost ? (
                      <>
                        <Gift className="h-4 w-4 mr-2" />
                        {reward.requiresApproval ? "Request Purchase" : "Buy Now"}
                      </>
                    ) : (
                      <>
                        <Coins className="h-4 w-4 mr-2" />
                        Need {reward.coinCost - userCoins} more coins
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredRewards.length === 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardContent className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-white mb-2">No Rewards Found</h3>
                <p className="text-purple-200">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}

          {/* Coin Earning Tips */}
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Need More Coins?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl mb-2">✅</div>
                  <h4 className="font-bold mb-1">Complete Tasks</h4>
                  <p className="text-sm opacity-90">Finish daily chores to earn coins</p>
                </div>
                <div className="text-center p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl mb-2">🗡️</div>
                  <h4 className="font-bold mb-1">Epic Quests</h4>
                  <p className="text-sm opacity-90">Complete quests for bonus rewards</p>
                </div>
                <div className="text-center p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl mb-2">🔥</div>
                  <h4 className="font-bold mb-1">Streak Bonus</h4>
                  <p className="text-sm opacity-90">Maintain streaks for extra coins</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
