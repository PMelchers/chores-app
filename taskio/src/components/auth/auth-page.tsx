"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useAuth } from "../providers/auth-provider"
import { LoadingSpinner } from "../ui/loading-spinner"
import { PageLayout } from "../layout/page-layout"
import { Crown, Shield, Star, Sparkles, Heart, Trophy, Target, Zap } from "lucide-react"

export function AuthPage() {
  const { signIn, signUp, loading, error } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"parent" | "child">("child")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      await signIn(email, password)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password && password === confirmPassword) {
      await signUp(email, password, role)
    }
  }

  return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 w-8 h-8 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-4 w-4 text-yellow-900" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">TaskIO</h1>
            <p className="text-purple-200 text-lg">Your Family's Epic Adventure Hub! 🌟</p>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Welcome Back!</CardTitle>
              <CardDescription className="text-purple-200 text-lg">Sign in to continue your adventure</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
                  <TabsTrigger
                    value="signin"
                    className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-6 mt-6">
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-white font-medium">
                        Email
                      </Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-white font-medium">
                        Password
                      </Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400 h-12"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 backdrop-blur-sm animate-shake">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          {error}
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 font-bold text-lg"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner />
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          <span>Sign In</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-6 mt-6">
                  <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white font-medium">
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white font-medium">
                        Password
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-white font-medium">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400 h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-white font-medium">Choose Your Role</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          onClick={() => setRole("child")}
                          className={`h-20 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-200 ${
                            role === "child"
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105"
                              : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                          }`}
                        >
                          <Crown className="h-6 w-6" />
                          <span className="font-bold">Child</span>
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setRole("parent")}
                          className={`h-20 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-200 ${
                            role === "parent"
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105"
                              : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                          }`}
                        >
                          <Shield className="h-6 w-6" />
                          <span className="font-bold">Parent</span>
                        </Button>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 backdrop-blur-sm animate-shake">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          {error}
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading || password !== confirmPassword}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-12 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 font-bold text-lg"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner />
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          <span>Start Adventure</span>
                        </div>
                      )}
                    </Button>

                    {password !== confirmPassword && confirmPassword && (
                      <p className="text-red-300 text-sm text-center">Passwords don't match!</p>
                    )}
                  </form>
                </TabsContent>
              </Tabs>

              {/* Features */}
              <div className="mt-8 space-y-4">
                <div className="text-center">
                  <p className="text-purple-200 font-medium mb-4">What makes TaskIO special?</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-white/10 rounded-xl border border-white/20">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    <span className="text-white text-sm font-medium">Earn Rewards</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white/10 rounded-xl border border-white/20">
                    <Target className="h-5 w-5 text-green-400" />
                    <span className="text-white text-sm font-medium">Track Progress</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white/10 rounded-xl border border-white/20">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-white text-sm font-medium">Family Fun</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white/10 rounded-xl border border-white/20">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <span className="text-white text-sm font-medium">Epic Adventures</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-purple-300 text-sm">Join thousands of families making chores fun! 🎉</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </PageLayout>
  )
}
