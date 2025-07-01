import { Loader2, Sparkles } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
      </div>
    </div>
  )
}
