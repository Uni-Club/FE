'use client';

import Link from 'next/link';
import { Users, MapPin, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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

export default function ClubCardNew({ club, index = 0 }: ClubCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  // Category color mapping
  const getCategoryVariant = (category?: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!category) return 'default';

    const variants: Record<string, "default" | "secondary"> = {
      'IT/프로그래밍': 'default',
      '예술/문화': 'secondary',
      '스포츠': 'default',
      '봉사': 'secondary',
    };

    return variants[category] || 'default';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden border-navy/5 hover:border-coral/30 hover:shadow-xl transition-all duration-300">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-coral/5 via-transparent to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Heart button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200"
          aria-label="Like this club"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all duration-200",
              isLiked ? "fill-coral text-coral scale-110" : "text-navy/40"
            )}
          />
        </button>

        <Link href={`/clubs/${club.groupId}`} className="relative z-0">
          <CardHeader className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <CardTitle className="text-2xl font-display font-bold text-navy group-hover:text-coral transition-colors line-clamp-1">
                  {club.groupName}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{club.school.schoolName}</span>
                </div>
              </div>
            </div>

            {club.category && (
              <Badge variant={getCategoryVariant(club.category)} className="w-fit">
                {club.category}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <CardDescription className="text-base leading-relaxed line-clamp-2">
              {club.description}
            </CardDescription>

            {club.tags && club.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {club.tags.slice(0, 3).map((tag, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-xs bg-sand/50 hover:bg-sand transition-colors"
                  >
                    #{tag}
                  </Badge>
                ))}
                {club.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{club.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-navy/5 pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{club.memberCount}명 활동중</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="group-hover:bg-coral/10 group-hover:text-coral transition-all"
            >
              자세히 보기
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Link>
      </Card>
    </motion.div>
  );
}
