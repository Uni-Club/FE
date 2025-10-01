"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Plus, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface EventsTabProps {
  clubId: string
  isAdmin: boolean
}

export default function EventsTab({ clubId, isAdmin }: EventsTabProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Mock data
  const events = [
    {
      id: "1",
      title: "정기 모임",
      description: "이번 달 정기 모임입니다",
      eventDate: "2025-01-15T18:00:00",
      location: "학생회관 201호",
      attendeeCount: 18,
      totalMembers: 24,
      status: "upcoming",
    },
    {
      id: "2",
      title: "프로젝트 발표회",
      description: "학기말 프로젝트 발표",
      eventDate: "2025-01-20T14:00:00",
      location: "공학관 301호",
      attendeeCount: 0,
      totalMembers: 24,
      status: "upcoming",
    },
    {
      id: "3",
      title: "신입생 환영회",
      description: "새로운 멤버들을 환영합니다",
      eventDate: "2024-12-10T19:00:00",
      location: "학생식당",
      attendeeCount: 22,
      totalMembers: 24,
      status: "past",
    },
  ]

  const upcomingEvents = events.filter((e) => e.status === "upcoming")
  const pastEvents = events.filter((e) => e.status === "past")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder - will be replaced with actual API call
    setIsCreateOpen(false)
  }

  return (
    <div className="space-y-6">
      {isAdmin && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">일정 관리</CardTitle>
                <CardDescription>동아리 일정을 생성하고 관리하세요</CardDescription>
              </div>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-700 hover:bg-blue-800 gap-2">
                    <Plus className="w-4 h-4" />
                    일정 만들기
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>새 일정 만들기</DialogTitle>
                    <DialogDescription>일정 정보를 입력하세요</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">제목</Label>
                      <Input id="title" placeholder="예: 정기 모임" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">설명</Label>
                      <Textarea id="description" placeholder="일정에 대한 설명을 입력하세요" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="eventDate">날짜 및 시간</Label>
                        <Input id="eventDate" type="datetime-local" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">장소</Label>
                        <Input id="location" placeholder="예: 학생회관 201호" />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setIsCreateOpen(false)}
                      >
                        취소
                      </Button>
                      <Button type="submit" className="flex-1 bg-blue-700 hover:bg-blue-800">
                        일정 만들기
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">다가오는 일정</CardTitle>
          <CardDescription>{upcomingEvents.length}개의 예정된 일정</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">예정된 일정이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Link key={event.id} href={`/club/${clubId}/event/${event.id}`}>
                  <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">예정</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.attendeeCount}/{event.totalMembers}명 참석
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">지난 일정</CardTitle>
            <CardDescription>{pastEvents.length}개의 완료된 일정</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <Link key={event.id} href={`/club/${clubId}/event/${event.id}`}>
                  <div className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer opacity-75">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                      </div>
                      <Badge variant="outline" className="text-slate-600">
                        완료
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.attendeeCount}/{event.totalMembers}명 참석
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
