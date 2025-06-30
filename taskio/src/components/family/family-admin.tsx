"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { Switch } from "../ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Users, UserPlus, Settings, Mail, Trash2, Crown } from "lucide-react"

type FamilyMember = {
  id: string
  name: string
  email: string
  role: "parent" | "child"
  status: "active" | "pending" | "inactive"
  joinedDate: Date
  level?: number
  totalCoins?: number
}

type FamilySettings = {
  requireApprovalForTasks: boolean
  requireApprovalForRewards: boolean
  allowChildToChildCoinTransfer: boolean
  maxDailyScreenTime: number
  weeklyAllowance: number
  familyName: string
}

export function FamilyAdmin() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      name: "Parent User",
      email: "parent@example.com",
      role: "parent",
      status: "active",
      joinedDate: new Date("2024-01-01"),
    },
    {
      id: "2",
      name: "Emma",
      email: "emma@family.com",
      role: "child",
      status: "active",
      joinedDate: new Date("2024-01-15"),
      level: 8,
      totalCoins: 156,
    },
    {
      id: "3",
      name: "Jake",
      email: "jake@family.com",
      role: "child",
      status: "active",
      joinedDate: new Date("2024-02-01"),
      level: 7,
      totalCoins: 134,
    },
    {
      id: "4",
      name: "Sophie",
      email: "sophie@family.com",
      role: "child",
      status: "active",
      joinedDate: new Date("2024-02-15"),
      level: 5,
      totalCoins: 89,
    },
    {
      id: "5",
      name: "Co-Parent",
      email: "coparent@example.com",
      role: "parent",
      status: "pending",
      joinedDate: new Date(),
    },
  ])

  const [familySettings, setFamilySettings] = useState<FamilySettings>({
    requireApprovalForTasks: true,
    requireApprovalForRewards: true,
    allowChildToChildCoinTransfer: false,
    maxDailyScreenTime: 120,
    weeklyAllowance: 10,
    familyName: "The Johnson Family",
  })

  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"parent" | "child">("child")
  const [isInviting, setIsInviting] = useState(false)

  const handleInviteMember = () => {
    if (inviteEmail) {
      const newMember: FamilyMember = {
        id: Date.now().toString(),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        status: "pending",
        joinedDate: new Date(),
      }
      setFamilyMembers([...familyMembers, newMember])
      setInviteEmail("")
      setIsInviting(false)
    }
  }

  const handleRemoveMember = (memberId: string) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== memberId))
  }

  const updateFamilySetting = (key: keyof FamilySettings, value: any) => {
    setFamilySettings({ ...familySettings, [key]: value })
  }

  const activeMembers = familyMembers.filter((member) => member.status === "active")
  const pendingMembers = familyMembers.filter((member) => member.status === "pending")
  const parents = familyMembers.filter((member) => member.role === "parent")
  const children = familyMembers.filter((member) => member.role === "child")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Family Management</h2>
          <p className="text-muted-foreground">Manage family members, permissions, and settings</p>
        </div>
        <Button onClick={() => setIsInviting(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Family Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{familyMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Parents</p>
                <p className="text-2xl font-bold text-blue-600">{parents.length}</p>
              </div>
              <Crown className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Children</p>
                <p className="text-2xl font-bold text-green-600">{children.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{pendingMembers.length}</p>
              </div>
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite Member Modal */}
      {isInviting && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite Family Member
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="member@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={(value: "parent" | "child") => setInviteRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">👑 Parent</SelectItem>
                    <SelectItem value="child">👶 Child</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsInviting(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteMember}>Send Invitation</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Family Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {familyMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{member.role === "parent" ? "👑" : "👶"}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{member.name}</span>
                    <Badge variant={member.role === "parent" ? "default" : "secondary"}>{member.role}</Badge>
                    <Badge
                      variant={
                        member.status === "active" ? "default" : member.status === "pending" ? "secondary" : "outline"
                      }
                    >
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <p className="text-xs text-muted-foreground">Joined: {member.joinedDate.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {member.role === "child" && member.status === "active" && (
                  <div className="text-right text-sm">
                    <div>Level {member.level}</div>
                    <div className="text-muted-foreground">🪙 {member.totalCoins}</div>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Family Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Family Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="family-name">Family Name</Label>
            <Input
              id="family-name"
              value={familySettings.familyName}
              onChange={(e) => updateFamilySetting("familyName", e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Approval Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="task-approval">Require approval for task completion</Label>
                  <p className="text-sm text-muted-foreground">
                    Children must wait for parent approval before earning coins
                  </p>
                </div>
                <Switch
                  id="task-approval"
                  checked={familySettings.requireApprovalForTasks}
                  onCheckedChange={(checked) => updateFamilySetting("requireApprovalForTasks", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reward-approval">Require approval for reward redemption</Label>
                  <p className="text-sm text-muted-foreground">
                    High-value rewards need parent approval before redemption
                  </p>
                </div>
                <Switch
                  id="reward-approval"
                  checked={familySettings.requireApprovalForRewards}
                  onCheckedChange={(checked) => updateFamilySetting("requireApprovalForRewards", checked)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Coin & Reward Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weekly-allowance">Weekly Coin Allowance</Label>
                <Input
                  id="weekly-allowance"
                  type="number"
                  value={familySettings.weeklyAllowance}
                  onChange={(e) => updateFamilySetting("weeklyAllowance", Number.parseInt(e.target.value))}
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground">Automatic coins given each week</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="coin-transfer">Allow child-to-child coin transfers</Label>
                  <p className="text-sm text-muted-foreground">Let children send coins to siblings</p>
                </div>
                <Switch
                  id="coin-transfer"
                  checked={familySettings.allowChildToChildCoinTransfer}
                  onCheckedChange={(checked) => updateFamilySetting("allowChildToChildCoinTransfer", checked)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Screen Time Settings</h4>
            <div className="space-y-2">
              <Label htmlFor="screen-time">Maximum Daily Screen Time (minutes)</Label>
              <Input
                id="screen-time"
                type="number"
                value={familySettings.maxDailyScreenTime}
                onChange={(e) => updateFamilySetting("maxDailyScreenTime", Number.parseInt(e.target.value))}
                min="30"
                max="480"
              />
              <p className="text-xs text-muted-foreground">Base screen time before earning extra time rewards</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingMembers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Pending Invitations ({pendingMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-yellow-600" />
                  <div>
                    <span className="font-medium">{member.email}</span>
                    <Badge variant="outline" className="ml-2">
                      {member.role}
                    </Badge>
                    <p className="text-sm text-muted-foreground">Invited {member.joinedDate.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Resend
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
