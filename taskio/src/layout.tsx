import type React from "react"
import "./index.css"
import { AuthProvider } from "./components/providers/auth-provider"
import { Toaster } from "./components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </div>
  )
}
