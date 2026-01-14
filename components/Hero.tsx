'use client';

import Link from 'next/link';
import { Search, ArrowRight, Users, Building2, FileText } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const quickCategories = [
  { name: 'IT/개발', icon: '💻', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
  { name: '예술/문화', icon: '🎨', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
  { name: '스포츠', icon: '⚽', color: 'bg-green-50 hover:bg-green-100 border-green-200' },
  { name: '봉사', icon: '🤝', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
  { name: '학술', icon: '📚', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
  { name: '친목', icon: '🎉', color: 'bg-pink-50 hover:bg-pink-100 border-pink-200' },
];

const stats = [
  { label: '등록 동아리', value: '500+', icon: Users },
  { label: '참여 대학', value: '50+', icon: Building2 },
  { label: '모집공고', value: '120+', icon: FileText },
];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/clubs?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/clubs');
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/clubs?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* 메인 헤딩 - 간결하게 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            우리 학교 동아리, 한눈에
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            관심 있는 동아리를 찾고 바로 지원하세요
          </p>
        </div>

        {/* 검색바 - 핵심 기능 */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="동아리명, 활동 내용으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-24 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              검색
            </button>
          </div>
        </form>

        {/* 카테고리 빠른 선택 - 에브리타임 스타일 */}
        <div className="mb-10">
          <p className="text-sm text-gray-500 text-center mb-4">카테고리로 찾기</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-2xl mx-auto">
            {quickCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${cat.color} transition-colors`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 통계 - 간단하게 */}
        <div className="flex justify-center gap-8 sm:gap-16 py-6 border-t border-gray-100">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-500">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA 버튼 */}
        <div className="flex justify-center gap-3 mt-6">
          <Link
            href="/clubs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            전체 동아리 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/recruitments"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            모집중인 동아리
          </Link>
        </div>
      </div>
    </section>
  );
}
