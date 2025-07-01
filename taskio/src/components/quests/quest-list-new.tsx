"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Sword, Trophy, Star, Clock, CheckCircle2, Loader2, Calendar, Target } from "lucide-react"
import { format } from "date-fns"
import { useQuests } from "../../hooks/useQuests"
import { useAuth } from "../providers/auth-provider"
import { type Quest } from "../../firebase/database"

export function QuestList() {
  const { quests, loading, error, completeObjective } = useQuests()
  const { userRole } = useAuth()

  const handleCompleteObjective = async (questId: string, objectiveId: string) => {
    try {
      await completeObjective(questId, objectiveId)
    } catch (err) {
      console.error('Error completing objective:', err)
    }
  }

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-orange-500'
      case 'epic': return 'bg-red-500'
      case 'legendary': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getDifficultyIcon = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return <Star className="h-4 w-4" />
      case 'medium': return <Sword className="h-4 w-4" />
      case 'hard': return <Trophy className="h-4 w-4" />
      case 'epic': return <Trophy className="h-4 w-4 text-purple-400" />
      case 'legendary': return <Trophy className="h-4 w-4 text-yellow-400" />
      default: return <Star className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: Quest['category']) => {
    switch (category) {
      case 'daily': return 'bg-blue-100 text-blue-800'
      case 'weekly': return 'bg-green-100 text-green-800'
      case 'monthly': return 'bg-purple-100 text-purple-800'
      case 'special': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading quests...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  const activeQuests = quests.filter(quest => quest.status === 'active')
  const completedQuests = quests.filter(quest => quest.status === 'completed')

  return (
    <div className="space-y-6">

      {/* Active Quests */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sword className="h-6 w-6 text-blue-500" />
          Active Quests
          {activeQuests.length > 0 && (
            <Badge variant="secondary">{activeQuests.length}</Badge>
          )}
        </h2>
        {activeQuests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No active quests available.</p>
              {userRole === 'child' && (
                <p className="text-sm text-gray-400">Ask your parent to create some epic quests for you! 🎮</p>
              )}
              {userRole === 'parent' && (
                <p className="text-sm text-gray-400">Create some quests to challenge your child! 💪</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeQuests.map((quest) => (
              <Card key={quest.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getDifficultyIcon(quest.difficulty)}
                        {quest.title}
                        <Badge variant="outline" className={`${getDifficultyColor(quest.difficulty)} text-white border-none`}>
                          {quest.difficulty}
                        </Badge>
                        <Badge variant="secondary" className={getCategoryColor(quest.category)}>
                          {quest.category}
                        </Badge>
                      </CardTitle>
                      <p className="text-gray-600 mt-2">{quest.description}</p>
                    </div>
                    {quest.dueDate && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {format(quest.dueDate, 'MMM dd')}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Rewards */}
                    <div className="flex gap-4 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{quest.coinReward} coins</span>
                      </div>
                      {quest.xpReward && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">{quest.xpReward} XP</span>
                        </div>
                      )}
                      {quest.bonusReward && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">{quest.bonusReward}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-500">{Math.round(quest.progress)}%</span>
                      </div>
                      <Progress value={quest.progress} className="w-full" />
                    </div>

                    {/* Objectives */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Objectives:</h4>
                      <div className="space-y-2">
                        {quest.objectives.map((objective) => (
                          <div key={objective.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <span className={`text-sm ${objective.completed ? 'line-through text-gray-500' : ''}`}>
                                {objective.title}
                              </span>
                              {objective.description && (
                                <p className="text-xs text-gray-400 mt-1">{objective.description}</p>
                              )}
                              {!objective.required && (
                                <Badge variant="outline" className="mt-1 text-xs">Optional</Badge>
                              )}
                            </div>
                            {userRole === 'child' && !objective.completed && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCompleteObjective(quest.id!, objective.id)}
                                className="ml-2"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                            {objective.completed && (
                              <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Completed Quests
            <Badge variant="secondary">{completedQuests.length}</Badge>
          </h2>
          <div className="space-y-4">
            {completedQuests.map((quest) => (
              <Card key={quest.id} className="opacity-75 border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    {quest.title}
                    <Badge variant="outline" className="bg-green-500 text-white border-none">
                      Completed
                    </Badge>
                    {quest.completedAt && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 ml-auto">
                        <Calendar className="h-4 w-4" />
                        {format(quest.completedAt, 'MMM dd, yyyy')}
                      </div>
                    )}
                  </CardTitle>
                  <p className="text-gray-600">{quest.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{quest.coinReward} coins earned</span>
                    </div>
                    {quest.xpReward && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{quest.xpReward} XP earned</span>
                      </div>
                    )}
                    {quest.bonusReward && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Bonus: {quest.bonusReward}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
