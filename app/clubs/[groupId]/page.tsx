'use client';

import { useParams } from 'next/navigation';
import { Users, MapPin, Calendar, MessageCircle, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data - 실제로는 API에서 가져올 데이터
const mockClubData: Record<string, any> = {
  '1': {
    groupId: 1,
    groupName: 'GDSC Inha',
    description: 'Google Developer Student Clubs Inha University. 개발자를 꿈꾸는 학생들이 함께 성장하는 커뮤니티입니다. 구글의 최신 기술을 학습하고, 실제 프로젝트를 통해 실력을 키우며, 네트워킹을 통해 다양한 기회를 만들어갑니다.',
    school: {
      schoolId: 1,
      schoolName: '인하대학교',
      campusName: '본교',
    },
    leader: {
      name: '홍길동',
    },
    memberCount: 45,
    category: 'IT/프로그래밍',
    tags: ['개발', '구글', '스터디', '네트워킹'],
    activeRecruitmentCount: 1,
    boards: [
      { name: '공지사항', boardType: 'NOTICE' },
      { name: '자유게시판', boardType: 'FREE' },
    ],
    recruitments: [
      {
        recruitmentId: 1,
        title: '2025 봄학기 신입 부원 모집',
        applyStart: '2025-01-10T00:00:00',
        applyEnd: '2025-01-31T23:59:59',
        capacity: 20,
        applicantCount: 15,
      },
    ],
  },
};

export default function ClubDetailPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const club = mockClubData[groupId];

  if (!club) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display font-bold text-4xl mb-4">동아리를 찾을 수 없습니다</h1>
          <a href="/clubs" className="text-coral hover:underline">
            동아리 목록으로 돌아가기
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-navy rounded-3xl p-8 sm:p-12 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-coral/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                {club.category}
              </span>
              <span className="text-cream/70 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {club.school.schoolName}
              </span>
            </div>

            <h1 className="font-display font-bold text-5xl sm:text-6xl text-white mb-4">
              {club.groupName}
            </h1>

            <p className="text-xl text-cream/90 mb-8 max-w-3xl leading-relaxed">
              {club.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {club.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-coral text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2">
                가입 신청하기
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2">
                <Star className="w-5 h-5" />
                관심 동아리 추가
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 text-center"
          >
            <Users className="w-8 h-8 text-coral mx-auto mb-3" />
            <div className="font-display font-bold text-3xl text-navy mb-1">
              {club.memberCount}명
            </div>
            <div className="text-navy/60">활동 중인 멤버</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 text-center"
          >
            <Calendar className="w-8 h-8 text-cyan mx-auto mb-3" />
            <div className="font-display font-bold text-3xl text-navy mb-1">
              {club.activeRecruitmentCount}건
            </div>
            <div className="text-navy/60">진행 중인 모집</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 text-center"
          >
            <MessageCircle className="w-8 h-8 text-navy mx-auto mb-3" />
            <div className="font-display font-bold text-3xl text-navy mb-1">
              {club.boards.length}개
            </div>
            <div className="text-navy/60">운영 중인 게시판</div>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Recruitments */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8"
            >
              <h2 className="font-display font-bold text-2xl mb-6">진행 중인 모집</h2>
              {club.recruitments.map((recruitment: any) => (
                <div key={recruitment.recruitmentId} className="border border-navy/10 rounded-xl p-6">
                  <h3 className="font-display font-bold text-xl mb-3">{recruitment.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-navy/60 mb-4">
                    <span>모집 인원: {recruitment.capacity}명</span>
                    <span>지원자: {recruitment.applicantCount}명</span>
                    <span>마감: {new Date(recruitment.applyEnd).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <button className="px-6 py-3 bg-gradient-coral text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    지원하기
                  </button>
                </div>
              ))}
            </motion.section>

            {/* About */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-8"
            >
              <h2 className="font-display font-bold text-2xl mb-4">동아리 소개</h2>
              <p className="text-navy/70 leading-relaxed mb-6">{club.description}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-navy">동아리장:</span>
                  <span className="text-navy/70">{club.leader.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-navy">소속:</span>
                  <span className="text-navy/70">
                    {club.school.schoolName} {club.school.campusName}
                  </span>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Boards */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6"
            >
              <h3 className="font-display font-bold text-xl mb-4">게시판</h3>
              <div className="space-y-2">
                {club.boards.map((board: any, i: number) => (
                  <a
                    key={i}
                    href="#"
                    className="block px-4 py-3 bg-sand/30 hover:bg-sand rounded-lg transition-colors"
                  >
                    <span className="font-medium text-navy">{board.name}</span>
                  </a>
                ))}
              </div>
            </motion.section>

            {/* Contact */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-coral rounded-2xl p-6 text-white"
            >
              <h3 className="font-display font-bold text-xl mb-3">문의하기</h3>
              <p className="text-white/90 text-sm mb-4">
                동아리에 대해 궁금한 점이 있으신가요?
              </p>
              <button className="w-full px-6 py-3 bg-white text-coral rounded-lg font-medium hover:shadow-lg transition-all">
                메시지 보내기
              </button>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
}
