"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { PageLayout } from "../layout/page-layout"
import { Heart, Sparkles, Star, Palette, Shirt, Crown, Zap } from "lucide-react"

type Pet = {
  id: string
  name: string
  type: "dragon" | "unicorn" | "phoenix" | "griffin"
  level: number
  experience: number
  maxExperience: number
  happiness: number
  energy: number
  color: string
  accessories: string[]
  unlocked: boolean
}

type Accessory = {
  id: string
  name: string
  type: "hat" | "outfit" | "accessory"
  cost: number
  unlocked: boolean
  equipped: boolean
}

export function AvatarPetPanel() {
  const [userCoins] = useState(156)
  const [selectedPet, setSelectedPet] = useState("dragon")

  const [pets, setPets] = useState<Pet[]>([
    {
      id: "dragon",
      name: "Flame",
      type: "dragon",
      level: 5,
      experience: 75,
      maxExperience: 100,
      happiness: 85,
      energy: 90,
      color: "#ff6b6b",
      accessories: ["crown", "cape"],
      unlocked: true,
    },
    {
      id: "unicorn",
      name: "Sparkle",
      type: "unicorn",
      level: 3,
      experience: 45,
      maxExperience: 80,
      happiness: 95,
      energy: 70,
      color: "#ff9ff3",
      accessories: ["flower-crown"],
      unlocked: true,
    },
    {
      id: "phoenix",
      name: "Blaze",
      type: "phoenix",
      level: 1,
      experience: 0,
      maxExperience: 50,
      happiness: 60,
      energy: 100,
      color: "#ffa500",
      accessories: [],
      unlocked: false,
    },
    {
      id: "griffin",
      name: "Storm",
      type: "griffin",
      level: 1,
      experience: 0,
      maxExperience: 50,
      happiness: 50,
      energy: 80,
      color: "#8b4513",
      accessories: [],
      unlocked: false,
    },
  ])

  const [accessories, setAccessories] = useState<Accessory[]>([
    {
      id: "crown",
      name: "Royal Crown",
      type: "hat",
      cost: 50,
      unlocked: true,
      equipped: true,
    },
    {
      id: "cape",
      name: "Magic Cape",
      type: "outfit",
      cost: 75,
      unlocked: true,
      equipped: true,
    },
    {
      id: "flower-crown",
      name: "Flower Crown",
      type: "hat",
      cost: 30,
      unlocked: true,
      equipped: false,
    },
    {
      id: "wizard-hat",
      name: "Wizard Hat",
      type: "hat",
      cost: 60,
      unlocked: false,
      equipped: false,
    },
    {
      id: "rainbow-wings",
      name: "Rainbow Wings",
      type: "accessory",
      cost: 100,
      unlocked: false,
      equipped: false,
    },
    {
      id: "golden-armor",
      name: "Golden Armor",
      type: "outfit",
      cost: 150,
      unlocked: false,
      equipped: false,
    },
  ])

  const currentPet = pets.find((pet) => pet.id === selectedPet)

  const getPetEmoji = (type: string) => {
    const emojis = {
      dragon: "🐉",
      unicorn: "🦄",
      phoenix: "🔥",
      griffin: "🦅",
    }
    return emojis[type as keyof typeof emojis] || "🐉"
  }

  const getAccessoryEmoji = (type: string) => {
    const emojis = {
      hat: "👑",
      outfit: "👕",
      accessory: "✨",
    }
    return emojis[type as keyof typeof emojis] || "✨"
  }

  const handleFeedPet = () => {
    if (currentPet && userCoins >= 10) {
      setPets(
        pets.map((pet) =>
          pet.id === selectedPet
            ? {
                ...pet,
                happiness: Math.min(100, pet.happiness + 10),
                energy: Math.min(100, pet.energy + 15),
              }
            : pet,
        ),
      )
    }
  }

  const handlePlayWithPet = () => {
    if (currentPet && currentPet.energy >= 20) {
      setPets(
        pets.map((pet) =>
          pet.id === selectedPet
            ? {
                ...pet,
                happiness: Math.min(100, pet.happiness + 15),
                energy: Math.max(0, pet.energy - 20),
                experience: pet.experience + 10,
              }
            : pet,
        ),
      )
    }
  }

  const handleBuyAccessory = (accessoryId: string) => {
    const accessory = accessories.find((acc) => acc.id === accessoryId)
    if (accessory && userCoins >= accessory.cost) {
      setAccessories(accessories.map((acc) => (acc.id === accessoryId ? { ...acc, unlocked: true } : acc)))
    }
  }

  const toggleAccessory = (accessoryId: string) => {
    setAccessories(accessories.map((acc) => (acc.id === accessoryId ? { ...acc, equipped: !acc.equipped } : acc)))
  }

  const unlockedAccessories = accessories.filter((acc) => acc.unlocked)
  const lockedAccessories = accessories.filter((acc) => !acc.unlocked)

  return (
    <PageLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Pet Selection */}
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6" />
                Your Avatar Companions
              </CardTitle>
              <p className="text-lg opacity-90">Take care of your magical pets and customize your avatar!</p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {pets.map((pet) => (
                  <Button
                    key={pet.id}
                    onClick={() => setSelectedPet(pet.id)}
                    className={`flex-shrink-0 p-4 rounded-xl transition-all duration-300 ${
                      selectedPet === pet.id ? "bg-white/30 scale-105 shadow-lg" : "bg-white/10 hover:bg-white/20"
                    } ${!pet.unlocked ? "opacity-50" : ""}`}
                    disabled={!pet.unlocked}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{getPetEmoji(pet.type)}</div>
                      <div className="font-bold">{pet.name}</div>
                      <div className="text-xs opacity-75">Level {pet.level}</div>
                      {!pet.unlocked && (
                        <Badge className="mt-1 bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-xs">
                          Locked
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {currentPet && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Pet Display */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white text-xl">
                      <div className="text-2xl">{getPetEmoji(currentPet.type)}</div>
                      {currentPet.name}
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold">
                        Level {currentPet.level}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pet Avatar Display */}
                    <div className="text-center p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
                      <div className="text-8xl mb-4 relative">
                        {getPetEmoji(currentPet.type)}
                        {currentPet.accessories.includes("crown") && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl">👑</div>
                        )}
                        {currentPet.accessories.includes("cape") && (
                          <div className="absolute top-8 -right-4 text-3xl">🦸‍♂️</div>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{currentPet.name}</h3>
                      <p className="text-purple-200 capitalize">{currentPet.type} Companion</p>
                    </div>

                    {/* Pet Stats */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-400" />
                            Happiness
                          </span>
                          <span className="text-white font-bold">{currentPet.happiness}%</span>
                        </div>
                        <Progress value={currentPet.happiness} className="h-3" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-400" />
                            Energy
                          </span>
                          <span className="text-white font-bold">{currentPet.energy}%</span>
                        </div>
                        <Progress value={currentPet.energy} className="h-3" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium flex items-center gap-2">
                            <Star className="h-4 w-4 text-purple-400" />
                            Experience
                          </span>
                          <span className="text-white font-bold">
                            {currentPet.experience}/{currentPet.maxExperience}
                          </span>
                        </div>
                        <Progress value={(currentPet.experience / currentPet.maxExperience) * 100} className="h-3" />
                      </div>
                    </div>

                    {/* Pet Actions */}
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={handleFeedPet}
                        disabled={userCoins < 10}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Feed Pet (10 coins)
                      </Button>
                      <Button
                        onClick={handlePlayWithPet}
                        disabled={currentPet.energy < 20}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Play Together
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customization Panel */}
              <div className="space-y-6">
                {/* Coin Balance */}
                <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-2xl">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">🪙</div>
                    <div className="text-2xl font-bold">{userCoins}</div>
                    <div className="text-sm opacity-90">Your Coins</div>
                  </CardContent>
                </Card>

                {/* Equipped Accessories */}
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Shirt className="h-5 w-5" />
                      Equipped Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {unlockedAccessories
                        .filter((acc) => acc.equipped)
                        .map((accessory) => (
                          <div
                            key={accessory.id}
                            className="flex items-center justify-between p-3 bg-green-500/20 rounded-xl border border-green-400/30"
                          >
                            <div className="flex items-center gap-2">
                              <div className="text-lg">{getAccessoryEmoji(accessory.type)}</div>
                              <span className="text-white font-medium">{accessory.name}</span>
                            </div>
                            <Button
                              onClick={() => toggleAccessory(accessory.id)}
                              size="sm"
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 rounded-lg"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      {unlockedAccessories.filter((acc) => acc.equipped).length === 0 && (
                        <p className="text-purple-200 text-center py-4">No items equipped</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Available Accessories */}
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Available Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {unlockedAccessories
                        .filter((acc) => !acc.equipped)
                        .map((accessory) => (
                          <div
                            key={accessory.id}
                            className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/20"
                          >
                            <div className="flex items-center gap-2">
                              <div className="text-lg">{getAccessoryEmoji(accessory.type)}</div>
                              <span className="text-white font-medium">{accessory.name}</span>
                            </div>
                            <Button
                              onClick={() => toggleAccessory(accessory.id)}
                              size="sm"
                              className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-400/30 rounded-lg"
                            >
                              Equip
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Shop */}
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Crown className="h-5 w-5" />
                      Accessory Shop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lockedAccessories.map((accessory) => (
                        <div
                          key={accessory.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <div className="text-lg opacity-50">{getAccessoryEmoji(accessory.type)}</div>
                            <div>
                              <div className="text-white font-medium">{accessory.name}</div>
                              <div className="text-xs text-purple-300 capitalize">{accessory.type}</div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleBuyAccessory(accessory.id)}
                            disabled={userCoins < accessory.cost}
                            size="sm"
                            className={`rounded-lg ${
                              userCoins >= accessory.cost
                                ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-400/30"
                                : "bg-gray-500/20 text-gray-400 border border-gray-400/30 cursor-not-allowed"
                            }`}
                          >
                            {accessory.cost} 🪙
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
