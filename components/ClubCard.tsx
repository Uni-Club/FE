'use client';

import Link from 'next/link';
import { Users, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
  };
  index?: number;
}

export default function ClubCard({ club, index = 0 }: ClubCardProps) {
  // Generate a color based on category - Notion + Umami style
  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-sky-100 text-sky-600';

    const colors: Record<string, string> = {
      'IT/프로그래밍': 'bg-sky-100 text-sky-600',
      '예술/문화': 'bg-purple-100 text-purple-600',
      '스포츠': 'bg-red-100 text-red-600',
      '봉사': 'bg-green-100 text-green-600',
      '학술': 'bg-amber-100 text-amber-600',
    };

    return colors[category] || 'bg-sky-100 text-sky-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/clubs/${club.groupId}`}>
        <div className="group bg-white rounded-2xl p-6 hover:shadow-soft-lg transition-all duration-300 border border-neutral-200 hover:border-sky-200">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-display font-bold text-2xl text-neutral-900 mb-2 group-hover:text-sky-500 transition-colors">
                {club.groupName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <MapPin className="w-4 h-4" />
                <span>{club.schoolName || club.school?.schoolName}</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-sky-400 group-hover:to-sky-600 group-hover:scale-110 transition-all">
              <ArrowRight className="w-5 h-5 text-sky-500 group-hover:text-white transition-colors" />
            </div>
          </div>

          {/* Description */}
          <p className="text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
            {club.description}
          </p>

          {/* Tags */}
          {club.tags && club.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {club.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <div className="flex items-center gap-2 text-neutral-600">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{club.memberCount}명 활동중</span>
            </div>
            {club.category && (
              <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getCategoryColor(club.category)}`}>
                {club.category}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
