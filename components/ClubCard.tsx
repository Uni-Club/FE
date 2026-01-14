'use client';

import Link from 'next/link';
import { Users, MapPin, ChevronRight } from 'lucide-react';

interface ClubCardProps {
  club: {
    groupId: number;
    groupName: string;
    description: string;
    schoolName?: string;
    school?: {
      schoolName: string;
    };
    memberCount: number;
    category?: string;
    tags?: string[];
    isRecruiting?: boolean;
  };
  index?: number;
}

const categoryColors: Record<string, string> = {
  'IT/프로그래밍': 'bg-blue-100 text-blue-600',
  'IT/개발': 'bg-blue-100 text-blue-600',
  '예술/문화': 'bg-purple-100 text-purple-600',
  '스포츠': 'bg-green-100 text-green-600',
  '봉사': 'bg-orange-100 text-orange-600',
  '학술': 'bg-yellow-100 text-yellow-700',
  '친목': 'bg-pink-100 text-pink-600',
};

export default function ClubCard({ club }: ClubCardProps) {
  const schoolName = club.schoolName || club.school?.schoolName || '';
  const categoryColor = categoryColors[club.category || ''] || 'bg-gray-100 text-gray-600';

  return (
    <Link href={`/clubs/${club.groupId}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all">
        {/* 상단: 카테고리 + 모집중 뱃지 */}
        <div className="flex items-center justify-between mb-3">
          {club.category && (
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${categoryColor}`}>
              {club.category}
            </span>
          )}
          {club.isRecruiting && (
            <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-50 text-red-500">
              모집중
            </span>
          )}
        </div>

        {/* 동아리명 */}
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
          {club.groupName}
        </h3>

        {/* 학교 */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{schoolName}</span>
        </div>

        {/* 설명 */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {club.description}
        </p>

        {/* 하단: 멤버 수 + 화살표 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Users className="w-4 h-4" />
            <span className="text-sm">{club.memberCount}명</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}
