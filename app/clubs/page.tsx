'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import ClubCard from '@/components/ClubCard';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import { groupApi } from '@/lib/api';

const categories = ['전체', 'IT/프로그래밍', '예술/문화', '스포츠', '봉사'];

export default function ClubsPage() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

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

  const handleSearch = () => {
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
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display font-bold text-5xl sm:text-6xl mb-4 text-neutral-900">
            동아리 <span className="text-gradient">탐색</span>
          </h1>
          <p className="text-xl text-neutral-600">
            {filteredClubs.length}개의 동아리가 여러분을 기다리고 있습니다
          </p>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="동아리명이나 설명으로 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-neutral-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all font-medium text-neutral-900 placeholder:text-neutral-400"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 text-neutral-600 flex-shrink-0">
              <Filter className="w-5 h-5" />
              <span className="font-medium">필터:</span>
            </div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-sky-500 text-white shadow-primary'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-neutral-600">
            <span className="font-bold text-sky-500">{filteredClubs.length}</span>개의 동아리
          </p>
          <button className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:text-sky-500 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">정렬</span>
          </button>
        </div>

        {/* Clubs Grid */}
        {filteredClubs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club, index) => (
              <ClubCard key={club.groupId} club={club} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="font-display font-bold text-2xl text-neutral-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-neutral-600">
              다른 검색어나 필터를 시도해보세요
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
