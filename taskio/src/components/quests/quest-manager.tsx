"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { PageLayout } from "../layout/page-layout"
import { Plus, CalendarIcon, Sword, Star, Sparkles } from "lucide-react"
import { format } from "date-fns"

type Quest = {
  id: string
  title: string
  description: string
  coinReward: number
  xpReward: number
  difficulty: "easy" | "medium" | "hard" | "epic"
  type: "one-time" | "seasonal" | "challenge"
  deadline?: Date
  status: "active" | "completed" | "expired"
  requirements: string[]
}

export function QuestManager() {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "1",
      title: "Math Master Challenge",
      description: "Complete 20 math problems without any mistakes",
      coinReward: 50,
      xpReward: 100,
      difficulty: "medium",
      type: "challenge",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "active",
      requirements: ["Complete math homework", "Score 100% on practice test", "Help sibling with math"],
    },
    {
      id: "2",
      title: "Holiday Helper",
      description: "Help with holiday preparations and decorations",
      coinReward: 75,
      xpReward: 150,
      difficulty: "easy",
      type: "seasonal",
      deadline: new Date("2024-12-25"),
      status: "active",
      requirements: ["Decorate Christmas tree", "Wrap 5 presents", "Bake cookies with family"],
    },
    {
      id: "3",
      title: "Reading Adventure",
      description: "Read 3 books this month and write short reviews",
      coinReward: 100,
      xpReward: 200,
      difficulty: "hard",
      type: "challenge",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "active",
      requirements: ["Read first book", "Read second book", "Read third book", "Write reviews"],
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newQuest, setNewQuest] = useState<Partial<Quest>>({
    title: "",
    description: "",
    coinReward: 25,
    xpReward: 50,
    difficulty: "easy",
    type: "one-time",
    requirements: [""],
  })
  const [selectedDate, setSelectedDate] = useState<Date>()

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "from-green-500 to-emerald-500",
      medium: "from-yellow-500 to-orange-500",
      hard: "from-orange-500 to-red-500",
      epic: "from-purple-500 to-pink-500",
    }
    return colors[difficulty as keyof typeof colors] || colors.easy
  }

  const getDifficultyIcon = (difficulty: string) => {
    const icons = {
      easy: "⭐",
      medium: "⭐⭐",
      hard: "⭐⭐⭐",
      epic: "👑",
    }
    return icons[difficulty as keyof typeof icons] || icons.easy
  }

  const handleCreateQuest = () => {
    if (newQuest.title && newQuest.description) {
      const quest: Quest = {
        id: Date.now().toString(),
        title: newQuest.title,
        description: newQuest.description,
        coinReward: newQuest.coinReward || 25,
        xpReward: newQuest.xpReward || 50,
        difficulty: newQuest.difficulty || "easy",
        type: newQuest.type || "one-time",
        deadline: selectedDate,
        status: "active",
        requirements: newQuest.requirements?.filter((req) => req.trim() !== "") || [],
      }
      setQuests([...quests, quest])
      setNewQuest({
        title: "",
        description: "",
        coinReward: 25,
        xpReward: 50,
        difficulty: "easy",
        type: "one-time",
        requirements: [""],
      })
      setSelectedDate(undefined)
      setIsCreating(false)
    }
  }

  const addRequirement = () => {
    setNewQuest({
      ...newQuest,
      requirements: [...(newQuest.requirements || []), ""],
    })
  }

  const updateRequirement = (index: number, value: string) => {
    const requirements = [...(newQuest.requirements || [])]
    requirements[index] = value
    setNewQuest({ ...newQuest, requirements })
  }

  const removeRequirement = (index: number) => {
    const requirements = [...(newQuest.requirements || [])]
    requirements.splice(index, 1)
    setNewQuest({ ...newQuest, requirements })
  }

  return (
    <PageLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <Sword className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Quest Management</h2>
                <p className="text-purple-200">Create epic quests and seasonal challenges</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Quest
            </Button>
          </div>

          {isCreating && (
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  Create New Quest
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quest-title" className="text-white font-medium">
                      Quest Title
                    </Label>
                    <Input
                      id="quest-title"
                      value={newQuest.title}
                      onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
                      placeholder="e.g., Math Master Challenge"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quest-type" className="text-white font-medium">
                      Quest Type
                    </Label>
                    <Select
                      value={newQuest.type}
                      onValueChange={(value: "one-time" | "seasonal" | "challenge") =>
                        setNewQuest({ ...newQuest, type: value })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">One-time</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                        <SelectItem value="challenge">Challenge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quest-description" className="text-white font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="quest-description"
                    value={newQuest.description}
                    onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                    placeholder="Describe the quest objective..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coin-reward" className="text-white font-medium">
                      Coin Reward
                    </Label>
                    <Input
                      id="coin-reward"
                      type="number"
                      value={newQuest.coinReward}
                      onChange={(e) => setNewQuest({ ...newQuest, coinReward: Number.parseInt(e.target.value) })}
                      min="1"
                      max="500"
                      className="bg-white/10 border-white/20 text-white focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="xp-reward" className="text-white font-medium">
                      XP Reward
                    </Label>
                    <Input
                      id="xp-reward"
                      type="number"
                      value={newQuest.xpReward}
                      onChange={(e) => setNewQuest({ ...newQuest, xpReward: Number.parseInt(e.target.value) })}
                      min="1"
                      max="1000"
                      className="bg-white/10 border-white/20 text-white focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-white font-medium">
                      Difficulty
                    </Label>
                    <Select
                      value={newQuest.difficulty}
                      onValueChange={(value: "easy" | "medium" | "hard" | "epic") =>
                        setNewQuest({ ...newQuest, difficulty: value })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">⭐ Easy</SelectItem>
                        <SelectItem value="medium">⭐⭐ Medium</SelectItem>
                        <SelectItem value="hard">⭐⭐⭐ Hard</SelectItem>
                        <SelectItem value="epic">👑 Epic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium">Deadline (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium">Quest Requirements</Label>
                  {newQuest.requirements?.map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={requirement}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        placeholder={`Requirement ${index + 1}`}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                      />
                      {newQuest.requirements!.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-400/30"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addRequirement}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    Add Requirement
                  </Button>
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
                    onClick={handleCreateQuest}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Quest
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests.map((quest) => (
              <Card
                key={quest.id}
                className="relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <div
                  className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold bg-gradient-to-r ${getDifficultyColor(quest.difficulty)} text-white`}
                >
                  {getDifficultyIcon(quest.difficulty)} {quest.difficulty.toUpperCase()}
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg pr-16 text-white">{quest.title}</CardTitle>
                  <Badge variant="outline" className="w-fit bg-white/20 text-white border-white/30">
                    {quest.type}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-purple-200">{quest.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
                      >
                        🪙 {quest.coinReward}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 bg-purple-500/20 text-purple-300 border-purple-400/30"
                      >
                        <Star className="h-3 w-3" />
                        {quest.xpReward} XP
                      </Badge>
                    </div>
                    {quest.deadline && (
                      <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                        Due: {format(quest.deadline, "MMM dd")}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white">Requirements:</Label>
                    <div className="space-y-1">
                      {quest.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-4 border rounded-sm flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                          </div>
                          <span className="text-purple-200">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Badge
                      variant={quest.status === "active" ? "default" : "secondary"}
                      className="capitalize bg-blue-500/20 text-blue-300 border-blue-400/30"
                    >
                      {quest.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      Edit Quest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
