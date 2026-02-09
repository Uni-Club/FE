'use client';

import Link from 'next/link';
import { Search, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

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
  const { isAuthenticated } = useAuth();

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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            동아리 찾을 땐 유니클럽
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            전국 대학 동아리 정보 · 모집공고 · 지원까지
          </p>
        </div>

        {/* 검색 */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="동아리 이름, 학교, 활동 내용..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            />
          </div>
        </form>

        {/* 카테고리 태그 */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => router.push(`/clubs?category=${encodeURIComponent(cat.slug)}`)}
              className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 바로가기 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="gradient" size="lg" asChild>
            <Link href="/recruitments">
              지금 모집중인 동아리
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/clubs">
              전체 동아리 보기
            </Link>
          </Button>
          {isAuthenticated && (
            <Button variant="secondary" size="lg" asChild>
              <Link href="/clubs/new">
                <Plus className="w-4 h-4" />
                동아리 만들기
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
