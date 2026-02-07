'use client';

import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  { name: 'IT/개발', slug: 'IT/개발' },
  { name: '예술', slug: '예술/문화' },
  { name: '스포츠', slug: '스포츠' },
  { name: '봉사', slug: '봉사' },
  { name: '학술', slug: '학술' },
  { name: '친목', slug: '친목' },
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

  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* 메인 카피 */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            동아리 찾을 땐 유니클럽
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            전국 대학 동아리 정보 · 모집공고 · 지원까지
          </p>
        </div>

        {/* 검색 */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="동아리 이름, 학교, 활동 내용..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </form>

        {/* 카테고리 태그 */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => router.push(`/clubs?category=${encodeURIComponent(cat.slug)}`)}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 바로가기 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/recruitments"
            className="inline-flex items-center justify-center gap-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            지금 모집중인 동아리
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/clubs"
            className="inline-flex items-center justify-center px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            전체 동아리 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
