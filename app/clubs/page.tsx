'use client';

import { useState } from 'react';
import { Search, Filter, List, Grid3X3, Plus } from 'lucide-react';
import Link from 'next/link';
import ClubCard from '@/components/ClubCard';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import { useClubs, Club } from '@/hooks/useClubs';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const categories = ['전체', 'IT/개발', '예술/문화', '스포츠', '봉사', '학술', '친목'];

export default function ClubsPage() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'members'>('latest');
  const [page, setPage] = useState(0);

  const { data, isLoading, error, refetch } = useClubs({
    keyword: submittedQuery || undefined,
    category: selectedCategory,
    sort: sortBy,
    page,
    size: 20,
  });

  const clubs = data?.clubs || [];
  const totalPages = data?.totalPages || 0;
  const hasNext = data?.hasNext || false;
  const hasPrevious = data?.hasPrevious || false;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
    setPage(0);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(0);
  };

  const handleSortChange = (sort: 'latest' | 'popular' | 'members') => {
    setSortBy(sort);
  };

  if (isLoading) return <Loading />;

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">동아리 찾기</h1>
            <p className="text-sm text-slate-500 mt-1">
              총 {data?.totalElements || 0}개의 동아리
            </p>
          </div>
          {isAuthenticated && (
            <Button asChild>
              <Link href="/clubs/new">
                <Plus className="w-4 h-4" />
                동아리 만들기
              </Link>
            </Button>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && <ErrorMessage message={(error as Error).message || '동아리 목록을 불러오는데 실패했습니다.'} />}

        {/* 검색 & 필터 영역 */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          {/* 검색바 */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="동아리명, 활동 내용 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button type="submit" size="sm">
                  검색
                </Button>
              </div>
            </div>
          </form>

          {/* 카테고리 필터 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 정렬 & 뷰 모드 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSortChange('latest')}
              className={`text-sm ${sortBy === 'latest' ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}
            >
              최신순
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => handleSortChange('popular')}
              className={`text-sm ${sortBy === 'popular' ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}
            >
              인기순
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => handleSortChange('members')}
              className={`text-sm ${sortBy === 'members' ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}
            >
              멤버순
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-100' : ''}`}
            >
              <Grid3X3 className={`w-4 h-4 ${viewMode === 'grid' ? 'text-indigo-600' : 'text-slate-400'}`} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-100' : ''}`}
            >
              <List className={`w-4 h-4 ${viewMode === 'list' ? 'text-indigo-600' : 'text-slate-400'}`} />
            </button>
          </div>
        </div>

        {/* 동아리 목록 */}
        {clubs.length > 0 ? (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            }>
              {clubs.map((club: Club, index: number) => (
                <ClubCard key={club.groupId} club={club} index={index} />
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={!hasPrevious}
                >
                  이전
                </Button>
                <span className="text-sm text-slate-600">
                  {page + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">
              검색 결과가 없습니다
            </h3>
            <p className="text-sm text-slate-500">
              다른 검색어나 필터를 시도해보세요
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
