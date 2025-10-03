'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { 
  Search, 
  Users, 
  Calendar, 
  BarChart3, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Heart,
  Globe
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/search');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="UNICLUB 로고" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-bold text-gray-900">UNICLUB</span>
            </div>
            <div className="flex gap-4">
              <Button asChild variant="ghost" className="text-gray-700 hover:text-gray-900">
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild className="bg-indigo-600 text-white hover:bg-indigo-700">
                <Link href="/signup">회원가입</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>대학 동아리 관리의 새로운 기준</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              동아리 활동을
              <br />
              <span className="text-indigo-600">더 효율적으로</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              UNICLUB과 함께 동아리 운영부터 회원 관리까지,
              모든 활동을 체계적으로 관리하세요
            </p>
            
            
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700 px-8">
                <Link href="/search">
                  <Search className="w-5 h-5 mr-2" />
                  동아리 찾아보기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              왜 UNICLUB인가요?
            </h2>
            <p className="text-lg text-gray-600">
              동아리 운영에 필요한 모든 기능을 한 곳에서
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">스마트한 회원 관리</h3>
              <p className="text-gray-600 text-sm">
                회원 정보, 출석 체크, 회비 관리까지 
                체계적인 동아리 운영이 가능해요
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">일정 관리 시스템</h3>
              <p className="text-gray-600 text-sm">
                모임, 행사, 회의 일정을 한눈에 확인하고 
                회원들과 실시간으로 공유해요
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">투명한 회계 관리</h3>
              <p className="text-gray-600 text-sm">
                수입과 지출을 체계적으로 기록하고 
                투명한 재정 운영이 가능해요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  동아리 활동의
                  <span className="text-indigo-600"> 새로운 경험</span>
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">간편한 모집 프로세스</h3>
                      <p className="text-gray-600 text-sm">
                        온라인 지원서부터 심사, 합격자 발표까지 모든 과정을 자동화하세요
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">실시간 소통 플랫폼</h3>
                      <p className="text-gray-600 text-sm">
                        공지사항, 자료 공유, 토론까지 모든 소통을 한 곳에서 관리하세요
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Heart className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">커뮤니티 네트워킹</h3>
                      <p className="text-gray-600 text-sm">
                        다른 동아리와 교류하고 협업 기회를 만들어보세요
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-gray-500">활발한 커뮤니티</span>
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                    <p className="text-gray-600 text-sm">등록된 동아리</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">10,000+</div>
                    <p className="text-gray-600 text-sm">활동 중인 회원</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
                    <p className="text-gray-600 text-sm">대학 파트너</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}


      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image src="/logo.png" alt="UNICLUB 로고" width={32} height={32} className="rounded-lg" />
              <span className="text-lg font-bold text-white">UNICLUB</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/about" className="hover:text-white transition-colors">
                소개
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                이용약관
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                개인정보처리방침
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                문의하기
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2025 UNICLUB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}