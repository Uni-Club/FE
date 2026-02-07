'use client';

import { Search, FileText, Users, Calendar } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: '동아리 검색',
    desc: '학교별, 분야별로 찾기',
  },
  {
    icon: FileText,
    title: '온라인 지원',
    desc: '클릭 몇 번으로 지원서 제출',
  },
  {
    icon: Users,
    title: '멤버 관리',
    desc: '가입 신청, 탈퇴 처리',
  },
  {
    icon: Calendar,
    title: '일정 공유',
    desc: '동아리 일정 한눈에',
  },
];

export default function Features() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 text-center mb-8">
          주요 기능
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-5 text-center border border-gray-100"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-blue-50 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
