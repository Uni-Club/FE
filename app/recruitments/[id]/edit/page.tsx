'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { recruitmentApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import AuthGuard from '@/components/AuthGuard';

function EditRecruitmentContent() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    capacity: '',
  });

  useEffect(() => {
    loadRecruitment();
  }, [params.id]);

  const loadRecruitment = async () => {
    try {
      setLoading(true);
      const response = await recruitmentApi.getById(Number(params.id));
      if (response.success && response.data) {
        const recruitmentData: any = response.data;
        setFormData({
          title: recruitmentData.title,
          content: recruitmentData.content || '',
          capacity: recruitmentData.capacity?.toString() || '',
        });
      }
    } catch (err) {
      setError('모집공고를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const response = await recruitmentApi.update(Number(params.id), {
        ...formData,
        capacity: formData.capacity ? Number(formData.capacity) : null,
      });

      if (response.success) {
        alert('모집공고가 수정되었습니다!');
        router.push(`/recruitments/${params.id}`);
      } else {
        setError(response.error?.message || '수정에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-md"
        >
          <h1 className="font-display font-bold text-3xl text-slate-800 mb-8">
            모집공고 수정
          </h1>

          {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-bold text-slate-800 mb-2">
                제목 <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-2">
                내용 <span className="text-orange-500">*</span>
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-2">
                모집 인원
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="20 (비워두면 제한없음)"
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-4 bg-amber-50 text-slate-800 font-bold rounded-xl hover:bg-amber-50/80 transition-all"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 bg-gradient-to-r from-orange-400 to-rose-400 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}

export default function EditRecruitmentPage() {
  return (
    <AuthGuard>
      <EditRecruitmentContent />
    </AuthGuard>
  );
}
