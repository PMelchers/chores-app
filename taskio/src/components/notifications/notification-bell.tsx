"use client"

import { useState, useEffect } from 'react'
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Bell, Users, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "../providers/auth-provider"
import { databaseService, type FamilyInvitation } from "../../firebase/database"
import { format } from "date-fns"

export function NotificationBell() {
  const { user } = useAuth()
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadInvitations()
  }, [user])

  const loadInvitations = async () => {
    if (!user?.email) return

    try {
      const userInvitations = await databaseService.getInvitationsForUser(user.email)
      setInvitations(userInvitations)
    } catch (error) {
      console.error('Error loading invitations:', error)
    }
  }

  const handleAcceptInvitation = async (invitationId: string) => {
    if (!user) return

    try {
      setLoading(true)
      await databaseService.acceptFamilyInvitation(invitationId, user.uid)
      await loadInvitations()
    } catch (error) {
      console.error('Error accepting invitation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      setLoading(true)
      await databaseService.declineFamilyInvitation(invitationId)
      await loadInvitations()
    } catch (error) {
      console.error('Error declining invitation:', error)
    } finally {
      setLoading(false)
    }
  }

  if (invitations.length === 0) {
    return (
      <div className="relative">
        <Bell className="h-5 w-5 text-gray-400" />
      </div>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {invitations.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <h4 className="font-medium">Family Invitations</h4>
            <Badge variant="secondary">{invitations.length}</Badge>
          </div>
          
          <div className="space-y-3">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="p-3 border rounded-lg space-y-2">
                <div>
                  <p className="font-medium text-sm">{invitation.familyName}</p>
                  <p className="text-xs text-gray-600">
                    Invited by {invitation.invitedByName} as {invitation.role}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires {format(invitation.expiresAt instanceof Date ? invitation.expiresAt : invitation.expiresAt.toDate(), 'MMM dd')}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptInvitation(invitation.id!)}
                    disabled={loading}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeclineInvitation(invitation.id!)}
                    disabled={loading}
                    className="flex-1"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
