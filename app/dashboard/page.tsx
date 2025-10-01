import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Calendar, DollarSign } from "lucide-react"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Mock data - will be replaced with actual database queries
  const clubs = [
    {
      id: "1",
      name: "컴퓨터 동아리",
      memberCount: 24,
      role: "admin",
    },
    {
      id: "2",
      name: "음악 동아리",
      memberCount: 15,
      role: "member",
    },
  ]

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
            <Link href="/member">
              <Button variant="outline" size="sm">
                멤버 뷰
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">내 동아리</h1>
            <p className="text-slate-600 mt-1">관리 중인 동아리와 가입한 동아리를 확인하세요</p>
          </div>
          <Link href="/club/create">
            <Button className="bg-blue-700 hover:bg-blue-800">
              <Plus className="w-4 h-4 mr-2" />
              동아리 만들기
            </Button>
          </Link>
        </div>

        {clubs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">아직 가입한 동아리가 없습니다</h3>
              <p className="text-slate-600 mb-4">새로운 동아리를 만들거나 초대 링크로 가입하세요</p>
              <Link href="/club/create">
                <Button className="bg-blue-700 hover:bg-blue-800">동아리 만들기</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <Link key={club.id} href={`/club/${club.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-blue-700" />
                      </div>
                      {club.role === "admin" && (
                        <span className="text-xs bg-blue-700 text-white px-2 py-1 rounded-full">관리자</span>
                      )}
                    </div>
                    <CardTitle className="text-xl">{club.name}</CardTitle>
                    <CardDescription>멤버 {club.memberCount}명</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>일정</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <DollarSign className="w-4 h-4" />
                        <span>재무</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
