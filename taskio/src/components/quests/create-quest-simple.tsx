"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Construction, Sword } from "lucide-react"

export function CreateQuest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/50 backdrop-blur-sm border-purple-200">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sword className="h-8 w-8 text-purple-600" />
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Quest Creator
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Construction className="h-12 w-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Quest System Under Development
            </h3>
            <p className="text-gray-600">
              The quest creation system is currently being built. This feature will allow parents to create 
              exciting adventures and challenges for their children to complete and earn rewards.
            </p>
            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <p>✨ Coming Soon:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Multi-step quest creation</li>
                <li>Difficulty levels and categories</li>
                <li>Custom rewards and bonuses</li>
                <li>Quest templates and suggestions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
