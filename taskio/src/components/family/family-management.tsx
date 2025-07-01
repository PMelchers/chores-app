"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Users, UserPlus, Mail, Crown, Baby, Trash2, Send, CheckCircle, XCircle, Clock } from "lucide-react"
import { useAuth } from "../providers/auth-provider"
import { databaseService, type Family, type FamilyInvitation, type User } from "../../firebase/database"
import { format } from "date-fns"

export function FamilyManagement() {
  const { user, userRole } = useAuth()
  const [family, setFamily] = useState<Family | null>(null)
  const [familyMembers, setFamilyMembers] = useState<{ parents: User[], children: User[] }>({ parents: [], children: [] })
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [familyName, setFamilyName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'parent' | 'child'>('child')
  const [submitting, setSubmitting] = useState(false)

  // Load family data
  useEffect(() => {
    loadFamilyData()
  }, [user])

  const loadFamilyData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Get user's family
      const userFamily = await databaseService.getFamilyForUser(user.uid)
      setFamily(userFamily)

      if (userFamily) {
        // Get family members
        const members = await databaseService.getFamilyMembers(userFamily.id!)
        setFamilyMembers(members)
      }

      // Get pending invitations for current user
      const userInvitations = await databaseService.getInvitationsForUser(user.email!)
      setInvitations(userInvitations)

      setError(null)
    } catch (err) {
      console.error('Error loading family data:', err)
      setError('Failed to load family information')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFamily = async () => {
    if (!user || !familyName.trim()) return

    try {
      setSubmitting(true)
      const familyId = await databaseService.createFamily(familyName.trim(), user.uid)
      console.log('Family created with ID:', familyId)
      
      setFamilyName('')
      await loadFamilyData()
    } catch (err) {
      console.error('Error creating family:', err)
      setError('Failed to create family')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSendInvitation = async () => {
    if (!user || !family || !inviteEmail.trim()) return

    try {
      setSubmitting(true)
      await databaseService.sendFamilyInvitation(
        family.id!,
        inviteEmail.trim(),
        inviteRole,
        user.uid,
        user.displayName || user.email || 'Parent'
      )
      
      setInviteEmail('')
      setInviteRole('child')
      await loadFamilyData()
    } catch (err: any) {
      console.error('Error sending invitation:', err)
      setError(err.message || 'Failed to send invitation')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAcceptInvitation = async (invitationId: string) => {
    if (!user) return

    try {
      setSubmitting(true)
      await databaseService.acceptFamilyInvitation(invitationId, user.uid)
      await loadFamilyData()
    } catch (err: any) {
      console.error('Error accepting invitation:', err)
      setError(err.message || 'Failed to accept invitation')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      setSubmitting(true)
      await databaseService.declineFamilyInvitation(invitationId)
      await loadFamilyData()
    } catch (err: any) {
      console.error('Error declining invitation:', err)
      setError(err.message || 'Failed to decline invitation')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!family || !window.confirm('Are you sure you want to remove this member from the family?')) return

    try {
      setSubmitting(true)
      await databaseService.removeUserFromFamily(family.id!, userId)
      await loadFamilyData()
    } catch (err: any) {
      console.error('Error removing member:', err)
      setError(err.message || 'Failed to remove member')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading family information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold">Family Management</h1>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setError(null)}
              className="mt-2"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              Family Invitations
              <Badge variant="secondary">{invitations.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{invitation.familyName}</h4>
                    <Badge variant="outline" className={invitation.role === 'parent' ? 'border-purple-300 text-purple-700' : 'border-blue-300 text-blue-700'}>
                      {invitation.role === 'parent' ? 'Parent' : 'Child'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Invited by {invitation.invitedByName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires {format(invitation.expiresAt instanceof Date ? invitation.expiresAt : invitation.expiresAt.toDate(), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptInvitation(invitation.id!)}
                    disabled={submitting}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeclineInvitation(invitation.id!)}
                    disabled={submitting}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {!family ? (
        /* Create Family */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-500" />
              Create Your Family
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Create a family to start managing chores, quests, and rewards together!
            </p>
            <div className="space-y-2">
              <Label htmlFor="familyName">Family Name</Label>
              <Input
                id="familyName"
                placeholder="e.g., The Johnson Family"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                disabled={submitting}
              />
            </div>
            <Button 
              onClick={handleCreateFamily}
              disabled={!familyName.trim() || submitting}
              className="w-full"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create Family
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Family Overview */
        <div className="space-y-6">
          {/* Family Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                {family.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Parents */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    Parents ({familyMembers.parents.length})
                  </h4>
                  <div className="space-y-2">
                    {familyMembers.parents.map((parent) => (
                      <div key={parent.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium">{parent.displayName || parent.email}</p>
                          <p className="text-sm text-gray-600">{parent.email}</p>
                        </div>
                        {userRole === 'parent' && parent.id !== user?.uid && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveMember(parent.id)}
                            disabled={submitting}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Children */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Baby className="h-4 w-4 text-blue-500" />
                    Children ({familyMembers.children.length})
                  </h4>
                  <div className="space-y-2">
                    {familyMembers.children.length === 0 ? (
                      <p className="text-gray-500 text-sm p-3 bg-gray-50 rounded-lg">
                        No children in the family yet. Invite some kids to get started!
                      </p>
                    ) : (
                      familyMembers.children.map((child) => (
                        <div key={child.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">{child.displayName || child.email}</p>
                              <p className="text-sm text-gray-600">{child.email}</p>
                            </div>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                              {child.coins || 0} coins
                            </Badge>
                          </div>
                          {userRole === 'parent' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveMember(child.id)}
                              disabled={submitting}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invite Members (Parents only) */}
          {userRole === 'parent' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-green-500" />
                  Invite Family Member
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inviteEmail">Email Address</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      placeholder="family@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inviteRole">Role</Label>
                    <Select value={inviteRole} onValueChange={(value: 'parent' | 'child') => setInviteRole(value)} disabled={submitting}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button 
                      onClick={handleSendInvitation}
                      disabled={!inviteEmail.trim() || submitting}
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Invite
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
