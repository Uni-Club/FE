import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Clock, Users } from "lucide-react"
import AttendanceSection from "@/components/attendance-section"
import CheckInSection from "@/components/check-in-section"

export default async function EventPage({ params }: { params: { id: string; eventId: string } }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Mock data
  const event = {
    id: params.eventId,
    clubId: params.id,
    title: "정기 모임",
    description: "이번 달 정기 모임입니다. 프로젝트 진행 상황을 공유하고 다음 활동을 계획합니다.",
    eventDate: "2025-01-15T18:00:00",
    location: "학생회관 201호",
    createdBy: "김철수",
    status: "upcoming",
  }

  const attendees = [
    { id: "1", name: "김철수", email: "kim@university.edu", status: "attending", checkedIn: false },
    { id: "2", name: "이영희", email: "lee@university.edu", status: "attending", checkedIn: false },
    { id: "3", name: "박민수", email: "park@university.edu", status: "not_attending", checkedIn: false },
    { id: "4", name: "정수진", email: "jung@university.edu", status: "pending", checkedIn: false },
  ]

  const isAdmin = true // Mock - will be replaced with actual role check

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

  const attendingCount = attendees.filter((a) => a.status === "attending").length
  const checkedInCount = attendees.filter((a) => a.checkedIn).length

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/club/${params.id}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>동아리로 돌아가기</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                  <CardDescription className="text-base">{event.description}</CardDescription>
                </div>
                {event.status === "upcoming" ? (
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">예정</Badge>
                ) : (
                  <Badge variant="outline" className="text-slate-600">
                    완료
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">날짜 및 시간</p>
                    <p className="font-medium text-slate-900">{formatDate(event.eventDate)}</p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">장소</p>
                      <p className="font-medium text-slate-900">{event.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">참석 예정</p>
                    <p className="font-medium text-slate-900">
                      {attendingCount}/{attendees.length}명
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">체크인 완료</p>
                    <p className="font-medium text-slate-900">
                      {checkedInCount}/{attendingCount}명
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Check-in Section (for admins during event) */}
          {isAdmin && event.status === "upcoming" && <CheckInSection eventId={event.id} />}

          {/* Attendance Section */}
          <AttendanceSection eventId={event.id} attendees={attendees} isAdmin={isAdmin} currentUserId={user.id} />
        </div>
      </div>
    </div>
  )
}
