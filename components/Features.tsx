'use client';

import { Search, Users, MessageCircle, Calendar, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Search,
    title: '스마트 검색',
    description: '관심사, 학교, 카테고리별로 원하는 동아리를 쉽게 찾아보세요',
    color: 'coral',
  },
  {
    icon: Users,
    title: '실시간 모집',
    description: '진행 중인 모집공고를 한눈에 확인하고 바로 지원하세요',
    color: 'cyan',
  },
  {
    icon: MessageCircle,
    title: '소통 공간',
    description: '동아리 게시판에서 멤버들과 자유롭게 소통하세요',
    color: 'coral',
  },
  {
    icon: Calendar,
    title: '일정 관리',
    description: '동아리 활동 일정을 한 곳에서 관리하고 공유하세요',
    color: 'navy',
  },
  {
    icon: TrendingUp,
    title: '활동 분석',
    description: '동아리 활동 통계와 인사이트를 확인하세요',
    color: 'cyan',
  },
  {
    icon: Shield,
    title: '안전한 관리',
    description: '체계적인 멤버 관리와 권한 시스템으로 안전하게 운영하세요',
    color: 'navy',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-bold text-5xl sm:text-6xl mb-6">
              동아리 활동의<br />
              <span className="text-gradient">모든 것</span>을 한곳에
            </h2>
            <p className="text-xl text-navy/60 max-w-2xl mx-auto">
              UNICLUB이 제공하는 강력한 기능으로 동아리 생활을 더욱 즐겁게 만들어보세요
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                className="group relative bg-sand/30 rounded-2xl p-8 hover:bg-white hover:shadow-medium transition-all duration-300 card-hover"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center ${
                    feature.color === 'coral'
                      ? 'bg-gradient-coral'
                      : feature.color === 'cyan'
                      ? 'bg-cyan'
                      : 'bg-gradient-navy'
                  }`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-display font-bold text-2xl mb-3 text-navy">
                  {feature.title}
                </h3>
                <p className="text-navy/70 leading-relaxed">{feature.description}</p>

                {/* Hover effect - subtle arrow */}
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-coral/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-coral"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
