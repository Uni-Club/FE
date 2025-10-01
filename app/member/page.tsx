import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, Users, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"

export default async function MemberDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Mock data - will be replaced with actual database queries
  const upcomingEvents = [
    {
      id: "1",
      clubId: "1",
      clubName: "컴퓨터 동아리",
      title: "정기 모임",
      eventDate: "2025-01-15T18:00:00",
      location: "학생회관 201호",
      status: "pending",
    },
    {
      id: "2",
      clubId: "1",
      clubName: "컴퓨터 동아리",
      title: "프로젝트 발표회",
      eventDate: "2025-01-20T14:00:00",
      location: "공학관 301호",
      status: "attending",
    },
    {
      id: "3",
      clubId: "2",
      clubName: "음악 동아리",
      title: "연습 세션",
      eventDate: "2025-01-18T19:00:00",
      location: "음악실",
      status: "pending",
    },
  ]

  const pendingDues = [
    {
      id: "1",
      clubId: "1",
      clubName: "컴퓨터 동아리",
      amount: 30000,
      dueDate: "2025-01-31",
      status: "pending",
    },
  ]

  const recentActivity = [
    {
      id: "1",
      type: "attendance",
      clubName: "컴퓨터 동아리",
      description: "신입생 환영회 참석",
      date: "2024-12-10",
    },
    {
      id: "2",
      type: "payment",
      clubName: "컴퓨터 동아리",
      description: "회비 납부 완료",
      date: "2025-01-03",
    },
    {
      id: "3",
      type: "event",
      clubName: "음악 동아리",
      description: "정기 공연 참석 확정",
      date: "2024-12-15",
    },
  ]

  const stats = {
    totalClubs: 2,
    upcomingEvents: upcomingEvents.length,
    attendanceRate: 92,
    pendingDues: pendingDues.length,
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Uni Club</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                관리자 뷰
              </Button>
            </Link>
            <span className="text-sm text-slate-600">{user.name}</span>
            <Button variant="outline" size="sm">
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">내 대시보드</h1>
          <p className="text-slate-600 mt-1">동아리 활동을 한눈에 확인하세요</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                가입 동아리
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{stats.totalClubs}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                다가오는 일정
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{stats.upcomingEvents}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                출석률
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">{stats.attendanceRate}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                미납 회비
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingDues}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Events and Dues */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">다가오는 일정</CardTitle>
                    <CardDescription>참석 여부를 응답하세요</CardDescription>
                  </div>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      전체 보기
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">예정된 일정이 없습니다</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900">{event.title}</h3>
                              {event.status === "attending" ? (
                                <Badge className="bg-blue-600 hover:bg-blue-600">참석</Badge>
                              ) : event.status === "not_attending" ? (
                                <Badge variant="outline">불참</Badge>
                              ) : (
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                  미응답
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">{event.clubName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(event.eventDate)}</span>
                          </div>
                          {event.location && <span>· {event.location}</span>}
                        </div>
                        {event.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 bg-blue-700 hover:bg-blue-800">
                              참석
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              불참
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Dues */}
            {pendingDues.length > 0 && (
              <Card className="border-2 border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <CardTitle className="text-lg">미납 회비</CardTitle>
                  </div>
                  <CardDescription>납부 기한을 확인하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingDues.map((due) => (
                      <div key={due.id} className="p-4 bg-white border border-orange-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-slate-900">{due.clubName}</p>
                            <p className="text-sm text-slate-600">
                              마감일: {new Date(due.dueDate).toLocaleDateString("ko-KR")}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-slate-900">{formatCurrency(due.amount)}</p>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">납부하기</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최근 활동</CardTitle>
                <CardDescription>나의 동아리 활동 기록</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === "attendance"
                              ? "bg-green-100"
                              : activity.type === "payment"
                                ? "bg-blue-100"
                                : "bg-purple-100"
                          }`}
                        >
                          {activity.type === "attendance" ? (
                            <CheckCircle className="w-4 h-4 text-green-700" />
                          ) : activity.type === "payment" ? (
                            <DollarSign className="w-4 h-4 text-blue-700" />
                          ) : (
                            <Calendar className="w-4 h-4 text-purple-700" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                        <p className="text-xs text-slate-600">{activity.clubName}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(activity.date).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">빠른 작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Users className="w-4 h-4" />내 동아리 보기
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Calendar className="w-4 h-4" />
                  일정 확인하기
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <DollarSign className="w-4 h-4" />
                  회비 내역 보기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
