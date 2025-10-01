import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, CheckCircle, TrendingUp, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Uni Club</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
              기능
            </a>
            <a href="#benefits" className="text-slate-600 hover:text-slate-900 transition-colors">
              장점
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
              요금제
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-700">
                로그인
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-700 hover:bg-blue-800">시작하기</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 text-balance">
              대학 동아리 관리의
              <br />
              <span className="text-blue-700">모든 것을 한 곳에서</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 text-pretty leading-relaxed">
              회원 관리부터 일정 조율, 재무 관리까지. Uni Club으로 동아리 운영을 더 쉽고 투명하게 만드세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-lg px-8 py-6">
                  무료로 시작하기
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                데모 보기
              </Button>
            </div>
            <p className="text-sm text-slate-500 mt-4">신용카드 필요 없음 · 언제든 취소 가능</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">핵심 기능</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              동아리 운영에 필요한 모든 기능을 하나의 플랫폼에서 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-700" />
                </div>
                <CardTitle className="text-xl">회원 관리</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  초대 링크로 간편한 가입, 역할 배정, 멤버십 상태 추적까지 한 번에
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-700" />
                    초대 링크 생성 및 관리
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-700" />
                    역할 및 권한 설정
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-700" />
                    멤버 활동 이력 추적
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">일정 & 출석</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  이벤트 생성, 참석 투표, 출석 코드로 간편한 체크인
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    일정 생성 및 알림
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    참석 여부 투표
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    출석 코드 체크인
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-green-700" />
                </div>
                <CardTitle className="text-xl">재무 관리</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  공동 계좌, 회비 관리, 영수증 OCR, 자동 리포트 생성
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-700" />
                    투명한 재무 현황
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-700" />
                    영수증 자동 인식
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-700" />
                    엑셀 리포트 자동 생성
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">왜 Uni Club인가요?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              동아리 운영의 모든 과정을 효율적으로 만들어드립니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">시간 절약</h3>
                <p className="text-slate-600 leading-relaxed">
                  수작업으로 관리하던 회원, 일정, 재무 정보를 자동화하여 운영 시간을 80% 단축하세요.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">투명한 운영</h3>
                <p className="text-slate-600 leading-relaxed">
                  모든 재무 내역과 활동 기록이 투명하게 공개되어 신뢰할 수 있는 동아리 문화를 만듭니다.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">소통 강화</h3>
                <p className="text-slate-600 leading-relaxed">
                  앱 내 알림과 실시간 업데이트로 모든 멤버가 동아리 활동에 적극적으로 참여할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">간편한 사용</h3>
                <p className="text-slate-600 leading-relaxed">
                  복잡한 설정 없이 5분 만에 시작할 수 있는 직관적인 인터페이스를 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">요금제</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">동아리 규모에 맞는 플랜을 선택하세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">무료</CardTitle>
                <CardDescription className="text-base">소규모 동아리에 적합</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">₩0</span>
                  <span className="text-slate-600">/월</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    최대 30명 회원
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    기본 회원 관리
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    일정 관리
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    기본 재무 관리
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    시작하기
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-700 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium">인기</span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">프리미엄</CardTitle>
                <CardDescription className="text-base">중대형 동아리에 최적</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">₩9,900</span>
                  <span className="text-slate-600">/월</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    무제한 회원
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    고급 회원 관리
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    출석 코드 체크인
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    영수증 OCR
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    자동 리포트 생성
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-blue-700 hover:bg-blue-800">시작하기</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">대학 제휴</CardTitle>
                <CardDescription className="text-base">대학 전체 동아리 지원</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">문의</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    모든 프리미엄 기능
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    대학 브랜딩
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    전담 지원팀
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    맞춤형 교육
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-700" />
                    API 연동
                  </li>
                </ul>
                <Button variant="outline" className="w-full bg-transparent">
                  문의하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
            지금 바로 동아리 관리를 시작하세요
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">5분 만에 설정 완료. 신용카드 필요 없음.</p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-slate-100 text-lg px-8 py-6">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <span className="text-xl font-bold text-white">Uni Club</span>
              </div>
              <p className="text-sm leading-relaxed">대학 동아리 관리의 모든 것을 한 곳에서</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">제품</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    기능
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    요금제
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    데모
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">회사</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    소개
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    블로그
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    채용
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">지원</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    고객센터
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    문의하기
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    이용약관
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 Uni Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
