'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '@/components/site-header';
import { groupAPI, recruitmentAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Users,
  Calendar,
  Mail,
  Globe,
  MapPin,
  Star,
  Heart,
  Share2,
  Clock,
  TrendingUp,
  CheckCircle,
  User,
  LogOut
} from 'lucide-react';

interface GroupDetail {
  groupId: number;
  groupName: string;
  description: string;
  leaderId: number;
  leaderName: string;
  schoolId: number;
  schoolName: string;
  memberCount: number;
  activeRecruitmentCount: number;
  createdAt: string;
}

interface Recruitment {
  recruitmentId: number;
  groupId: number;
  schoolId: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  applyStart: string;
  applyEnd: string;
  status: string;
  capacity: number;
  views: number;
}

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (params.id) {
      loadGroupDetail();
      loadRecruitments();
    }
  }, [params.id]);

  const loadGroupDetail = async () => {
    try {
      const data = await groupAPI.getDetail(Number(params.id));
      setGroup(data);
    } catch (error) {
      console.error('Failed to load group detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecruitments = async () => {
    try {
      const data = await recruitmentAPI.getByGroup(Number(params.id));
      setRecruitments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load recruitments:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl mb-4 text-gray-900">동아리를 찾을 수 없습니다</p>
          <Button onClick={() => router.push('/search')} className="bg-indigo-600 text-white hover:bg-indigo-700">
            <ArrowLeft className="w-5 h-5 mr-2" />
            동아리 목록으로
          </Button>
        </div>
      </div>
    );
  }

  const hasActiveRecruitment = recruitments.some(r => r.status === 'PUBLISHED');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <SiteHeader showBack backHref="/search" />

      {/* 동아리 정보 섹션 */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {group.groupName}
                </h1>
                {hasActiveRecruitment && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    모집중
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{group.schoolName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{group.memberCount}명의 회원</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(group.createdAt).getFullYear()}년 창설</span>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">
                {group.description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                className="px-6 bg-indigo-600 text-white hover:bg-indigo-700"
                disabled={!hasActiveRecruitment}
              >
                {hasActiveRecruitment ? '지원하기' : '모집 대기중'}
              </Button>
              <Button
                variant="outline"
                className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Mail className="w-4 h-4 mr-2" />
                문의하기
              </Button>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">활동 지수</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">95%</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm">평점</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">4.8</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">주 활동</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">2회</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Globe className="w-4 h-4" />
                <span className="text-sm">분야</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">학술</div>
            </div>
          </div>
        </div>
      </section>

      {/* 탭 섹션 */}
      <section className="container mx-auto px-6 py-8">
        {/* 탭 메뉴 */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['about', 'recruitment', 'activities', 'members'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'about' && '소개'}
                {tab === 'recruitment' && '모집공고'}
                {tab === 'activities' && '활동'}
                {tab === 'members' && '회원'}
              </button>
            ))}
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">동아리 소개</h3>
                <div className="text-gray-700 space-y-4">
                  <p>
                    {group.description}
                  </p>
                  <p>
                    우리 동아리는 열정적인 학생들이 모여 함께 성장하고 발전하는 공간입니다.
                    다양한 활동과 프로젝트를 통해 실무 경험을 쌓고, 네트워킹의 기회를 제공합니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">주요 활동</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="text-gray-900 font-medium">정기 모임</h4>
                      <p className="text-gray-600 text-sm">매주 화요일, 목요일 저녁 7시</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="text-gray-900 font-medium">스터디 그룹</h4>
                      <p className="text-gray-600 text-sm">분야별 소그룹 스터디 운영</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="text-gray-900 font-medium">프로젝트</h4>
                      <p className="text-gray-600 text-sm">학기별 팀 프로젝트 진행</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recruitment' && (
            <div>
              {recruitments.length > 0 ? (
                <div className="space-y-4">
                  {recruitments.map((recruitment) => (
                    <div
                      key={recruitment.recruitmentId}
                      className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {recruitment.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          recruitment.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {recruitment.status === 'PUBLISHED' ? '진행중' : '마감'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">
                        {recruitment.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>모집인원: {recruitment.capacity}명</span>
                        <span>조회수: {recruitment.views}</span>
                        <span>마감: {new Date(recruitment.applyEnd).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>현재 진행중인 모집공고가 없습니다</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="text-center py-12 text-gray-500">
              <p>활동 내역이 준비중입니다</p>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="text-center py-12 text-gray-500">
              <p>회원 정보는 로그인 후 확인 가능합니다</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}