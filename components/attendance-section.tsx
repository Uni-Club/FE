"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Clock, CheckCircle } from "lucide-react"

interface Attendee {
  id: string
  name: string
  email: string
  status: "attending" | "not_attending" | "pending"
  checkedIn: boolean
}

interface AttendanceSectionProps {
  eventId: string
  attendees: Attendee[]
  isAdmin: boolean
  currentUserId: string
}

export default function AttendanceSection({ eventId, attendees, isAdmin, currentUserId }: AttendanceSectionProps) {
  const [userStatus, setUserStatus] = useState<"attending" | "not_attending" | "pending">("pending")

  const handleStatusChange = (status: "attending" | "not_attending") => {
    setUserStatus(status)
    // Placeholder - will be replaced with actual API call
  }

  const getStatusBadge = (status: string, checkedIn: boolean) => {
    if (checkedIn) {
      return (
        <Badge className="bg-green-600 hover:bg-green-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          체크인 완료
        </Badge>
      )
    }
    if (status === "attending") {
      return <Badge className="bg-blue-600 hover:bg-blue-600">참석</Badge>
    }
    if (status === "not_attending") {
      return <Badge variant="outline">불참</Badge>
    }
    return (
      <Badge variant="outline" className="text-orange-600 border-orange-600">
        미응답
      </Badge>
    )
  }

  const attendingList = attendees.filter((a) => a.status === "attending")
  const notAttendingList = attendees.filter((a) => a.status === "not_attending")
  const pendingList = attendees.filter((a) => a.status === "pending")

  return (
    <div className="space-y-6">
      {/* User's Response */}
      {!isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">참석 여부</CardTitle>
            <CardDescription>이 일정에 참석하시나요?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={() => handleStatusChange("attending")}
                className={`flex-1 gap-2 ${
                  userStatus === "attending"
                    ? "bg-blue-700 hover:bg-blue-800"
                    : "bg-transparent border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Check className="w-4 h-4" />
                참석
              </Button>
              <Button
                onClick={() => handleStatusChange("not_attending")}
                className={`flex-1 gap-2 ${
                  userStatus === "not_attending"
                    ? "bg-slate-700 hover:bg-slate-800"
                    : "bg-transparent border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <X className="w-4 h-4" />
                불참
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">참석자 목록</CardTitle>
          <CardDescription>
            총 {attendees.length}명 중 {attendingList.length}명 참석 예정
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Attending */}
          {attendingList.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-700" />
                참석 ({attendingList.length})
              </h3>
              <div className="space-y-2">
                {attendingList.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-semibold text-sm">{attendee.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{attendee.name}</p>
                        <p className="text-xs text-slate-600">{attendee.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(attendee.status, attendee.checkedIn)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Not Attending */}
          {notAttendingList.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <X className="w-4 h-4 text-slate-600" />
                불참 ({notAttendingList.length})
              </h3>
              <div className="space-y-2">
                {notAttendingList.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-slate-600 font-semibold text-sm">{attendee.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{attendee.name}</p>
                        <p className="text-xs text-slate-600">{attendee.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(attendee.status, attendee.checkedIn)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending */}
          {pendingList.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                미응답 ({pendingList.length})
              </h3>
              <div className="space-y-2">
                {pendingList.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">{attendee.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{attendee.name}</p>
                        <p className="text-xs text-slate-600">{attendee.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(attendee.status, attendee.checkedIn)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
