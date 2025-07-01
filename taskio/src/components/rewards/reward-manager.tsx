"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Badge } from "../ui/badge"
import { PageLayout } from "../layout/page-layout"
import { Plus, Gift, Edit, Trash2, Settings, Sparkles } from "lucide-react"

type Reward = {
  id: string
  name: string
  description: string
  coinCost: number
  category: string
  requiresApproval: boolean
  available: boolean
  popularity: number
}

export function RewardManager() {
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: "1",
      name: "Extra Screen Time",
      description: "Get an extra hour of screen time for games or videos",
      coinCost: 25,
      category: "entertainment",
      requiresApproval: false,
      available: true,
      popularity: 95,
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
        popularity: 0,
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

  return (
    <PageLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-xl">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Reward Management</h2>
                <p className="text-purple-200">Create and manage family rewards and incentives</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Reward
            </Button>
          </div>

          {isCreating && (
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  Create New Reward
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reward-name" className="text-white font-medium">
                      Reward Name
                    </Label>
                    <Input
                      id="reward-name"
                      value={newReward.name}
                      onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                      placeholder="e.g., Extra Screen Time"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward-category" className="text-white font-medium">
                      Category
                    </Label>
                    <Select
                      value={newReward.category}
                      onValueChange={(value) => setNewReward({ ...newReward, category: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entertainment">🎮 Entertainment</SelectItem>
                        <SelectItem value="food">🍕 Food & Treats</SelectItem>
                        <SelectItem value="privileges">⭐ Privileges</SelectItem>
                        <SelectItem value="social">👥 Social</SelectItem>
                        <SelectItem value="educational">📚 Educational</SelectItem>
                        <SelectItem value="toys">🧸 Toys & Games</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward-description" className="text-white font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="reward-description"
                    value={newReward.description}
                    onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                    placeholder="Describe what this reward includes..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coin-cost" className="text-white font-medium">
                    Coin Cost
                  </Label>
                  <Input
                    id="coin-cost"
                    type="number"
                    value={newReward.coinCost}
                    onChange={(e) => setNewReward({ ...newReward, coinCost: Number.parseInt(e.target.value) })}
                    min="1"
                    max="500"
                    className="bg-white/10 border-white/20 text-white focus:border-purple-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requires-approval"
                      checked={newReward.requiresApproval}
                      onCheckedChange={(checked) => setNewReward({ ...newReward, requiresApproval: checked })}
                    />
                    <Label htmlFor="requires-approval" className="text-white">
                      Requires Parent Approval
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={newReward.available !== false}
                      onCheckedChange={(checked) => setNewReward({ ...newReward, available: checked })}
                    />
                    <Label htmlFor="available" className="text-white">
                      Available in Shop
                    </Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateReward}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Reward
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <Card
                key={reward.id}
                className={`relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 ${
                  !reward.available ? "opacity-60" : ""
                }`}
              >
                <div
                  className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${getCategoryColor(reward.category)} opacity-20`}
                ></div>

                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getCategoryEmoji(reward.category)}</div>
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
                    <div className="flex space-x-1">
                      <Button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteReward(reward.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-purple-200">{reward.description}</p>

                  <div className="flex justify-between items-center">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-3 py-1">
                      🪙 {reward.coinCost} coins
                    </Badge>
                    {reward.popularity > 0 && (
                      <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                        {reward.popularity}% popular
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {reward.requiresApproval && (
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                        Approval Required
                      </Badge>
                    )}
                    <Badge
                      variant={reward.available ? "default" : "secondary"}
                      className={`text-xs ${
                        reward.available
                          ? "bg-green-500/20 text-green-300 border-green-400/30"
                          : "bg-gray-500/20 text-gray-300 border-gray-400/30"
                      }`}
                    >
                      {reward.available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Button
                      onClick={() => toggleAvailability(reward.id)}
                      size="sm"
                      className={`${
                        reward.available
                          ? "bg-orange-500/20 hover:bg-orange-500/30 text-orange-300"
                          : "bg-green-500/20 hover:bg-green-500/30 text-green-300"
                      } border border-current/30 rounded-lg`}
                    >
                      {reward.available ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/20 rounded-lg"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {rewards.length === 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardContent className="text-center py-16">
                <div className="bg-gradient-to-r from-pink-500 to-red-500 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Gift className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Rewards Created Yet</h3>
                <p className="text-purple-200 mb-6">Start creating amazing rewards for your family!</p>
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Reward
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
