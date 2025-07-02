"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Gift, Coins, Star, Search, Filter, Plus, Trash2, ShoppingCart, Trophy } from "lucide-react"
import { useAuth } from "../providers/auth-provider"
import { databaseService, type Reward, type RewardPurchase } from "../../firebase/database"
import { LoadingSpinner } from "../ui/loading-spinner"

export function RewardShop() {
  const { user, userRole } = useAuth()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [purchases, setPurchases] = useState<RewardPurchase[]>([])
  const [pendingApprovals, setPendingApprovals] = useState<RewardPurchase[]>([])
  const [userCoins, setUserCoins] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("price-low")
  const [showAddReward, setShowAddReward] = useState(false)
  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
    coinCost: 10,
    category: "entertainment",
    requiresApproval: false
  })

  // Load rewards, user coins, and purchases
  useEffect(() => {
    const loadData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        
        // Load rewards
        const rewardsData = await databaseService.getRewards()
        
        // Add some default gaming/meme rewards if none exist
        if (rewardsData.length === 0 && userRole === 'parent') {
          await createDefaultRewards()
          const newRewardsData = await databaseService.getRewards()
          setRewards(newRewardsData)
        } else {
          setRewards(rewardsData)
        }
        
        // Load user data
        const userData = await databaseService.getUser(user.uid)
        setUserCoins(userData?.coins || 0)
        
        // Load purchases
        const purchasesData = await databaseService.getRewardPurchases(user.uid)
        setPurchases(purchasesData)
        
        // If parent, load all pending approvals
        if (userRole === 'parent') {
          const allPurchases = await databaseService.getRewardPurchases()
          const pendingPurchases = allPurchases.filter(p => p.status === 'pending')
          setPendingApprovals(pendingPurchases)
        }
        
      } catch (error) {
        console.error('Error loading reward shop data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, userRole])

  const createDefaultRewards = async () => {
    const defaultRewards = [
      {
        name: "🎮 Fortnite V-Bucks",
        description: "Get 1000 V-Bucks for your Fortnite account - Victory Royale time!",
        coinCost: 150,
        category: "gaming",
        requiresApproval: true,
        available: true,
        popularity: 95,
        createdBy: user!.uid
      },
      {
        name: "⛏️ Minecraft Java Edition",
        description: "Get Minecraft Java Edition or a cool skin pack",
        coinCost: 200,
        category: "gaming",
        requiresApproval: true,
        available: true,
        popularity: 98,
        createdBy: user!.uid
      },
      {
        name: "💀 Skibidi Toilet Toy",
        description: "Official Skibidi Toilet plushie - only in Ohio! 💀",
        coinCost: 75,
        category: "toys",
        requiresApproval: false,
        available: true,
        popularity: 85,
        createdBy: user!.uid
      },
      {
        name: "🧠 Brainrot Compilation Hour",
        description: "1 hour of pure TikTok/YouTube Shorts brainrot content",
        coinCost: 25,
        category: "entertainment",
        requiresApproval: false,
        available: true,
        popularity: 70,
        createdBy: user!.uid
      },
      {
        name: "📱 Among Us VIP Pass",
        description: "Get Among Us with all cosmetics - sus! 📮",
        coinCost: 50,
        category: "gaming",
        requiresApproval: false,
        available: true,
        popularity: 80,
        createdBy: user!.uid
      },
      {
        name: "🍕 Pizza Party (No Cap)",
        description: "Order pizza for the squad - absolutely no cap fr fr",
        coinCost: 120,
        category: "food",
        requiresApproval: true,
        available: true,
        popularity: 92,
        createdBy: user!.uid
      },
      {
        name: "🎵 Spotify Premium (1 Month)",
        description: "Listen to Ohio music without ads - straight fire 🔥",
        coinCost: 100,
        category: "entertainment",
        requiresApproval: true,
        available: true,
        popularity: 88,
        createdBy: user!.uid
      },
      {
        name: "📚 Diary of a Wimpy Kid Book",
        description: "Latest Diary of a Wimpy Kid book - Greg is literally me",
        coinCost: 40,
        category: "books",
        requiresApproval: false,
        available: true,
        popularity: 65,
        createdBy: user!.uid
      },
      {
        name: "🎬 Movie Night Choice",
        description: "Pick the family movie AND get unlimited snacks",
        coinCost: 60,
        category: "entertainment",
        requiresApproval: false,
        available: true,
        popularity: 90,
        createdBy: user!.uid
      },
      {
        name: "⭐ Extra Screen Time",
        description: "2 hours extra screen time on weekends - poggers!",
        coinCost: 30,
        category: "privileges",
        requiresApproval: false,
        available: true,
        popularity: 95,
        createdBy: user!.uid
      },
      {
        name: "🎯 Nerf Blaster Elite",
        description: "Epic Nerf blaster for maximum warfare - it's Nerf or nothing!",
        coinCost: 180,
        category: "toys",
        requiresApproval: true,
        available: true,
        popularity: 85,
        createdBy: user!.uid
      },
      {
        name: "🏆 Roblox Premium + Robux",
        description: "Roblox Premium membership + 1000 Robux - oof!",
        coinCost: 160,
        category: "gaming",
        requiresApproval: true,
        available: true,
        popularity: 90,
        createdBy: user!.uid
      },
      {
        name: "🔥 Pokemon Cards Pack",
        description: "Booster pack with rare holographic cards - gotta catch 'em all!",
        coinCost: 45,
        category: "collectibles",
        requiresApproval: false,
        available: true,
        popularity: 88,
        createdBy: user!.uid
      },
      {
        name: "🎮 Gaming Chair Upgrade",
        description: "RGB gaming chair that makes you 200% better at games",
        coinCost: 500,
        category: "gaming",
        requiresApproval: true,
        available: true,
        popularity: 95,
        createdBy: user!.uid
      },
      {
        name: "💎 Minecraft Minecoins",
        description: "Get 3280 Minecoins for the Minecraft Marketplace",
        coinCost: 80,
        category: "gaming",
        requiresApproval: false,
        available: true,
        popularity: 82,
        createdBy: user!.uid
      },
      {
        name: "📱 TikTok Famous Setup",
        description: "Ring light + phone tripod for your viral TikToks",
        coinCost: 250,
        category: "tech",
        requiresApproval: true,
        available: true,
        popularity: 75,
        createdBy: user!.uid
      },
      {
        name: "🍭 Epic Candy Haul",
        description: "Giant bag of your favorite candy - diabetes speedrun any%",
        coinCost: 35,
        category: "food",
        requiresApproval: false,
        available: true,
        popularity: 93,
        createdBy: user!.uid
      },
      {
        name: "🎧 Gaming Headset RGB",
        description: "RGB gaming headset with surround sound - hear enemies before they see you",
        coinCost: 220,
        category: "gaming",
        requiresApproval: true,
        available: true,
        popularity: 87,
        createdBy: user!.uid
      },
      {
        name: "📱 Discord Nitro (3 Months)",
        description: "Discord Nitro with custom emojis and high quality streaming",
        coinCost: 90,
        category: "social",
        requiresApproval: false,
        available: true,
        popularity: 80,
        createdBy: user!.uid
      },
      {
        name: "🏃 Late Homework Pass",
        description: "Get out of jail free card for one late assignment",
        coinCost: 150,
        category: "privileges",
        requiresApproval: true,
        available: true,
        popularity: 99,
        createdBy: user!.uid
      }
    ]

    for (const reward of defaultRewards) {
      await databaseService.addReward(reward)
    }
  }

  const handleAddReward = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReward.name.trim() || !user) return

    try {
      await databaseService.addReward({
        ...newReward,
        available: true,
        popularity: 50,
        createdBy: user.uid
      })
      
      // Refresh rewards
      const rewardsData = await databaseService.getRewards()
      setRewards(rewardsData)
      
      setNewReward({
        name: "",
        description: "",
        coinCost: 10,
        category: "entertainment",
        requiresApproval: false
      })
      setShowAddReward(false)
    } catch (error) {
      console.error("Failed to add reward:", error)
    }
  }

  const handlePurchase = async (rewardId: string, coinCost: number) => {
    if (!user || userCoins < coinCost) return

    try {
      const reward = getRewardById(rewardId)
      await databaseService.purchaseReward(user.uid, rewardId, coinCost)
      
      // Show success message
      if (reward?.requiresApproval) {
        alert(`🎉 Reward request sent! Your parents will review "${reward.name}" soon.`)
      } else {
        alert(`🎉 Reward purchased! Enjoy your "${reward?.name}"!`)
      }
      
      // Refresh data
      const userData = await databaseService.getUser(user.uid)
      setUserCoins(userData?.coins || 0)
      
      const purchasesData = await databaseService.getRewardPurchases(user.uid)
      setPurchases(purchasesData)
      
      // If user is parent, refresh pending approvals
      if (userRole === 'parent') {
        const allPurchases = await databaseService.getRewardPurchases()
        const pendingPurchases = allPurchases.filter(p => p.status === 'pending')
        setPendingApprovals(pendingPurchases)
      }
      
    } catch (error) {
      console.error("Failed to purchase reward:", error)
      alert("Purchase failed. Please try again.")
    }
  }

  const handleDeleteReward = async (rewardId: string) => {
    if (!window.confirm("Are you sure you want to delete this reward?")) return

    try {
      await databaseService.deleteReward(rewardId)
      const rewardsData = await databaseService.getRewards()
      setRewards(rewardsData)
    } catch (error) {
      console.error("Failed to delete reward:", error)
    }
  }

  const handleApprovePurchase = async (purchaseId: string, approved: boolean) => {
    if (!user) return

    try {
      const notes = approved ? 'Approved by parent' : 'Denied by parent'
      await databaseService.approveRewardPurchase(purchaseId, user.uid, approved, notes)
      
      // Refresh pending approvals
      const allPurchases = await databaseService.getRewardPurchases()
      const pendingPurchases = allPurchases.filter(p => p.status === 'pending')
      setPendingApprovals(pendingPurchases)
      
      // Show success message
      alert(approved ? 'Reward request approved! 🎉' : 'Reward request denied.')
      
    } catch (error) {
      console.error("Failed to process purchase:", error)
      alert("Failed to process purchase. Please try again.")
    }
  }

  const getRewardById = (rewardId: string) => {
    return rewards.find(r => r.id === rewardId)
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      gaming: "🎮",
      entertainment: "🎬",
      privileges: "⭐",
      toys: "🧸",
      food: "🍕",
      electronics: "💻",
      books: "📚",
      experiences: "🎢",
      collectibles: "🔥",
      tech: "📱",
      social: "💬",
    }
    return emojis[category] || "🎁"
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      gaming: "bg-purple-100 text-purple-800",
      entertainment: "bg-blue-100 text-blue-800",
      privileges: "bg-yellow-100 text-yellow-800",
      toys: "bg-pink-100 text-pink-800",
      food: "bg-orange-100 text-orange-800",
      electronics: "bg-gray-100 text-gray-800",
      books: "bg-green-100 text-green-800",
      experiences: "bg-red-100 text-red-800",
      collectibles: "bg-indigo-100 text-indigo-800",
      tech: "bg-cyan-100 text-cyan-800",
      social: "bg-rose-100 text-rose-800",
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
        return (b.popularity || 0) - (a.popularity || 0)
      case "affordable":
        const aCanAfford = userCoins >= a.coinCost
        const bCanAfford = userCoins >= b.coinCost
        return (bCanAfford ? 1 : 0) - (aCanAfford ? 1 : 0)
      default:
        return 0
    }
  })

  const affordableCount = rewards.filter((r) => userCoins >= r.coinCost && r.available).length
  const purchasedRewardIds = purchases.map(p => p.rewardId)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Gift className="h-6 w-6" />
              Epic Rewards Shop 🔥
            </CardTitle>
            {userRole === 'parent' && pendingApprovals.length > 0 && (
              <Badge className="bg-orange-500 text-white text-lg px-3 py-1">
                {pendingApprovals.length} pending request{pendingApprovals.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg">Your Gaming Coins</p>
              <div className="flex items-center gap-2 text-3xl font-bold">
                🪙
                {userCoins}
              </div>
            </div>
            <div className="text-right">
              {userRole === 'parent' ? (
                <>
                  <p className="text-sm opacity-90">You can afford</p>
                  <p className="text-2xl font-bold">{affordableCount} rewards</p>
                </>
              ) : (
                <>
                  <p className="text-sm opacity-90">Total rewards earned</p>
                  <p className="text-2xl font-bold">{purchases.filter(p => p.status === 'approved').length}</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent: Add Reward Section */}
      {userRole === 'parent' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Manage Rewards</CardTitle>
              <Button onClick={() => setShowAddReward(!showAddReward)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Reward
              </Button>
            </div>
          </CardHeader>
          
          {showAddReward && (
            <CardContent>
              <form onSubmit={handleAddReward} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reward-name">Reward Name</Label>
                    <Input
                      id="reward-name"
                      value={newReward.name}
                      onChange={(e) => setNewReward(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Robux Gift Card"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coin-cost">Coin Cost</Label>
                    <Input
                      id="coin-cost"
                      type="number"
                      value={newReward.coinCost}
                      onChange={(e) => setNewReward(prev => ({ ...prev, coinCost: parseInt(e.target.value) || 10 }))}
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newReward.description}
                    onChange={(e) => setNewReward(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this awesome reward..."
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newReward.category} onValueChange={(value: string) => setNewReward(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gaming">🎮 Gaming</SelectItem>
                        <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
                        <SelectItem value="privileges">⭐ Privileges</SelectItem>
                        <SelectItem value="food">🍕 Food</SelectItem>
                        <SelectItem value="toys">🧸 Toys</SelectItem>
                        <SelectItem value="books">📚 Books</SelectItem>
                        <SelectItem value="electronics">💻 Electronics</SelectItem>
                        <SelectItem value="experiences">🎢 Experiences</SelectItem>
                        <SelectItem value="collectibles">🔥 Collectibles</SelectItem>
                        <SelectItem value="tech">📱 Tech</SelectItem>
                        <SelectItem value="social">💬 Social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Approval Required</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newReward.requiresApproval}
                        onChange={(e) => setNewReward(prev => ({ ...prev, requiresApproval: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Requires parent approval</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Reward
                  </Button>
                  <Button type="button" onClick={() => setShowAddReward(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>
      )}

      {/* Parent: Pending Approvals Section */}
      {userRole === 'parent' && pendingApprovals.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Star className="h-5 w-5" />
              Pending Reward Requests ({pendingApprovals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingApprovals.map((purchase) => {
              const reward = getRewardById(purchase.rewardId)
              if (!reward) return null

              return (
                <Card key={purchase.id} className="bg-white border border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getCategoryEmoji(reward.category)}</span>
                          <h4 className="font-semibold text-lg">{reward.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-orange-100 text-orange-800">
                            🪙 {purchase.coinCost} coins
                          </Badge>
                          <Badge className={getCategoryColor(reward.category)}>
                            {reward.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Requested: {purchase.purchasedAt instanceof Date 
                              ? purchase.purchasedAt.toLocaleDateString() 
                              : new Date(purchase.purchasedAt.seconds * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <UserDisplay userId={purchase.userId} />
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => handleApprovePurchase(purchase.id!, true)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2"
                        >
                          ✅ Approve
                        </Button>
                        <Button
                          onClick={() => handleApprovePurchase(purchase.id!, false)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
                        >
                          ❌ Deny
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Child: My Purchased Rewards Section */}
      {userRole === 'child' && purchases.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Trophy className="h-5 w-5" />
              My Rewards ({purchases.length})
            </CardTitle>
            <div className="text-sm text-blue-600 mt-2">
              ✅ Approved: {purchases.filter(p => p.status === 'approved').length} • 
              ⏳ Pending: {purchases.filter(p => p.status === 'pending').length} • 
              ❌ Denied: {purchases.filter(p => p.status === 'denied').length}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {purchases.map((purchase) => {
              const reward = getRewardById(purchase.rewardId)
              if (!reward) return null

              return (
                <Card key={purchase.id} className="bg-white border border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getCategoryEmoji(reward.category)}</span>
                          <h4 className="font-semibold text-lg">{reward.name}</h4>
                          <div className="flex items-center gap-2 ml-auto">
                            {purchase.status === 'pending' && (
                              <Badge className="bg-orange-100 text-orange-800">
                                ⏳ Pending Approval
                              </Badge>
                            )}
                            {purchase.status === 'approved' && (
                              <Badge className="bg-green-100 text-green-800">
                                ✅ Approved
                              </Badge>
                            )}
                            {purchase.status === 'denied' && (
                              <Badge className="bg-red-100 text-red-800">
                                ❌ Denied
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-blue-100 text-blue-800">
                            🪙 {purchase.coinCost} coins spent
                          </Badge>
                          <Badge className={getCategoryColor(reward.category)}>
                            {reward.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Purchased: {purchase.purchasedAt instanceof Date 
                              ? purchase.purchasedAt.toLocaleDateString() 
                              : new Date(purchase.purchasedAt.seconds * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        {purchase.status === 'denied' && purchase.notes && (
                          <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                            📝 Note: {purchase.notes}
                          </div>
                        )}
                        {purchase.status === 'approved' && !reward.requiresApproval && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                            🎉 Your reward is ready! Enjoy!
                          </div>
                        )}
                        {purchase.status === 'approved' && reward.requiresApproval && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                            🎉 Your reward has been approved! Check with your parents to claim it.
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Child: Empty State for No Rewards */}
      {userRole === 'child' && purchases.length === 0 && (
        <Card className="border-blue-200 bg-blue-50 text-center py-8">
          <CardContent>
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-bold mb-2 text-blue-800">No Rewards Yet!</h3>
            <p className="text-blue-600">
              Complete more chores to earn coins and buy your first epic reward! 💪
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search epic rewards..."
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
                <SelectItem value="gaming">🎮 Gaming</SelectItem>
                <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
                <SelectItem value="privileges">⭐ Privileges</SelectItem>
                <SelectItem value="food">🍕 Food</SelectItem>
                <SelectItem value="toys">🧸 Toys</SelectItem>
                <SelectItem value="books">📚 Books</SelectItem>
                <SelectItem value="electronics">💻 Electronics</SelectItem>
                <SelectItem value="experiences">🎢 Experiences</SelectItem>
                <SelectItem value="collectibles">🔥 Collectibles</SelectItem>
                <SelectItem value="tech">📱 Tech</SelectItem>
                <SelectItem value="social">💬 Social</SelectItem>
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
          const isPurchased = purchasedRewardIds.includes(reward.id!)
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
                    <span className="text-2xl">{getCategoryEmoji(reward.category)}</span>
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {reward.popularity && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{reward.popularity}%</span>
                      </div>
                    )}
                    {userRole === 'parent' && (
                      <Button
                        onClick={() => handleDeleteReward(reward.id!)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{reward.description}</p>

                <div className="flex justify-between items-center">
                  <Badge
                    className={`font-bold text-lg ${
                      canAfford ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    🪙 {reward.coinCost}
                  </Badge>
                  <Badge className={getCategoryColor(reward.category)}>
                    {reward.category}
                  </Badge>
                </div>

                {reward.requiresApproval && (
                  <Badge className="text-xs bg-yellow-50 text-yellow-600">
                    ⏳ Requires Parent Approval
                  </Badge>
                )}

                {isPurchased ? (
                  <div className="text-center">
                    {(() => {
                      const purchase = purchases.find(p => p.rewardId === reward.id)
                      if (!purchase) return null
                      
                      if (purchase.status === 'pending') {
                        return (
                          <Badge className="bg-orange-100 text-orange-800 text-sm py-2 px-4">
                            ⏳ Pending Approval
                          </Badge>
                        )
                      } else if (purchase.status === 'approved') {
                        return (
                          <Badge className="bg-green-100 text-green-800 text-sm py-2 px-4">
                            ✅ Approved! Enjoy your reward!
                          </Badge>
                        )
                      } else if (purchase.status === 'denied') {
                        return (
                          <Badge className="bg-red-100 text-red-800 text-sm py-2 px-4">
                            ❌ Request Denied
                          </Badge>
                        )
                      }
                      
                      return (
                        <Badge className="bg-green-100 text-green-800 text-sm py-2 px-4">
                          ✅ Purchased! {reward.requiresApproval ? "Pending Approval" : "Enjoy!"}
                        </Badge>
                      )
                    })()}
                  </div>
                ) : (
                  <Button
                    onClick={() => handlePurchase(reward.id!, reward.coinCost)}
                    disabled={!canAfford}
                    className={`w-full ${
                      canAfford
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        : ""
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
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
            <h3 className="text-xl font-bold mb-2">No Epic Rewards Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters to find more rewards!</p>
          </CardContent>
        </Card>
      )}

      {/* Motivational Message */}
      {userCoins < 50 && (
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center">
          <CardContent className="py-6">
            <div className="text-4xl mb-2">💪</div>
            <h3 className="text-xl font-bold mb-2">Keep Grinding! 🔥</h3>
            <p>Complete more chores to stack those coins and unlock epic rewards! No cap! 📈</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Helper component to display user info for purchases
function UserDisplay({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await databaseService.getUser(userId)
        setUser(userData)
      } catch (error) {
        console.error('Failed to load user:', error)
      }
    }
    
    loadUser()
  }, [userId])

  if (!user) {
    return <span className="text-xs text-gray-500">Loading user...</span>
  }

  return (
    <div className="text-xs text-gray-600 mt-1">
      👤 Requested by: <span className="font-medium">{user.email}</span>
      {user.displayName && <span> ({user.displayName})</span>}
    </div>
  )
}
