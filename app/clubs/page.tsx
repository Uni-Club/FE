'use client';

import { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import ClubCard from '@/components/ClubCard';

// Mock data - 실제로는 API에서 가져올 데이터
const mockClubs = [
  {
    groupId: 1,
    groupName: 'GDSC Inha',
    description: 'Google Developer Student Clubs Inha University. 개발자를 꿈꾸는 학생들이 함께 성장하는 커뮤니티입니다.',
    school: { schoolName: '인하대학교' },
    memberCount: 45,
    category: 'IT/프로그래밍',
    tags: ['개발', '구글', '스터디'],
  },
  {
    groupId: 2,
    groupName: '밴드부',
    description: '음악으로 하나되는 우리. 다양한 악기를 연주하고 합주하는 동아리입니다.',
    school: { schoolName: '인하대학교' },
    memberCount: 23,
    category: '예술/문화',
    tags: ['음악', '공연', '밴드'],
  },
  {
    groupId: 3,
    groupName: '봉사 동아리',
    description: '나눔의 가치를 실천하는 봉사 동아리. 매주 지역사회를 위한 봉사활동을 진행합니다.',
    school: { schoolName: '인하대학교' },
    memberCount: 32,
    category: '봉사',
    tags: ['봉사', '나눔', '지역사회'],
  },
  {
    groupId: 4,
    groupName: '농구부',
    description: '함께 뛰고, 함께 성장하는 농구 동아리. 초보자부터 경험자까지 모두 환영합니다.',
    school: { schoolName: '인하대학교' },
    memberCount: 28,
    category: '스포츠',
    tags: ['농구', '운동', '건강'],
  },
  {
    groupId: 5,
    groupName: '사진 동아리',
    description: '렌즈로 담는 청춘. 사진 촬영 기술을 배우고 전시회도 개최하는 동아리입니다.',
    school: { schoolName: '인하대학교' },
    memberCount: 19,
    category: '예술/문화',
    tags: ['사진', '전시', '예술'],
  },
  {
    groupId: 6,
    groupName: 'AI 연구회',
    description: '인공지능과 머신러닝을 연구하고 프로젝트를 진행하는 학술 동아리입니다.',
    school: { schoolName: '인하대학교' },
    memberCount: 37,
    category: 'IT/프로그래밍',
    tags: ['AI', '머신러닝', '연구'],
  },
];

const categories = ['전체', 'IT/프로그래밍', '예술/문화', '스포츠', '봉사'];

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredClubs = mockClubs.filter((club) => {
    const matchesSearch =
      club.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
