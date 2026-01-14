'use client';

import { Search, Users, MessageCircle, Calendar, Bell, Shield } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: '동아리 검색',
    description: '학교, 카테고리별로 쉽게 찾기',
  },
  {
    icon: Users,
    title: '간편 지원',
    description: '클릭 한 번으로 지원서 제출',
  },
  {
    icon: Calendar,
    title: '일정 관리',
    description: '동아리 활동 일정 한눈에',
  },
  {
    icon: MessageCircle,
    title: '게시판',
    description: '멤버들과 자유롭게 소통',
  },
  {
    icon: Bell,
    title: '알림',
    description: '모집, 활동 소식 바로 받기',
  },
  {
    icon: Shield,
    title: '멤버 관리',
    description: '체계적인 권한 시스템',
  },
];

export default function Features() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            주요 기능
          </h2>
          <p className="text-gray-600">
            동아리 활동에 필요한 모든 것
          </p>
        </div>

        {/* 기능 그리드 - 컴팩트하게 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
