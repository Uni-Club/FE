'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { recruitmentApi } from '@/lib/api';
import ErrorMessage from '@/components/ErrorMessage';

export default function NewRecruitmentPage() {
  const params = useParams();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    applyStart: '',
    applyEnd: '',
    capacity: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const response = await recruitmentApi.create({
        groupId: Number(params.groupId),
        ...formData,
        capacity: formData.capacity ? Number(formData.capacity) : null,
      });

      if (response.success) {
        alert('모집공고가 생성되었습니다!');
        const data: any = response.data;
        router.push(`/recruitments/${data.recruitmentId}`);
      } else {
        setError(response.error?.message || '생성에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '생성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-medium"
        >
          <h1 className="font-display font-bold text-3xl text-navy mb-8">
            모집공고 작성
          </h1>

          {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-bold text-navy mb-2">
                제목 <span className="text-coral">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="2025 봄학기 신입 부원 모집"
                className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-navy mb-2">
                내용 <span className="text-coral">*</span>
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                placeholder="모집공고 내용을 작성하세요..."
                className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-navy mb-2">
                  지원 시작일 <span className="text-coral">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.applyStart}
                  onChange={(e) => setFormData({ ...formData, applyStart: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-2">
                  지원 마감일 <span className="text-coral">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.applyEnd}
                  onChange={(e) => setFormData({ ...formData, applyEnd: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-navy mb-2">
                  카테고리
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="IT/프로그래밍"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-2">
                  모집 인원
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="20 (비워두면 제한없음)"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-4 bg-sand text-navy font-bold rounded-xl hover:bg-sand/80 transition-all"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 bg-gradient-coral text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? '작성 중...' : '작성완료'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
