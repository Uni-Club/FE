"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Copy, Check, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface MembersTabProps {
  clubId: string
  isAdmin: boolean
}

export default function MembersTab({ clubId, isAdmin }: MembersTabProps) {
  const [copied, setCopied] = useState(false)
  const [inviteLink] = useState(`https://uniclubapp.com/invite/abc123`)

  // Mock data
  const members = [
    { id: "1", name: "김철수", email: "kim@university.edu", role: "admin", status: "active", joinedAt: "2024-01-15" },
    { id: "2", name: "이영희", email: "lee@university.edu", role: "member", status: "active", joinedAt: "2024-02-01" },
    { id: "3", name: "박민수", email: "park@university.edu", role: "member", status: "active", joinedAt: "2024-02-10" },
    {
      id: "4",
      name: "정수진",
      email: "jung@university.edu",
      role: "member",
      status: "pending",
      joinedAt: "2024-03-01",
    },
  ]

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return <Badge className="bg-blue-700">관리자</Badge>
    }
    return <Badge variant="secondary">멤버</Badge>
  }

  const getStatusBadge = (status: string) => {
    if (status === "pending") {
      return (
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          대기중
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-green-600 border-green-600">
        활동중
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">멤버 초대</CardTitle>
            <CardDescription>초대 링크를 생성하고 공유하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={inviteLink} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline" className="gap-2 bg-transparent">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "복사됨" : "복사"}
              </Button>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Plus className="w-4 h-4" />새 초대 링크 생성
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>초대 링크 생성</DialogTitle>
                  <DialogDescription>링크 설정을 선택하세요</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxUses">최대 사용 횟수 (선택)</Label>
                    <Input id="maxUses" type="number" placeholder="무제한" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiresAt">만료 날짜 (선택)</Label>
                    <Input id="expiresAt" type="date" />
                  </div>
                  <Button className="w-full bg-blue-700 hover:bg-blue-800">링크 생성</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">멤버 목록</CardTitle>
              <CardDescription>총 {members.length}명</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold">{member.name[0]}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{member.name}</p>
                      {getRoleBadge(member.role)}
                      {getStatusBadge(member.status)}
                    </div>
                    <p className="text-sm text-slate-600">{member.email}</p>
                  </div>
                </div>

                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.role !== "admin" && <DropdownMenuItem>관리자로 지정</DropdownMenuItem>}
                      {member.status === "pending" && (
                        <>
                          <DropdownMenuItem>승인</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">거절</DropdownMenuItem>
                        </>
                      )}
                      {member.status === "active" && member.role !== "admin" && (
                        <DropdownMenuItem className="text-red-600">제거</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
