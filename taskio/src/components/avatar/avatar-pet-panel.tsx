"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Heart, Star, Palette, Sparkles } from "lucide-react"

export function AvatarPetPanel() {
  const [selectedAvatar, setSelectedAvatar] = useState("👧")
  const [selectedPet, setSelectedPet] = useState("🐱")
  const [selectedTheme, setSelectedTheme] = useState("space")
  const [petLevel, setPetLevel] = useState(5)
  const [petHappiness, setPetHappiness] = useState(85)
  const [petHunger, setPetHunger] = useState(60)

  const avatars = [
    { emoji: "👧", name: "Girl", unlocked: true },
    { emoji: "👦", name: "Boy", unlocked: true },
    { emoji: "🧒", name: "Child", unlocked: true },
    { emoji: "👩‍🦱", name: "Curly Hair", unlocked: false, level: 10 },
    { emoji: "👨‍🦰", name: "Red Hair", unlocked: false, level: 15 },
    { emoji: "🧙‍♀️", name: "Wizard", unlocked: false, level: 20 },
    { emoji: "🦸‍♂️", name: "Superhero", unlocked: false, level: 25 },
    { emoji: "👸", name: "Princess", unlocked: false, level: 30 },
  ]

  const pets = [
    { emoji: "🐱", name: "Cat", unlocked: true },
    { emoji: "🐶", name: "Dog", unlocked: true },
    { emoji: "🐰", name: "Bunny", unlocked: true },
    { emoji: "🐹", name: "Hamster", unlocked: false, level: 8 },
    { emoji: "🐦", name: "Bird", unlocked: false, level: 12 },
    { emoji: "🐢", name: "Turtle", unlocked: false, level: 18 },
    { emoji: "🦄", name: "Unicorn", unlocked: false, level: 25 },
    { emoji: "🐉", name: "Dragon", unlocked: false, level: 35 },
  ]

  const themes = [
    { id: "space", name: "Space Adventure", emoji: "🚀", unlocked: true },
    { id: "jungle", name: "Jungle Safari", emoji: "🌴", unlocked: true },
    { id: "ocean", name: "Ocean Deep", emoji: "🌊", unlocked: false, level: 10 },
    { id: "fantasy", name: "Fantasy Kingdom", emoji: "🏰", unlocked: false, level: 15 },
    { id: "candy", name: "Candy Land", emoji: "🍭", unlocked: false, level: 20 },
    { id: "robot", name: "Robot City", emoji: "🤖", unlocked: false, level: 25 },
  ]

  const feedPet = () => {
    if (petHunger < 100) {
      setPetHunger(Math.min(100, petHunger + 20))
      setPetHappiness(Math.min(100, petHappiness + 5))
    }
  }

  const playWithPet = () => {
    if (petHappiness < 100) {
      setPetHappiness(Math.min(100, petHappiness + 15))
      setPetHunger(Math.max(0, petHunger - 5))
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6" />
            Customize Your Adventure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Make your profile unique with avatars, pets, and themes! 🎨</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="avatar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="avatar" className="flex items-center gap-2">
            <span className="text-lg">{selectedAvatar}</span>
            Avatar
          </TabsTrigger>
          <TabsTrigger value="pet" className="flex items-center gap-2">
            <span className="text-lg">{selectedPet}</span>
            Pet
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme
          </TabsTrigger>
        </TabsList>

        <TabsContent value="avatar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                {avatars.map((avatar) => (
                  <div key={avatar.emoji} className="text-center">
                    <Button
                      variant={selectedAvatar === avatar.emoji ? "default" : "outline"}
                      size="lg"
                      className={`w-full h-20 text-3xl ${!avatar.unlocked ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => avatar.unlocked && setSelectedAvatar(avatar.emoji)}
                      disabled={!avatar.unlocked}
                    >
                      {avatar.emoji}
                    </Button>
                    <p className="text-xs mt-2 font-medium">{avatar.name}</p>
                    {!avatar.unlocked && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Level {avatar.level}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pet" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Pet</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-8xl">{selectedPet}</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Level</span>
                    <Badge variant="secondary">Level {petLevel}</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        Happiness
                      </span>
                      <span className="text-sm">{petHappiness}%</span>
                    </div>
                    <Progress value={petHappiness} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">🍎 Hunger</span>
                      <span className="text-sm">{petHunger}%</span>
                    </div>
                    <Progress value={petHunger} className="h-2" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={feedPet} size="sm" className="flex-1">
                    🍎 Feed
                  </Button>
                  <Button onClick={playWithPet} size="sm" className="flex-1">
                    🎾 Play
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Choose Your Pet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {pets.map((pet) => (
                    <div key={pet.emoji} className="text-center">
                      <Button
                        variant={selectedPet === pet.emoji ? "default" : "outline"}
                        size="lg"
                        className={`w-full h-16 text-2xl ${!pet.unlocked ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => pet.unlocked && setSelectedPet(pet.emoji)}
                        disabled={!pet.unlocked}
                      >
                        {pet.emoji}
                      </Button>
                      <p className="text-xs mt-1 font-medium">{pet.name}</p>
                      {!pet.unlocked && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Lv {pet.level}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <Card
                    key={theme.id}
                    className={`cursor-pointer transition-all ${
                      selectedTheme === theme.id ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                    } ${!theme.unlocked ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => theme.unlocked && setSelectedTheme(theme.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2">{theme.emoji}</div>
                      <h3 className="font-medium">{theme.name}</h3>
                      {!theme.unlocked && (
                        <Badge variant="outline" className="text-xs mt-2">
                          Level {theme.level} Required
                        </Badge>
                      )}
                      {selectedTheme === theme.id && (
                        <Badge variant="default" className="text-xs mt-2">
                          Active
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Your Profile Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-8 py-8">
            <div className="text-center">
              <div className="text-6xl mb-2">{selectedAvatar}</div>
              <Badge variant="secondary">Your Avatar</Badge>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-2">{selectedPet}</div>
              <Badge variant="secondary">Your Pet</Badge>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-2">{themes.find((t) => t.id === selectedTheme)?.emoji}</div>
              <Badge variant="secondary">{themes.find((t) => t.id === selectedTheme)?.name}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
