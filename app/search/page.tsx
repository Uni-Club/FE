'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { groupAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Users, 
  Calendar, 
  ChevronRight, 
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  LogOut,
  User
} from 'lucide-react';

interface Group {
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

const categories = [
  '전체',
  'IT/프로그래밍',
  '스포츠',
  '문화/예술',
  '학술',
  '봉사',
  '종교',
  '친목',
  '기타',
];

export default function SearchPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: '전체',
  });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    searchGroups();
  }, []);

  const searchGroups = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchParams.keyword) params.keyword = searchParams.keyword;
      if (searchParams.category && searchParams.category !== '전체') params.category = searchParams.category;

      const data = await groupAPI.search(params);
      if (Array.isArray(data)) {
        setGroups(data);
      } else {
        console.error('Groups data is not an array:', data);
        setGroups([]);
      }
    } catch (error) {
      console.error('Failed to search groups:', error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchGroups();
  };

  const handleGroupClick = (groupId: number) => {
    router.push(`/club/${groupId}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-bold text-gray-900">UNICLUB</span>
            </Link>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/member" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{user.name}님</span>
                  </Link>
                  <Button 
                    variant="outline"
                    onClick={handleLogout}
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button asChild variant="ghost">
                    <Link href="/login">로그인</Link>
                  </Button>
                  <Button asChild className="bg-indigo-600 text-white hover:bg-indigo-700">
                    <Link href="/signup">회원가입</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 검색 섹션 */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              나에게 맞는 동아리 찾기
            </h1>
            <p className="text-gray-600">
              다양한 분야의 동아리를 탐색하고 참여해보세요
            </p>
          </div>

          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="동아리명 또는 키워드 검색"
                    value={searchParams.keyword}
                    onChange={(e) => setSearchParams({...searchParams, keyword: e.target.value})}
                    className="w-full pl-10 h-11 bg-white border-gray-300"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="px-8 h-11 bg-indigo-600 text-white hover:bg-indigo-700"
                  disabled={loading}
                >
                  검색
                </Button>
              </div>

              {/* 카테고리 필터 */}
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSearchParams({...searchParams, category})}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        searchParams.category === category
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 검색 결과 */}
      <section className="container mx-auto px-6 py-8">
        {/* 결과 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {searchParams.keyword || searchParams.category !== '전체' 
                ? '검색 결과' 
                : '전체 동아리'}
            </h2>
            <p className="text-gray-600 mt-1">총 {groups.length}개 동아리</p>
          </div>
          {groups.length > 0 && (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                <span className="ml-2">{viewMode === 'grid' ? '리스트' : '그리드'}</span>
              </Button>
              <div className="flex items-center gap-2 text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">인기순</span>
              </div>
            </div>
          )}
        </div>

        {/* 로딩 상태 */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">동아리를 검색하는 중...</p>
          </div>
        ) : groups.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {groups.map((group) => (
              <div
                key={group.groupId}
                onClick={() => handleGroupClick(group.groupId)}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {group.groupName}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {group.schoolName}
                    </p>
                  </div>
                  {group.activeRecruitmentCount > 0 && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      모집중
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {group.description || '동아리 소개가 없습니다.'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{group.memberCount}명</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(group.createdAt).getFullYear()}년</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-lg text-gray-900 font-medium mb-2">검색 결과가 없습니다</p>
            <p className="text-gray-500">다른 키워드로 검색해보세요</p>
          </div>
        )}
      </section>
    </div>
  );
}