'use client';

import { useParams, useRouter } from 'next/navigation';
import { Calendar, Users, Eye, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRecruitment } from '@/hooks/useRecruitments';
import { useAuth } from '@/contexts/AuthContext';
import { recruitmentApi, groupApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function RecruitmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { data: recruitment, isLoading, error, refetch } = useRecruitment(params.id as string);
  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user || !recruitment?.group?.groupId) {
        setIsGroupAdmin(false);
        return;
      }
      try {
        const response = await groupApi.getMembers(recruitment.group.groupId);
        if (response.success && Array.isArray(response.data)) {
          const currentMember = (response.data as any[]).find(
            (member: any) => member.userId === user.userId || member.user?.userId === user.userId
          );
          if (currentMember) {
            const role = currentMember.role || currentMember.groupRole;
            setIsGroupAdmin(role === 'ADMIN' || role === 'LEADER' || role === 'OWNER');
          } else {
            setIsGroupAdmin(false);
          }
        }
      } catch {
        setIsGroupAdmin(false);
      }
    };

    checkAdminRole();
  }, [user, recruitment]);

  const handleApply = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    router.push(`/recruitments/${params.id}/apply`);
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="pt-28 px-4"><ErrorMessage message={(error as Error).message} /></div>;
  if (!recruitment) return null;

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{recruitment.group?.groupName} {recruitment.group?.school?.schoolName && `• ${recruitment.group.school.schoolName}`}</span>
            </div>
            <h1 className="font-bold text-4xl text-slate-900 mb-6">
              {recruitment.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {recruitment.applyStart && new Date(recruitment.applyStart).toLocaleDateString('ko-KR')} ~{' '}
                  {recruitment.applyEnd && new Date(recruitment.applyEnd).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>모집인원: {recruitment.capacity || '제한없음'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>조회수: {recruitment.views || 0}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-8">
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {recruitment.content}
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-8 border-t border-slate-200 space-y-4">
            {recruitment.status === 'PUBLISHED' ? (
              <Button
                size="lg"
                className="w-full py-4 text-base font-bold"
                onClick={handleApply}
              >
                지원하기
              </Button>
            ) : (
              <div className="w-full py-4 bg-slate-100 text-slate-400 font-bold rounded-xl text-center cursor-not-allowed">
                {recruitment.status === 'CLOSED' ? '마감된 공고입니다' : '지원 기간이 아닙니다'}
              </div>
            )}

            {/* Admin Controls */}
            {isGroupAdmin && (
              <div className="flex gap-2 justify-end">
                {['DRAFT', 'PUBLISHED', 'CLOSED'].map((status) => (
                  <button
                    key={status}
                    onClick={async () => {
                      try {
                        await recruitmentApi.updateStatus(recruitment.recruitmentId, status as 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED');
                        refetch();
                      } catch (e) {
                        toast({ title: '상태 변경 실패', variant: 'error' });
                      }
                    }}
                    className={`px-3 py-1 text-xs rounded-full border ${recruitment.status === status
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-600'
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
