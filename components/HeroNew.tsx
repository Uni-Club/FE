'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { value: '500+', label: '등록된 동아리', icon: Users },
  { value: '2,000+', label: '활동 중인 학생', icon: TrendingUp },
  { value: '50+', label: '참여 대학교', icon: Calendar },
];

const featuredClubs = [
  {
    id: 1,
    name: 'GDSC Inha',
    description: 'Google Developer Student Clubs',
    category: 'IT/개발',
    members: 45,
    gradient: 'from-coral to-coral-dark',
    icon: Users,
  },
  {
    id: 2,
    name: '밴드부',
    description: '음악으로 하나되는 우리',
    category: '예술/문화',
    members: 23,
    gradient: 'from-cyan to-cyan-light',
    icon: Calendar,
  },
  {
    id: 3,
    name: '봉사 동아리',
    description: '나눔의 가치 실천',
    category: '봉사',
    members: 32,
    gradient: 'from-navy to-navy-light',
    icon: Users,
  },
];

export default function HeroNew() {
  return (
    <section className="relative pt-20 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-cream via-background to-background">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-coral/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-coral/10 to-cyan/10 border-0">
                <Sparkles className="w-4 h-4 text-coral" />
                대학생활의 새로운 시작
              </Badge>
            </motion.div>

            {/* Heading */}
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-tight tracking-tight">
              나의 열정을<br />
              <span className="bg-gradient-to-r from-coral via-coral-dark to-coral bg-clip-text text-transparent">
                동아리
              </span>
              에서<br />
              찾아보세요
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              캠퍼스 안 모든 동아리를 한눈에. 관심사에 맞는 동아리를 찾고,<br className="hidden sm:block" />
              새로운 친구들과 함께 성장하세요.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-coral to-coral-dark hover:shadow-xl transition-all text-base md:text-lg px-8 py-6"
              >
                <Link href="/clubs">
                  동아리 탐색하기
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base md:text-lg px-8 py-6">
                <Link href="/about">
                  서비스 알아보기
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 bg-coral/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-2xl md:text-3xl text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Featured Clubs Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative h-[600px]">
              {featuredClubs.map((club, index) => (
                <motion.div
                  key={club.id}
                  animate={{
                    y: [0, index % 2 === 0 ? -20 : 20, 0],
                  }}
                  transition={{
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                  className="absolute"
                  style={{
                    top: index === 0 ? '0' : index === 1 ? '120px' : '280px',
                    left: index === 1 ? 'auto' : '0',
                    right: index === 1 ? '0' : 'auto',
                  }}
                >
                  <Card className="w-72 md:w-80 shadow-xl border-0 hover:shadow-2xl transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${club.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                        <club.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-xl mb-1">{club.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {club.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {club.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {club.members}명 활동중
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
