'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, List, Grid3X3, ChevronDown } from 'lucide-react';
import ClubCard from '@/components/ClubCard';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import { groupApi } from '@/lib/api';

const categories = ['전체', 'IT/개발', '예술/문화', '스포츠', '봉사', '학술', '친목'];

export default function ClubsPage() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await groupApi.search({
        keyword: searchQuery || undefined,
        page: 0,
        size: 100,
      });
      if (response && Array.isArray(response)) {
        setClubs(response);
      } else {
        setClubs([]);
      }
    } catch (err) {
      console.error('Failed to load clubs:', err);
      setError('동아리 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadClubs();
  };

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      !searchQuery ||
      club.groupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <Loading />;

  return (
    <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">동아리 찾기</h1>
          <p className="text-sm text-gray-500 mt-1">
            총 {filteredClubs.length}개의 동아리
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && <ErrorMessage message={error} />}

        {/* 검색 & 필터 영역 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          {/* 검색바 */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="동아리명, 활동 내용 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
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
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              onClick={() => setSortBy('latest')}
              className={`text-sm ${sortBy === 'latest' ? 'text-blue-500 font-medium' : 'text-gray-500'}`}
            >
              최신순
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setSortBy('popular')}
              className={`text-sm ${sortBy === 'popular' ? 'text-blue-500 font-medium' : 'text-gray-500'}`}
            >
              인기순
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setSortBy('members')}
              className={`text-sm ${sortBy === 'members' ? 'text-blue-500 font-medium' : 'text-gray-500'}`}
            >
              멤버순
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <Grid3X3 className={`w-4 h-4 ${viewMode === 'grid' ? 'text-blue-500' : 'text-gray-400'}`} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
            >
              <List className={`w-4 h-4 ${viewMode === 'list' ? 'text-blue-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* 동아리 목록 */}
        {filteredClubs.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }>
            {filteredClubs.map((club, index) => (
              <ClubCard key={club.groupId} club={club} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">
              검색 결과가 없습니다
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
