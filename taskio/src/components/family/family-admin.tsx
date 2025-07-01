"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { PageLayout } from "../layout/page-layout"
import { Users, UserPlus, Settings, Crown, Shield, Star, Mail, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

type FamilyMember = {
  id: string
  name: string
  email: string
  role: "parent" | "child"
  avatar: string
  joinDate: Date
  totalPoints: number
  totalCoins: number
  tasksCompleted: number
  isActive: boolean
  permissions: {
    canCreateTasks: boolean
    canManageRewards: boolean
    canViewHistory: boolean
  }
}

export function FamilyAdmin() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      name: "Mom",
      email: "mom@family.com",
      role: "parent",
      avatar: "👩‍💼",
      joinDate: new Date("2024-01-01"),
      totalPoints: 0,
      totalCoins: 0,
      tasksCompleted: 0,
      isActive: true,
      permissions: {
        canCreateTasks: true,
        canManageRewards: true,
        canViewHistory: true,
      },
    },
    {
      id: "2",
      name: "Dad",
      email: "dad@family.com",
      role: "parent",
      avatar: "👨‍💼",
      joinDate: new Date("2024-01-01"),
      totalPoints: 0,
      totalCoins: 0,
      tasksCompleted: 0,
      isActive: true,
      permissions: {
        canCreateTasks: true,
        canManageRewards: true,
        canViewHistory: true,
      },
    },
    {
      id: "3",
      name: "Alex",
      email: "alex@family.com",
      role: "child",
      avatar: "🧒",
      joinDate: new Date("2024-01-15"),
      totalPoints: 245,
      totalCoins: 156,
      tasksCompleted: 28,
      isActive: true,
      permissions: {
        canCreateTasks: false,
        canManageRewards: false,
        canViewHistory: true,
      },
    },
    {
      id: "4",
      name: "Sam",
      email: "sam@family.com",
      role: "child",
      avatar: "👧",
      joinDate: new Date("2024-01-20"),
      totalPoints: 189,
      totalCoins: 92,
      tasksCompleted: 22,
      isActive: true,
      permissions: {
        canCreateTasks: false,
        canManageRewards: false,
        canViewHistory: true,
      },
    },
  ])

  const [isInviting, setIsInviting] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "child" as "parent" | "child",
  })

  const handleInviteMember = () => {
    if (newMember.name && newMember.email) {
      const member: FamilyMember = {
        id: Date.now().toString(),
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        avatar: newMember.role === "parent" ? "👤" : "🧒",
        joinDate: new Date(),
        totalPoints: 0,
        totalCoins: 0,
        tasksCompleted: 0,
        isActive: false, // Pending invitation
        permissions: {
          canCreateTasks: newMember.role === "parent",
          canManageRewards: newMember.role === "parent",
          canViewHistory: true,
        },
      }
      setFamilyMembers([...familyMembers, member])
      setNewMember({ name: "", email: "", role: "child" })
      setIsInviting(false)
    }
  }

  const toggleMemberStatus = (id: string) => {
    setFamilyMembers(
      familyMembers.map((member) => (member.id === id ? { ...member, isActive: !member.isActive } : member)),
    )
  }

  const deleteMember = (id: string) => {
    if (window.confirm("Are you sure you want to remove this family member?")) {
      setFamilyMembers(familyMembers.filter((member) => member.id !== id))
    }
  }

  const getRoleIcon = (role: string) => {
    return role === "parent" ? Shield : Crown
  }

  const getRoleColor = (role: string) => {
    return role === "parent" ? "from-blue-500 to-purple-500" : "from-yellow-500 to-orange-500"
  }

  const activeMembers = familyMembers.filter((member) => member.isActive)
  const pendingMembers = familyMembers.filter((member) => !member.isActive)

  return (
    <PageLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Family Management</h2>
                <p className="text-purple-200">Manage family members, roles, and permissions</p>
              </div>
            </div>
            <Button
              onClick={() => setIsInviting(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>

          {/* Family Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Total Members</CardTitle>
                <Users className="h-8 w-8 text-blue-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{familyMembers.length}</div>
                <p className="text-xs text-blue-100">Active: {activeMembers.length}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-100">Family Points</CardTitle>
                <Star className="h-8 w-8 text-green-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {familyMembers.reduce((sum, member) => sum + member.totalPoints, 0)}
                </div>
                <p className="text-xs text-green-100">Total earned</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-100">Family Coins</CardTitle>
                <div className="text-2xl">🪙</div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {familyMembers.reduce((sum, member) => sum + member.totalCoins, 0)}
                </div>
                <p className="text-xs text-yellow-100">Total balance</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">Tasks Done</CardTitle>
                <Crown className="h-8 w-8 text-purple-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {familyMembers.reduce((sum, member) => sum + member.tasksCompleted, 0)}
                </div>
                <p className="text-xs text-purple-100">Family total</p>
              </CardContent>
            </Card>
          </div>

          {/* Invite Member Form */}
          {isInviting && (
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <UserPlus className="h-5 w-5 text-green-400" />
                  Invite Family Member
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-name" className="text-white font-medium">
                      Name
                    </Label>
                    <Input
                      id="member-name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="Enter name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-email" className="text-white font-medium">
                      Email
                    </Label>
                    <Input
                      id="member-email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      placeholder="Enter email address"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-role" className="text-white font-medium">
                    Role
                  </Label>
                  <Select
                    value={newMember.role}
                    onValueChange={(value: "parent" | "child") => setNewMember({ ...newMember, role: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">👑 Parent (Full Access)</SelectItem>
                      <SelectItem value="child">🧒 Child (Limited Access)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsInviting(false)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInviteMember}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Members */}
          {activeMembers.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Users className="h-5 w-5" />
                Active Family Members ({activeMembers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeMembers.map((member) => {
                  const RoleIcon = getRoleIcon(member.role)
                  return (
                    <Card
                      key={member.id}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{member.avatar}</div>
                            <div>
                              <CardTitle className="text-lg text-white flex items-center gap-2">
                                {member.name}
                                <div className={`bg-gradient-to-r ${getRoleColor(member.role)} p-1 rounded-lg`}>
                                  <RoleIcon className="h-4 w-4 text-white" />
                                </div>
                              </CardTitle>
                              <p className="text-purple-200 text-sm">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => deleteMember(member.id)}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Badge
                            className={`bg-gradient-to-r ${getRoleColor(member.role)} text-white font-bold capitalize`}
                          >
                            {member.role}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-green-500/20 text-green-300 border-green-400/30 text-xs"
                          >
                            Joined {format(member.joinDate, "MMM yyyy")}
                          </Badge>
                        </div>

                        {member.role === "child" && (
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-white/10 rounded-xl">
                              <div className="text-lg font-bold text-yellow-400">{member.totalPoints}</div>
                              <div className="text-xs text-purple-200">Points</div>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl">
                              <div className="text-lg font-bold text-green-400">{member.totalCoins}</div>
                              <div className="text-xs text-purple-200">Coins</div>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl">
                              <div className="text-lg font-bold text-blue-400">{member.tasksCompleted}</div>
                              <div className="text-xs text-purple-200">Tasks</div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-white">Permissions:</Label>
                          <div className="flex flex-wrap gap-2">
                            {member.permissions.canCreateTasks && (
                              <Badge
                                variant="outline"
                                className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs"
                              >
                                Create Tasks
                              </Badge>
                            )}
                            {member.permissions.canManageRewards && (
                              <Badge
                                variant="outline"
                                className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs"
                              >
                                Manage Rewards
                              </Badge>
                            )}
                            {member.permissions.canViewHistory && (
                              <Badge
                                variant="outline"
                                className="bg-green-500/20 text-green-300 border-green-400/30 text-xs"
                              >
                                View History
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center space-x-2">
                            <Switch checked={member.isActive} onCheckedChange={() => toggleMemberStatus(member.id)} />
                            <Label className="text-white text-sm">Active</Label>
                          </div>
                          <Button
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white border border-white/20 rounded-lg"
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Settings
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Pending Invitations */}
          {pendingMembers.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Mail className="h-5 w-5" />
                Pending Invitations ({pendingMembers.length})
              </h3>
              <div className="space-y-4">
                {pendingMembers.map((member) => (
                  <Card
                    key={member.id}
                    className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-400/30 shadow-xl"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{member.avatar}</div>
                          <div>
                            <h4 className="font-bold text-white">{member.name}</h4>
                            <p className="text-yellow-200 text-sm">{member.email}</p>
                          </div>
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                            Invitation Sent
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-400/30 rounded-lg"
                          >
                            Resend
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => deleteMember(member.id)}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 rounded-lg"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
