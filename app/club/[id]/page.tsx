import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import MembersTab from "@/components/members-tab"
import EventsTab from "@/components/events-tab"
import FinanceTab from "@/components/finance-tab"

export default async function ClubPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Mock data - will be replaced with actual database query
  const club = {
    id: params.id,
    name: "컴퓨터 동아리",
    description: "프로그래밍과 기술을 사랑하는 사람들의 모임",
    university: "서울대학교",
    memberCount: 24,
    role: "admin",
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            <span>대시보드로 돌아가기</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{club.name}</h1>
              <p className="text-slate-600 mt-1">{club.university}</p>
            </div>
            {club.role === "admin" && (
              <Button variant="outline" size="sm">
                설정
              </Button>
            )}
          </div>
          {club.description && <p className="text-slate-600 mt-2">{club.description}</p>}
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="members">멤버</TabsTrigger>
            <TabsTrigger value="events">일정</TabsTrigger>
            <TabsTrigger value="finance">재무</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <MembersTab clubId={club.id} isAdmin={club.role === "admin"} />
          </TabsContent>

          <TabsContent value="events">
            <EventsTab clubId={club.id} isAdmin={club.role === "admin"} />
          </TabsContent>

          <TabsContent value="finance">
            <FinanceTab clubId={club.id} isAdmin={club.role === "admin"} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
