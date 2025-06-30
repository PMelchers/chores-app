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
import { Plus, CalendarIcon, Sword, Star } from "lucide-react"
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
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-orange-100 text-orange-800",
      epic: "bg-purple-100 text-purple-800",
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quest Management</h2>
          <p className="text-muted-foreground">Create epic quests and seasonal challenges</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Quest
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sword className="h-5 w-5" />
              Create New Quest
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quest-title">Quest Title</Label>
                <Input
                  id="quest-title"
                  value={newQuest.title}
                  onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
                  placeholder="e.g., Math Master Challenge"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quest-type">Quest Type</Label>
                <Select
                  value={newQuest.type}
                  onValueChange={(value: "one-time" | "seasonal" | "challenge") =>
                    setNewQuest({ ...newQuest, type: value })
                  }
                >
                  <SelectTrigger>
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
              <Label htmlFor="quest-description">Description</Label>
              <Textarea
                id="quest-description"
                value={newQuest.description}
                onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                placeholder="Describe the quest objective..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coin-reward">Coin Reward</Label>
                <Input
                  id="coin-reward"
                  type="number"
                  value={newQuest.coinReward}
                  onChange={(e) => setNewQuest({ ...newQuest, coinReward: Number.parseInt(e.target.value) })}
                  min="1"
                  max="500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xp-reward">XP Reward</Label>
                <Input
                  id="xp-reward"
                  type="number"
                  value={newQuest.xpReward}
                  onChange={(e) => setNewQuest({ ...newQuest, xpReward: Number.parseInt(e.target.value) })}
                  min="1"
                  max="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={newQuest.difficulty}
                  onValueChange={(value: "easy" | "medium" | "hard" | "epic") =>
                    setNewQuest({ ...newQuest, difficulty: value })
                  }
                >
                  <SelectTrigger>
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
              <Label>Deadline (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
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
              <Label>Quest Requirements</Label>
              {newQuest.requirements?.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                  />
                  {newQuest.requirements!.length > 1 && (
                    <Button variant="outline" size="sm" onClick={() => removeRequirement(index)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addRequirement} className="w-full bg-transparent">
                Add Requirement
              </Button>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQuest}>Create Quest</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => (
          <Card key={quest.id} className="relative overflow-hidden">
            <div
              className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold ${getDifficultyColor(quest.difficulty)}`}
            >
              {getDifficultyIcon(quest.difficulty)} {quest.difficulty.toUpperCase()}
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg pr-16">{quest.title}</CardTitle>
              <Badge variant="outline" className="w-fit">
                {quest.type}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{quest.description}</p>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    🪙 {quest.coinReward}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {quest.xpReward} XP
                  </Badge>
                </div>
                {quest.deadline && (
                  <Badge variant="outline" className="text-xs">
                    Due: {format(quest.deadline, "MMM dd")}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Requirements:</Label>
                <div className="space-y-1">
                  {quest.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 border rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                      </div>
                      <span className="text-muted-foreground">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Badge variant={quest.status === "active" ? "default" : "secondary"} className="capitalize">
                  {quest.status}
                </Badge>
                <Button size="sm" variant="outline">
                  Edit Quest
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
