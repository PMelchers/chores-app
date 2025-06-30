"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
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
  const [sortBy, setSortBy] = useState("price-low")

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: "1",
      name: "Extra Screen Time",
      description: "1 hour of additional screen time on weekends",
      coinCost: 25,
      category: "privileges",
      requiresApproval: false,
      available: true,
      popularity: 88,
      canAfford: true,
    },
    {
      id: "2",
      name: "Stay Up Late",
      description: "Stay up 1 hour past bedtime on Friday",
      coinCost: 30,
      category: "privileges",
      requiresApproval: false,
      available: true,
      popularity: 78,
      canAfford: true,
    },
    {
      id: "3",
      name: "Movie Night",
      description: "Choose the family movie and get popcorn!",
      coinCost: 50,
      category: "entertainment",
      requiresApproval: false,
      available: true,
      popularity: 95,
      canAfford: true,
    },
    {
      id: "4",
      name: "New Book",
      description: "Choose any book from the bookstore",
      coinCost: 75,
      category: "books",
      requiresApproval: false,
      available: true,
      popularity: 65,
      canAfford: true,
    },
    {
      id: "5",
      name: "Pizza Party",
      description: "Order pizza for the whole family",
      coinCost: 150,
      category: "food",
      requiresApproval: true,
      available: true,
      popularity: 85,
      canAfford: true,
    },
    {
      id: "6",
      name: "New Toy",
      description: "Choose a toy up to $25",
      coinCost: 200,
      category: "toys",
      requiresApproval: true,
      available: true,
      popularity: 92,
      canAfford: false,
    },
    {
      id: "7",
      name: "Video Game",
      description: "Choose a new video game (up to $60)",
      coinCost: 500,
      category: "electronics",
      requiresApproval: true,
      available: true,
      popularity: 98,
      canAfford: false,
    },
    {
      id: "8",
      name: "Theme Park Trip",
      description: "Family trip to the local theme park",
      coinCost: 1000,
      category: "experiences",
      requiresApproval: true,
      available: true,
      popularity: 99,
      canAfford: false,
    },
  ])

  const [purchasedRewards, setPurchasedRewards] = useState<string[]>([])

  const handlePurchase = (rewardId: string, coinCost: number) => {
    if (userCoins >= coinCost) {
      setPurchasedRewards([...purchasedRewards, rewardId])
      // In a real app, you'd update the user's coin balance
      console.log(`Purchased reward ${rewardId} for ${coinCost} coins`)
    }
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      entertainment: "🎬",
      privileges: "⭐",
      toys: "🧸",
      food: "🍕",
      electronics: "💻",
      books: "📚",
      experiences: "🎢",
    }
    return emojis[category] || "🎁"
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      entertainment: "bg-purple-100 text-purple-800",
      privileges: "bg-yellow-100 text-yellow-800",
      toys: "bg-pink-100 text-pink-800",
      food: "bg-orange-100 text-orange-800",
      electronics: "bg-blue-100 text-blue-800",
      books: "bg-green-100 text-green-800",
      experiences: "bg-red-100 text-red-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  // Filter and sort rewards
  const filteredRewards = rewards.filter((reward) => {
    const matchesSearch =
      reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || reward.category === selectedCategory
    return matchesSearch && matchesCategory && reward.available
  })

  // Sort rewards
  filteredRewards.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.coinCost - b.coinCost
      case "price-high":
        return b.coinCost - a.coinCost
      case "popularity":
        return b.popularity - a.popularity
      case "affordable":
        return (b.canAfford ? 1 : 0) - (a.canAfford ? 1 : 0)
      default:
        return 0
    }
  })

  const affordableCount = rewards.filter((r) => r.canAfford && r.available).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Gift className="h-6 w-6" />
            Super Rewards Shop
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg">Your Super Coins</p>
              <div className="flex items-center gap-2 text-3xl font-bold">
                <Coins className="h-8 w-8" />
                {userCoins}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">You can afford</p>
              <p className="text-2xl font-bold">{affordableCount} rewards</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rewards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="privileges">⭐ Privileges</SelectItem>
                <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
                <SelectItem value="food">🍕 Food</SelectItem>
                <SelectItem value="toys">🧸 Toys</SelectItem>
                <SelectItem value="books">📚 Books</SelectItem>
                <SelectItem value="electronics">💻 Electronics</SelectItem>
                <SelectItem value="experiences">🎢 Experiences</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="affordable">Affordable First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => {
          const isPurchased = purchasedRewards.includes(reward.id)
          const canAfford = userCoins >= reward.coinCost

          return (
            <Card
              key={reward.id}
              className={`relative transition-all duration-200 ${
                !canAfford ? "opacity-60" : "hover:shadow-lg hover:scale-105"
              } ${isPurchased ? "bg-green-50 border-green-200" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{getCategoryEmoji(reward.category)}</span>
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{reward.popularity}%</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{reward.description}</p>

                <div className="flex justify-between items-center">
                  <Badge
                    variant="secondary"
                    className={`font-bold text-lg ${
                      canAfford ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    🪙 {reward.coinCost}
                  </Badge>
                  <Badge variant="outline" className={getCategoryColor(reward.category)}>
                    {reward.category}
                  </Badge>
                </div>

                {reward.requiresApproval && (
                  <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-600">
                    ⏳ Requires Parent Approval
                  </Badge>
                )}

                {isPurchased ? (
                  <div className="text-center">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-sm py-2 px-4">
                      ✅ Purchased! {reward.requiresApproval ? "Pending Approval" : "Enjoy!"}
                    </Badge>
                  </div>
                ) : (
                  <Button
                    onClick={() => handlePurchase(reward.id, reward.coinCost)}
                    disabled={!canAfford}
                    className={`w-full ${
                      canAfford
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        : ""
                    }`}
                    size="lg"
                  >
                    {canAfford ? (
                      <>
                        <Gift className="h-4 w-4 mr-2" />
                        {reward.requiresApproval ? "Request Reward" : "Buy Now"}
                      </>
                    ) : (
                      <>
                        <Coins className="h-4 w-4 mr-2" />
                        Need {reward.coinCost - userCoins} more coins
                      </>
                    )}
                  </Button>
                )}

                {!canAfford && (
                  <div className="text-center text-xs text-muted-foreground">
                    Complete more chores to earn coins! 💪
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredRewards.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No Rewards Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters to find more rewards!</p>
          </CardContent>
        </Card>
      )}

      {/* Motivational Message */}
      {userCoins < 100 && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center">
          <CardContent className="py-6">
            <div className="text-4xl mb-2">💪</div>
            <h3 className="text-xl font-bold mb-2">Keep Going!</h3>
            <p>Complete more chores to earn Super Coins and unlock amazing rewards!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
