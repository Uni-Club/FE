'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-coral/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-coral/10 rounded-full">
              <Sparkles className="w-4 h-4 text-coral" />
              <span className="text-sm font-medium text-coral">대학생활의 새로운 시작</span>
            </div>

            <h1 className="font-display font-bold text-6xl sm:text-7xl lg:text-8xl leading-tight">
              나의 열정을<br />
              <span className="text-gradient">동아리</span>에서<br />
              찾아보세요
            </h1>

            <p className="text-xl text-navy/70 leading-relaxed max-w-xl">
              캠퍼스 안 모든 동아리를 한눈에. 관심사에 맞는 동아리를 찾고, 새로운 친구들과 함께 성장하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/clubs"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-coral text-white rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                동아리 탐색하기
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-navy rounded-xl font-semibold text-lg hover:shadow-lg transition-all border-2 border-navy/10"
              >
                서비스 알아보기
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8">
              <div>
                <div className="font-display font-bold text-3xl text-navy">500+</div>
                <div className="text-sm text-navy/60">등록된 동아리</div>
              </div>
              <div className="w-px h-12 bg-navy/10" />
              <div>
                <div className="font-display font-bold text-3xl text-navy">2,000+</div>
                <div className="text-sm text-navy/60">활동 중인 학생</div>
              </div>
              <div className="w-px h-12 bg-navy/10" />
              <div>
                <div className="font-display font-bold text-3xl text-navy">50+</div>
                <div className="text-sm text-navy/60">참여 대학교</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Visual Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Floating cards with club previews */}
            <div className="relative h-[600px]">
              {/* Card 1 */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-72 bg-white rounded-2xl p-6 shadow-medium"
              >
                <div className="w-12 h-12 bg-gradient-coral rounded-xl mb-4 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">GDSC Inha</h3>
                <p className="text-sm text-navy/60 mb-4">
                  Google Developer Student Clubs
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-coral/10 text-coral text-xs rounded-full font-medium">
                    IT/개발
                  </span>
                  <span className="text-xs text-navy/40">45명 활동중</span>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-32 right-0 w-64 bg-white rounded-2xl p-6 shadow-medium"
              >
                <div className="w-12 h-12 bg-gradient-navy rounded-xl mb-4 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-cyan" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">밴드부</h3>
                <p className="text-sm text-navy/60 mb-4">
                  음악으로 하나되는 우리
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-cyan/10 text-cyan text-xs rounded-full font-medium">
                    예술/문화
                  </span>
                  <span className="text-xs text-navy/40">23명 활동중</span>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 left-12 w-80 bg-white rounded-2xl p-6 shadow-medium"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-coral rounded-xl flex items-center justify-center text-white font-bold">
                    봉
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">봉사 동아리</h3>
                    <p className="text-xs text-navy/60">나눔의 가치 실천</p>
                  </div>
                </div>
                <div className="bg-sand/50 rounded-lg p-3">
                  <div className="text-xs text-navy/60 mb-1">다음 활동</div>
                  <div className="font-medium text-navy">11월 23일 · 경로당 방문</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
