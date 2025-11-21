'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Users, Eye, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { recruitmentApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function RecruitmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recruitment, setRecruitment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecruitment();
  }, [params.id]);

  const loadRecruitment = async () => {
    try {
      setLoading(true);
      const response = await recruitmentApi.getById(Number(params.id));
      if (response.success && response.data) {
        setRecruitment(response.data);
      }
    } catch (err) {
      setError('모집공고를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    router.push(`/recruitments/${params.id}/apply`);
  };

  if (loading) return <Loading />;
  if (error) return <div className="pt-28 px-4"><ErrorMessage message={error} /></div>;
  if (!recruitment) return null;

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-medium"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-navy/60 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{recruitment.group?.groupName} • {recruitment.group?.school?.schoolName}</span>
            </div>
            <h1 className="font-display font-bold text-4xl text-navy mb-6">
              {recruitment.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-navy/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(recruitment.applyStart).toLocaleDateString()} ~{' '}
                  {new Date(recruitment.applyEnd).toLocaleDateString()}
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

          {/* Tags */}
          {recruitment.tags && recruitment.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {recruitment.tags.map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-sand text-navy/70 text-sm rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none mb-8">
            <div className="text-navy/80 leading-relaxed whitespace-pre-wrap">
              {recruitment.content}
            </div>
          </div>

          {/* Apply Button & Status Controls */}
          <div className="pt-8 border-t border-neutral-200 space-y-4">
            {recruitment.status === 'PUBLISHED' ? (
              <button
                onClick={handleApply}
                className="w-full py-4 bg-gradient-coral text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                지원하기
              </button>
            ) : (
              <div className="w-full py-4 bg-neutral-100 text-neutral-400 font-bold rounded-xl text-center cursor-not-allowed">
                {recruitment.status === 'CLOSED' ? '마감된 공고입니다' : '지원 기간이 아닙니다'}
              </div>
            )}

            {/* Admin Controls */}
            <div className="flex gap-2 justify-end">
              {['DRAFT', 'PUBLISHED', 'CLOSED'].map((status) => (
                <button
                  key={status}
                  onClick={async () => {
                    try {
                      await recruitmentApi.updateStatus(recruitment.recruitmentId, status as any);
                      loadRecruitment();
                    } catch (e) {
                      alert('상태 변경 실패');
                    }
                  }}
                  className={`px-3 py-1 text-xs rounded-full border ${recruitment.status === status
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
