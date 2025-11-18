'use client';

import Link from 'next/link';
import { Users, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClubCardProps {
  club: {
    groupId: number;
    groupName: string;
    description: string;
    school: {
      schoolName: string;
    };
    memberCount: number;
    category?: string;
    tags?: string[];
  };
  index?: number;
}

export default function ClubCard({ club, index = 0 }: ClubCardProps) {
  // Generate a color based on category
  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-coral/10 text-coral';

    const colors: Record<string, string> = {
      'IT/프로그래밍': 'bg-coral/10 text-coral',
      '예술/문화': 'bg-cyan/10 text-cyan',
      '스포츠': 'bg-navy/10 text-navy',
      '봉사': 'bg-coral-dark/10 text-coral-dark',
    };

    return colors[category] || 'bg-coral/10 text-coral';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/clubs/${club.groupId}`}>
        <div className="group bg-white rounded-2xl p-6 hover:shadow-medium transition-all duration-300 card-hover border border-navy/5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-display font-bold text-2xl text-navy mb-2 group-hover:text-coral transition-colors">
                {club.groupName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-navy/60">
                <MapPin className="w-4 h-4" />
                <span>{club.school.schoolName}</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center group-hover:bg-gradient-coral group-hover:scale-110 transition-all">
              <ArrowRight className="w-5 h-5 text-coral group-hover:text-white transition-colors" />
            </div>
          </div>

          {/* Description */}
          <p className="text-navy/70 mb-4 line-clamp-2 leading-relaxed">
            {club.description}
          </p>

          {/* Tags */}
          {club.tags && club.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {club.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-sand text-navy/70 text-xs rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-navy/5">
            <div className="flex items-center gap-2 text-navy/60">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{club.memberCount}명 활동중</span>
            </div>
            {club.category && (
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${getCategoryColor(club.category)}`}>
                {club.category}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
