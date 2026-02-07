'use client';

import { useParams, useRouter } from 'next/navigation';
import { Users, MapPin, Calendar, MessageCircle, ArrowRight, Star, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useClub } from '@/hooks/useClubs';
import { useAuth } from '@/contexts/AuthContext';
import { groupApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const { isAuthenticated, user } = useAuth();

  const { data: club, isLoading, error } = useClub(groupId);

  const [isLeader, setIsLeader] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Check if current user is the leader
  useEffect(() => {
    const checkLeader = async () => {
      if (!user || !isAuthenticated) return;
      try {
        const response = await groupApi.getMembers(Number(groupId));
        if (response.success && Array.isArray(response.data)) {
          const currentMember = response.data.find(
            (m: any) => m.user?.userId === user.userId
          );
          if (
            currentMember &&
            (currentMember.role === '회장' || currentMember.role === 'LEADER')
          ) {
            setIsLeader(true);
          }
        }
      } catch (err) {
        // Silent fail
      }
    };

    checkLeader();
  }, [groupId, user, isAuthenticated]);

  const handleApply = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    // Navigate to recruitment or show application modal
    router.push(`/clubs/${groupId}/recruitments`);
  };

  const handleDeleteClub = async () => {
    if (!confirm('정말 삭제하시겠습니까? 모든 데이터가 삭제됩니다.')) return;

    try {
      setDeleting(true);
      const response = await groupApi.delete(Number(groupId));
      if (response.success) {
        alert('동아리가 삭제되었습니다.');
        router.push('/clubs');
      } else {
        alert(response.error?.message || '동아리 삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('동아리 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) return <Loading />;

  if (error || !club) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          {error && <ErrorMessage message={(error as Error).message} />}
          <h1 className="font-bold text-4xl mb-4 text-gray-900">동아리를 찾을 수 없습니다</h1>
          <Link href="/clubs" className="text-blue-500 hover:underline">
            동아리 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-3xl p-8 sm:p-12 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float-delayed" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              {club.category && (
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                  {club.category}
                </span>
              )}
              <span className="text-white/90 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {club.schoolName}
              </span>
            </div>

            <h1 className="font-bold text-5xl sm:text-6xl text-white mb-4">
              {club.groupName}
            </h1>

            <p className="text-xl text-white/95 mb-8 max-w-3xl leading-relaxed">
              {club.description}
            </p>

            {club.tags && club.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {club.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApply}
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                가입 신청하기
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/20 transition-all border-2 border-white/30 flex items-center justify-center gap-2">
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
            className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-all"
          >
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <div className="font-bold text-3xl text-gray-900 mb-1">
              {club.memberCount || 0}명
            </div>
            <div className="text-gray-600">활동 중인 멤버</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-all"
          >
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <div className="font-bold text-3xl text-gray-900 mb-1">
              {club.activeRecruitmentCount || 0}건
            </div>
            <div className="text-gray-600">진행 중인 모집</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-all"
          >
            <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <div className="font-bold text-3xl text-gray-900 mb-1">
              {club.boardCount ?? '-'}개
            </div>
            <div className="text-gray-600">운영 중인 게시판</div>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Recruitments */}
            {(club.activeRecruitmentCount ?? 0) > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-8 border border-gray-200"
              >
                <h2 className="font-bold text-2xl mb-6 text-gray-900">진행 중인 모집</h2>
                <div className="border border-gray-200 rounded-2xl p-6 hover:border-blue-200 transition-colors">
                  <h3 className="font-bold text-xl mb-3 text-gray-900">
                    신입 부원 모집
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <span>모집 중</span>
                  </div>
                  <Link
                    href={`/clubs/${groupId}/recruitments`}
                    className="inline-block px-6 py-3 bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-600 transition-all"
                  >
                    지원하기
                  </Link>
                </div>
              </motion.section>
            )}

            {/* About */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-8 border border-gray-200"
            >
              <h2 className="font-bold text-2xl mb-4 text-gray-900">동아리 소개</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{club.description}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">동아리장:</span>
                  <span className="text-gray-600">{club.leaderName || '미정'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">소속:</span>
                  <span className="text-gray-600">{club.schoolName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">멤버 수:</span>
                  <span className="text-gray-600">{club.memberCount}명</span>
                </div>
              </div>
            </motion.section>

            {/* Admin Section - Delete Club (only for leader) */}
            {isLeader && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-8 border border-red-200"
              >
                <h2 className="font-bold text-2xl mb-4 text-gray-900">관리자 설정</h2>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">동아리 삭제</h3>
                    <p className="text-sm text-gray-500">
                      동아리를 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteClub}
                    disabled={deleting}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                    {deleting ? '삭제 중...' : '동아리 삭제'}
                  </button>
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Boards */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <h3 className="font-bold text-xl mb-4 text-gray-900">게시판</h3>
              <div className="space-y-2">
                <Link
                  href={`/clubs/${groupId}/boards`}
                  className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <span className="font-medium text-gray-900">공지사항</span>
                </Link>
                <Link
                  href={`/clubs/${groupId}/boards`}
                  className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <span className="font-medium text-gray-900">자유게시판</span>
                </Link>
              </div>
            </motion.section>

            {/* Contact */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
            >
              <h3 className="font-bold text-xl mb-3">문의하기</h3>
              <p className="text-white/95 text-sm mb-4">
                동아리에 대해 궁금한 점이 있으신가요?
              </p>
              <button className="w-full px-6 py-3 bg-white text-blue-600 rounded-2xl font-semibold hover:shadow-xl transition-all">
                메시지 보내기
              </button>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
}
