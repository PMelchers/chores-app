"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Badge } from "../ui/badge"
import { Plus, Gift, Trash2, Edit, Star } from "lucide-react"

type Reward = {
  id: string
  name: string
  description: string
  coinCost: number
  category: string
  requiresApproval: boolean
  available: boolean
  imageUrl?: string
  popularity: number
}

export function RewardManager() {
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: "1",
      name: "Movie Night",
      description: "Choose the family movie and get popcorn!",
      coinCost: 50,
      category: "entertainment",
      requiresApproval: false,
      available: true,
      popularity: 95,
    },
    {
      id: "2",
      name: "Extra Screen Time",
      description: "1 hour of additional screen time on weekends",
      coinCost: 25,
      category: "privileges",
      requiresApproval: false,
      available: true,
      popularity: 88,
    },
    {
      id: "3",
      name: "New Video Game",
      description: "Choose a new video game (up to $60)",
      coinCost: 500,
      category: "toys",
      requiresApproval: true,
      available: true,
      popularity: 92,
    },
    {
      id: "4",
      name: "Pizza Party",
      description: "Order pizza for the whole family",
      coinCost: 150,
      category: "food",
      requiresApproval: true,
      available: true,
      popularity: 85,
    },
    {
      id: "5",
      name: "New Laptop",
      description: "Brand new laptop for school and fun",
      coinCost: 5000,
      category: "electronics",
      requiresApproval: true,
      available: true,
      popularity: 98,
    },
    {
      id: "6",
      name: "Stay Up Late",
      description: "Stay up 1 hour past bedtime on Friday",
      coinCost: 30,
      category: "privileges",
      requiresApproval: false,
      available: true,
      popularity: 78,
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newReward, setNewReward] = useState<Partial<Reward>>({
    name: "",
    description: "",
    coinCost: 25,
    category: "entertainment",
    requiresApproval: false,
    available: true,
  })

  const handleCreateReward = () => {
    if (newReward.name && newReward.description) {
      const reward: Reward = {
        id: Date.now().toString(),
        name: newReward.name,
        description: newReward.description,
        coinCost: newReward.coinCost || 25,
        category: newReward.category || "entertainment",
        requiresApproval: newReward.requiresApproval || false,
        available: newReward.available !== false,
        popularity: Math.floor(Math.random() * 20) + 80,
      }
      setRewards([...rewards, reward])
      setNewReward({
        name: "",
        description: "",
        coinCost: 25,
        category: "entertainment",
        requiresApproval: false,
        available: true,
      })
      setIsCreating(false)
    }
  }

  const handleDeleteReward = (id: string) => {
    setRewards(rewards.filter((reward) => reward.id !== id))
  }

  const toggleAvailability = (id: string) => {
    setRewards(rewards.map((reward) => (reward.id === id ? { ...reward, available: !reward.available } : reward)))
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

  const sortedRewards = [...rewards].sort((a, b) => a.coinCost - b.coinCost)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Super Rewards Shop</h2>
          <p className="text-muted-foreground">Create and manage rewards that kids can redeem with Super Coins</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Reward
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rewards</p>
                <p className="text-2xl font-bold">{rewards.length}</p>
              </div>
              <Gift className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-green-600">{rewards.filter((r) => r.available).length}</p>
              </div>
              <div className="text-green-500">✅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Require Approval</p>
                <p className="text-2xl font-bold text-orange-600">{rewards.filter((r) => r.requiresApproval).length}</p>
              </div>
              <div className="text-orange-500">⏳</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Cost</p>
                <p className="text-2xl font-bold text-yellow-600">
                  🪙 {Math.round(rewards.reduce((sum, r) => sum + r.coinCost, 0) / rewards.length)}
                </p>
              </div>
              <div className="text-yellow-500">💰</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Create New Reward
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reward-name">Reward Name</Label>
                <Input
                  id="reward-name"
                  value={newReward.name}
                  onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                  placeholder="e.g., Movie Night"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coin-cost">Super Coin Cost</Label>
                <Input
                  id="coin-cost"
                  type="number"
                  value={newReward.coinCost}
                  onChange={(e) => setNewReward({ ...newReward, coinCost: Number.parseInt(e.target.value) })}
                  min="1"
                  max="10000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reward-description">Description</Label>
              <Textarea
                id="reward-description"
                value={newReward.description}
                onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                placeholder="Describe what the child gets..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={newReward.category}
                onChange={(e) => setNewReward({ ...newReward, category: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="entertainment">🎬 Entertainment</option>
                <option value="privileges">⭐ Privileges</option>
                <option value="toys">🧸 Toys</option>
                <option value="food">🍕 Food</option>
                <option value="electronics">💻 Electronics</option>
                <option value="books">📚 Books</option>
                <option value="experiences">🎢 Experiences</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="requires-approval"
                  checked={newReward.requiresApproval}
                  onCheckedChange={(checked) => setNewReward({ ...newReward, requiresApproval: checked })}
                />
                <Label htmlFor="requires-approval">Requires Parent Approval</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={newReward.available !== false}
                  onCheckedChange={(checked) => setNewReward({ ...newReward, available: checked })}
                />
                <Label htmlFor="available">Available for Purchase</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateReward}>Create Reward</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRewards.map((reward) => (
          <Card key={reward.id} className={`relative ${!reward.available ? "opacity-60" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryEmoji(reward.category)}</span>
                  <CardTitle className="text-lg">{reward.name}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteReward(reward.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{reward.description}</p>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 font-bold">
                    🪙 {reward.coinCost}
                  </Badge>
                  <Badge variant="secondary" className={getCategoryColor(reward.category)}>
                    {reward.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{reward.popularity}%</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {reward.requiresApproval && (
                  <Badge variant="outline" className="text-xs">
                    Requires Approval
                  </Badge>
                )}
                {!reward.available && (
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-600">
                    Unavailable
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" size="sm" onClick={() => toggleAvailability(reward.id)}>
                  {reward.available ? "Disable" : "Enable"}
                </Button>
                <span className="text-xs text-muted-foreground">{reward.popularity}% popularity</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
