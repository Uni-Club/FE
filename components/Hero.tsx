'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Calendar, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-neutral-50">
      {/* Decorative background elements - Umami style */}
      <div className="absolute top-32 right-20 w-[600px] h-[600px] bg-sky-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-purple-400/15 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-12">
          {/* Main Heading - Umami style large typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="font-display font-bold text-6xl sm:text-7xl md:text-8xl leading-none text-neutral-900">
              대학 동아리의<br/>
              <span className="text-sky-500">모든 것</span>
            </h1>

            <p className="text-xl sm:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              캠퍼스 안 모든 동아리를 한눈에.<br/>
              관심사에 맞는 동아리를 찾고, 새로운 친구들과 함께 성장하세요.
            </p>
          </motion.div>

          {/* CTA Buttons - Umami style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link
              href="/clubs"
              className="group inline-flex items-center justify-center px-10 py-5 bg-sky-500 text-white rounded-2xl font-bold text-lg hover:bg-sky-600 hover:shadow-primary hover:scale-105 transition-all"
            >
              동아리 탐색하기
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-neutral-700 rounded-2xl font-semibold text-lg hover:shadow-soft-lg transition-all border-2 border-neutral-200 hover:border-sky-300"
            >
              무료로 시작하기
            </Link>
          </motion.div>

          {/* 3D Floating Cards - Umami style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mt-24 h-[500px] hidden lg:block"
          >
            {/* Card 1 - Main */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-3xl p-8 shadow-soft-xl border border-neutral-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center shadow-primary">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-neutral-900">Optometrist Apps</h3>
                  <p className="text-sm text-neutral-500">by Umami View!</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-neutral-50 rounded-xl p-4">
                  <div className="text-xs text-neutral-500 mb-1">Clear vision</div>
                  <div className="font-semibold text-neutral-900">동아리 활동을 한눈에</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-sky-400 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-purple-400 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-cyan-400 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-sm text-neutral-600">2,000+ 활동 중인 학생</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2 - Left */}
            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, -1, 0]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-10 left-10 w-72 bg-white rounded-3xl p-6 shadow-soft-lg border border-neutral-100"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mb-4 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2 text-neutral-900">500+ 동아리</h3>
              <p className="text-sm text-neutral-600">
                다양한 카테고리의 동아리를 탐색하세요
              </p>
            </motion.div>

            {/* Card 3 - Right */}
            <motion.div
              animate={{
                y: [0, -18, 0],
                rotate: [0, 1, 0]
              }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 right-10 w-64 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-3xl p-6 shadow-primary text-white"
            >
              <Users className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="font-display font-bold text-xl mb-2">실시간 모집</h3>
              <p className="text-sm text-sky-50">
                지금 모집 중인 동아리에 바로 지원하세요
              </p>
            </motion.div>

            {/* Small floating elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 right-32 w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl shadow-lg opacity-80"
            />

            <motion.div
              animate={{
                y: [0, 12, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute bottom-32 left-32 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg opacity-70"
            />
          </motion.div>

          {/* Stats - Notion style minimalist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-12 pt-16"
          >
            <div className="text-center">
              <div className="font-display font-bold text-5xl text-neutral-900 mb-2">500+</div>
              <div className="text-sm text-neutral-600 font-medium">등록된 동아리</div>
            </div>
            <div className="w-px h-16 bg-neutral-200" />
            <div className="text-center">
              <div className="font-display font-bold text-5xl text-neutral-900 mb-2">2,000+</div>
              <div className="text-sm text-neutral-600 font-medium">활동 중인 학생</div>
            </div>
            <div className="w-px h-16 bg-neutral-200" />
            <div className="text-center">
              <div className="font-display font-bold text-5xl text-neutral-900 mb-2">50+</div>
              <div className="text-sm text-neutral-600 font-medium">참여 대학교</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
