'use client';

import { useState } from 'react';
import { Search, Filter, Calendar, Users, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRecruitments, Recruitment } from '@/hooks/useRecruitments';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

const categories = ['전체', 'IT/개발', '예술/문화', '스포츠', '봉사', '학술', '친목'];

export default function RecruitmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading, error } = useRecruitments({
    keyword: submittedQuery || undefined,
    category: selectedCategory || undefined,
    status: 'PUBLISHED',
    page,
    size: 12,
  });

  const recruitments = data?.recruitments || [];
  const totalPages = data?.totalPages || 0;
  const hasNext = data?.hasNext || false;
  const hasPrevious = data?.hasPrevious || false;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
    setPage(0);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === '전체' ? '' : category);
    setPage(0);
  };

  if (isLoading) return <Loading />;

  return (
    <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="font-bold text-3xl sm:text-4xl mb-2 text-gray-900">
            모집공고 <span className="text-blue-500">둘러보기</span>
          </h1>
          <p className="text-gray-600">
            지금 모집 중인 동아리를 찾아보세요
          </p>
        </div>

        {error && <ErrorMessage message={(error as Error).message || '모집공고를 불러오는데 실패했습니다.'} />}

        {/* 검색 & 필터 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="모집공고 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-20 py-3 bg-white rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
              >
                검색
              </button>
            </div>
          </form>

          {/* 카테고리 필터 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                  (category === '전체' && !selectedCategory) || selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 모집공고 목록 */}
        {recruitments.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recruitments.map((recruitment: Recruitment, index: number) => (
                <motion.div
                  key={recruitment.recruitmentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link href={`/recruitments/${recruitment.recruitmentId}`}>
                    <div className="group bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
                        {recruitment.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {recruitment.group?.groupName} {recruitment.group?.school?.schoolName && `• ${recruitment.group.school.schoolName}`}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{recruitment.applicantCount || 0}/{recruitment.capacity || '∞'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{recruitment.views || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {recruitment.applyEnd
                            ? `~${new Date(recruitment.applyEnd).toLocaleDateString('ko-KR')}`
                            : '상시모집'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={!hasPrevious}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  이전
                </button>
                <span className="text-sm text-gray-600 px-4">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                >
                  다음
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">
              모집 중인 공고가 없습니다
            </h3>
            <p className="text-sm text-gray-500">
              다른 검색어나 필터를 시도해보세요
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
