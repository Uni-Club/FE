'use client';

import { useParams, useRouter } from 'next/navigation';
import { Calendar, Users, ChevronRight, Plus, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { groupApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';

interface Recruitment {
  recruitmentId: number;
  title: string;
  content?: string;
  status: string;
  capacity?: number;
  applicantCount?: number;
  applyStart?: string;
  applyEnd?: string;
  createdAt?: string;
}

export default function ClubRecruitmentsPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const { isAuthenticated, user } = useAuth();

  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [clubName, setClubName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [recruitRes, clubRes] = await Promise.all([
          groupApi.getRecruitments(Number(groupId)),
          groupApi.getById(Number(groupId)),
        ]);

        if (recruitRes.success && recruitRes.data) {
          const data = recruitRes.data;
          setRecruitments(Array.isArray(data) ? data : (data as any).content || []);
        }

        if (clubRes.success && clubRes.data) {
          setClubName((clubRes.data as any).groupName || '');
        }

        // Check admin role
        if (user && isAuthenticated) {
          try {
            const membersRes = await groupApi.getMembers(Number(groupId));
            if (membersRes.success && Array.isArray(membersRes.data)) {
              const me = membersRes.data.find((m: any) => m.user?.userId === user.userId);
              if (me && ['회장', '부회장', '관리자', 'LEADER', 'VICE_LEADER', 'MANAGER'].includes(me.role)) {
                setIsAdmin(true);
              }
            }
          } catch {}
        }
      } catch {
        setError('모집공고를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [groupId, user, isAuthenticated]);

  if (loading) return <Loading />;

  const published = recruitments.filter((r) => r.status === 'PUBLISHED');
  const closed = recruitments.filter((r) => r.status === 'CLOSED');

  const statusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return { text: '모집 중', cls: 'bg-emerald-100 text-emerald-700' };
      case 'CLOSED': return { text: '마감', cls: 'bg-slate-100 text-slate-500' };
      case 'DRAFT': return { text: '임시저장', cls: 'bg-amber-100 text-amber-700' };
      default: return { text: status, cls: 'bg-slate-100 text-slate-500' };
    }
  };

  const RecruitmentCard = ({ recruitment, index }: { recruitment: Recruitment; index: number }) => {
    const badge = statusLabel(recruitment.status);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link href={`/recruitments/${recruitment.recruitmentId}`}>
          <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
                {badge.text}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {recruitment.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              {recruitment.capacity && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {recruitment.applicantCount || 0}/{recruitment.capacity}명
                </span>
              )}
              {recruitment.applyEnd && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  ~{new Date(recruitment.applyEnd).toLocaleDateString('ko-KR')}
                </span>
              )}
              {!recruitment.applyEnd && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  상시모집
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => router.push(`/clubs/${groupId}`)}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {clubName || '동아리'} 돌아가기
            </button>
            <h1 className="text-2xl font-bold text-slate-900">모집공고</h1>
          </div>
          {isAdmin && (
            <Button asChild>
              <Link href={`/clubs/${groupId}/recruitments/new`}>
                <Plus className="w-4 h-4" />
                모집공고 작성
              </Link>
            </Button>
          )}
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Published Recruitments */}
        {published.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-slate-900 mb-3">
              모집 중 ({published.length})
            </h2>
            <div className="space-y-3">
              {published.map((r, i) => (
                <RecruitmentCard key={r.recruitmentId} recruitment={r} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Closed Recruitments */}
        {closed.length > 0 && (
          <section>
            <h2 className="font-semibold text-slate-500 mb-3">
              마감된 공고 ({closed.length})
            </h2>
            <div className="space-y-3">
              {closed.map((r, i) => (
                <RecruitmentCard key={r.recruitmentId} recruitment={r} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {recruitments.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">모집공고가 없습니다</h3>
            <p className="text-sm text-slate-500 mb-4">
              아직 등록된 모집공고가 없습니다.
            </p>
            {isAdmin && (
              <Button asChild size="sm">
                <Link href={`/clubs/${groupId}/recruitments/new`}>
                  <Plus className="w-4 h-4" />
                  첫 모집공고 작성하기
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
