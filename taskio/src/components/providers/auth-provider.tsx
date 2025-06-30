"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Mock Firebase types - replace with actual Firebase imports
type User = {
  uid: string
  email: string
  displayName: string
}

type UserRole = "parent" | "child"

type AuthContextType = {
  user: User | null
  userRole: UserRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role: UserRole) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock authentication - replace with Firebase auth
    const mockUser = {
      uid: "mock-user-id",
      email: "parent@example.com",
      displayName: "Parent User",
    }

    setTimeout(() => {
      setUser(mockUser)
      setUserRole("parent") // Change to 'child' to test child dashboard
      setLoading(false)
    }, 1000)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Implement Firebase signIn
    console.log("Sign in:", email)
  }

  const signUp = async (email: string, password: string, role: UserRole) => {
    // Implement Firebase signUp
    console.log("Sign up:", email, role)
  }

  const signOut = async () => {
    // Implement Firebase signOut
    setUser(null)
    setUserRole(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
