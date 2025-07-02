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
    <div className={userRole === 'child' ? "min-h-screen p-4" : "space-y-6"} style={userRole === 'child' ? {
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd, #ff6b6b)',
      backgroundSize: '400% 400%',
      animation: 'rainbow 3s ease infinite'
    } : {}}>
      {userRole === 'child' && (
        <style>{`
          @keyframes rainbow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes quest-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes epic-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.5); }
            50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.8); }
          }
        `}</style>
      )}
      <div className={userRole === 'child' ? "max-w-6xl mx-auto space-y-6" : "space-y-6"}>

        {/* Active Quests */}
        <div>
          <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${userRole === 'child' ? 'text-purple-800 text-3xl animate-bounce' : ''}`}>
            <Sword className={`h-6 w-6 text-blue-500 ${userRole === 'child' ? 'h-8 w-8 animate-spin' : ''}`} />
            {userRole === 'child' ? '⚔️ EPIC QUESTS! ⚔️' : 'Active Quests'}
            {activeQuests.length > 0 && (
              <Badge className={userRole === 'child' ? 'bg-purple-500 text-white animate-pulse text-lg' : ''} variant="secondary">{activeQuests.length}</Badge>
            )}
          </h2>
          {activeQuests.length === 0 ? (
            <Card className={userRole === 'child' ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-purple-400 shadow-xl transform hover:scale-105 transition-all duration-300' : ''}>
              <CardContent className="text-center py-12">
                <Target className={`h-12 w-12 text-gray-400 mx-auto mb-4 ${userRole === 'child' ? 'text-purple-500 h-16 w-16 animate-bounce' : ''}`} />
                <p className={`text-gray-500 text-lg mb-2 ${userRole === 'child' ? 'text-purple-700 text-xl font-bold' : ''}`}>
                  {userRole === 'child' ? 'No epic quests available right now! 😢' : 'No active quests available.'}
                </p>
                {userRole === 'child' && (
                  <p className="text-sm text-purple-600 font-bold animate-pulse">Ask your parent to create some LEGENDARY quests for you! 🎮🔥</p>
                )}
                {userRole === 'parent' && (
                  <p className="text-sm text-gray-400">Create some quests to challenge your child! 💪</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeQuests.map((quest, index) => (
                <Card 
                  key={quest.id} 
                  className={`transition-all ${
                    userRole === 'child' 
                      ? 'bg-gradient-to-br from-white to-blue-50 border-4 border-blue-400 shadow-xl transform hover:scale-105 hover:rotate-1 hover:shadow-2xl' 
                      : 'hover:shadow-lg border-l-4 border-l-blue-500'
                  }`}
                  style={userRole === 'child' ? {
                    animation: `quest-bounce 2s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`
                  } : {}}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className={`flex items-center gap-2 text-lg ${userRole === 'child' ? 'text-purple-800 text-xl font-bold' : ''}`}>
                          <span className={userRole === 'child' ? 'text-2xl animate-spin' : ''}>
                            {getDifficultyIcon(quest.difficulty)}
                          </span>
                          {quest.title}
                          <Badge 
                            variant="outline" 
                            className={`${getDifficultyColor(quest.difficulty)} text-white border-none ${
                              userRole === 'child' ? 'text-lg font-bold animate-pulse' : ''
                            }`}
                          >
                            {userRole === 'child' ? quest.difficulty.toUpperCase() + '!' : quest.difficulty}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={`${getCategoryColor(quest.category)} ${
                              userRole === 'child' ? 'font-bold animate-bounce' : ''
                            }`}
                          >
                            {quest.category}
                          </Badge>
                        </CardTitle>
                        <p className={`text-gray-600 mt-2 ${userRole === 'child' ? 'text-purple-700 font-medium' : ''}`}>
                          {quest.description}
                        </p>
                      </div>
                      {quest.dueDate && (
                        <div className={`flex items-center gap-1 text-sm text-gray-500 ${userRole === 'child' ? 'text-purple-600 font-bold animate-pulse' : ''}`}>
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
                        <div className={`flex items-center gap-1 ${userRole === 'child' ? 'animate-bounce' : ''}`}>
                          <Trophy className={`h-4 w-4 text-yellow-500 ${userRole === 'child' ? 'h-5 w-5 animate-spin' : ''}`} />
                          <span className={`text-sm font-medium ${userRole === 'child' ? 'text-lg font-bold text-yellow-600' : ''}`}>
                            🪙 {quest.coinReward} coins{userRole === 'child' ? '!' : ''}
                          </span>
                        </div>
                        {quest.xpReward && (
                          <div className={`flex items-center gap-1 ${userRole === 'child' ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>
                            <Star className={`h-4 w-4 text-blue-500 ${userRole === 'child' ? 'h-5 w-5 animate-pulse' : ''}`} />
                            <span className={`text-sm font-medium ${userRole === 'child' ? 'text-lg font-bold text-blue-600' : ''}`}>
                              ⭐ {quest.xpReward} XP{userRole === 'child' ? '!' : ''}
                            </span>
                          </div>
                        )}
                        {quest.bonusReward && (
                          <div className={`flex items-center gap-1 ${userRole === 'child' ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.2s' }}>
                            <Star className={`h-4 w-4 text-purple-500 ${userRole === 'child' ? 'h-5 w-5 animate-spin' : ''}`} />
                            <span className={`text-sm font-medium ${userRole === 'child' ? 'text-lg font-bold text-purple-600' : ''}`}>
                              🌟 {quest.bonusReward}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-sm font-medium ${userRole === 'child' ? 'text-lg font-bold text-purple-700' : ''}`}>
                            {userRole === 'child' ? '🚀 Progress' : 'Progress'}
                          </span>
                          <span className={`text-sm text-gray-500 ${userRole === 'child' ? 'text-lg font-bold text-purple-600' : ''}`}>
                            {Math.round(quest.progress)}%{userRole === 'child' ? ' Complete!' : ''}
                          </span>
                        </div>
                        <Progress 
                          value={quest.progress} 
                          className={`w-full ${userRole === 'child' ? 'h-3 shadow-lg' : ''}`} 
                        />
                      </div>

                      {/* Objectives */}
                      <div>
                        <h4 className={`text-sm font-medium mb-2 ${userRole === 'child' ? 'text-lg font-bold text-purple-700' : ''}`}>
                          {userRole === 'child' ? '🎯 Epic Objectives:' : 'Objectives:'}
                        </h4>
                        <div className="space-y-2">
                          {quest.objectives.map((objective) => (
                            <div 
                              key={objective.id} 
                              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                                userRole === 'child' 
                                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 hover:shadow-md transform hover:scale-102' 
                                  : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex-1">
                                <span className={`text-sm ${
                                  objective.completed 
                                    ? `line-through ${userRole === 'child' ? 'text-green-600 font-bold' : 'text-gray-500'}` 
                                    : userRole === 'child' ? 'font-bold text-purple-700' : ''
                                }`}>
                                  {userRole === 'child' ? '✨ ' : ''}{objective.title}
                                </span>
                                {objective.description && (
                                  <p className={`text-xs mt-1 ${userRole === 'child' ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>
                                    {objective.description}
                                  </p>
                                )}
                                {!objective.required && (
                                  <Badge 
                                    variant="outline" 
                                    className={`mt-1 text-xs ${userRole === 'child' ? 'bg-yellow-100 text-yellow-700 font-bold' : ''}`}
                                  >
                                    {userRole === 'child' ? '🌟 Optional' : 'Optional'}
                                  </Badge>
                                )}
                              </div>
                              {userRole === 'child' && !objective.completed && (
                                <Button
                                  size="sm"
                                  onClick={() => handleCompleteObjective(quest.id!, objective.id)}
                                  className="ml-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold transform hover:scale-105"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Complete!
                                </Button>
                              )}
                              {objective.completed && (
                                <CheckCircle2 className={`h-4 w-4 text-green-500 ml-2 ${userRole === 'child' ? 'h-6 w-6 animate-spin' : ''}`} />
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
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${userRole === 'child' ? 'text-green-700 text-3xl animate-bounce' : ''}`}>
              <Trophy className={`h-6 w-6 text-yellow-500 ${userRole === 'child' ? 'h-8 w-8 animate-spin' : ''}`} />
              {userRole === 'child' ? '🏆 LEGENDARY VICTORIES! 🏆' : 'Completed Quests'}
              <Badge className={userRole === 'child' ? 'bg-green-500 text-white animate-pulse text-lg' : ''} variant="secondary">
                {completedQuests.length}
              </Badge>
            </h2>
            <div className="space-y-4">
              {completedQuests.map((quest, index) => (
                <Card 
                  key={quest.id} 
                  className={`${
                    userRole === 'child' 
                      ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-400 shadow-xl transform hover:scale-105' 
                      : 'opacity-75 border-l-4 border-l-green-500'
                  }`}
                  style={userRole === 'child' ? {
                    animation: 'epic-glow 2s ease-in-out infinite',
                    animationDelay: `${index * 0.3}s`
                  } : {}}
                >
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-lg ${userRole === 'child' ? 'text-green-800 text-xl font-bold' : ''}`}>
                      <CheckCircle2 className={`h-5 w-5 text-green-500 ${userRole === 'child' ? 'h-7 w-7 animate-bounce' : ''}`} />
                      {quest.title}
                      <Badge 
                        variant="outline" 
                        className={`bg-green-500 text-white border-none ${userRole === 'child' ? 'text-lg font-bold animate-pulse' : ''}`}
                      >
                        {userRole === 'child' ? '🎉 COMPLETED! 🎉' : 'Completed'}
                      </Badge>
                      {quest.completedAt && (
                        <div className={`flex items-center gap-1 text-sm text-gray-500 ml-auto ${userRole === 'child' ? 'text-green-600 font-bold' : ''}`}>
                          <Calendar className="h-4 w-4" />
                          {format(quest.completedAt, 'MMM dd, yyyy')}
                        </div>
                      )}
                    </CardTitle>
                    <p className={`text-gray-600 ${userRole === 'child' ? 'text-green-700 font-medium' : ''}`}>
                      {quest.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 flex-wrap">
                      <div className={`flex items-center gap-1 ${userRole === 'child' ? 'animate-bounce' : ''}`}>
                        <Trophy className={`h-4 w-4 text-yellow-500 ${userRole === 'child' ? 'h-5 w-5' : ''}`} />
                        <span className={`text-sm font-medium ${userRole === 'child' ? 'text-lg font-bold text-yellow-600' : ''}`}>
                          🪙 {quest.coinReward} coins earned{userRole === 'child' ? '!' : ''}
                        </span>
                      </div>
                      {quest.xpReward && (
                        <div className={`flex items-center gap-1 ${userRole === 'child' ? 'animate-bounce' : ''}`}>
                          <Star className={`h-4 w-4 text-blue-500 ${userRole === 'child' ? 'h-5 w-5' : ''}`} />
                          <span className={`text-sm font-medium ${userRole === 'child' ? 'text-lg font-bold text-blue-600' : ''}`}>
                            ⭐ {quest.xpReward} XP earned{userRole === 'child' ? '!' : ''}
                          </span>
                        </div>
                      )}
                      {quest.bonusReward && (
                        <div className={`flex items-center gap-1 ${userRole === 'child' ? 'animate-bounce' : ''}`}>
                          <Star className={`h-4 w-4 text-purple-500 ${userRole === 'child' ? 'h-5 w-5' : ''}`} />
                          <span className={`text-sm font-medium ${userRole === 'child' ? 'text-lg font-bold text-purple-600' : ''}`}>
                            🌟 Bonus: {quest.bonusReward}
                          </span>
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
    </div>
  )
}
