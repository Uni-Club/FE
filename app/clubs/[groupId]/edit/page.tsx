'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { groupApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function EditClubPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    groupName: '',
    description: '',
  });

  useEffect(() => {
    loadClub();
  }, [params.groupId]);

  const loadClub = async () => {
    try {
      setLoading(true);
      const response = await groupApi.getById(Number(params.groupId));
      if (response.success && response.data) {
        const clubData: any = response.data;
        setFormData({
          groupName: clubData.groupName,
          description: clubData.description || '',
        });
      }
    } catch (err) {
      setError('동아리 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const response = await groupApi.update(Number(params.groupId), formData);
      if (response.success) {
        alert('동아리 정보가 수정되었습니다!');
        router.push(`/clubs/${params.groupId}`);
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
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-medium"
        >
          <h1 className="font-display font-bold text-3xl text-navy mb-8">
            동아리 정보 수정
          </h1>

          {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-bold text-navy mb-2">
                동아리 이름 <span className="text-coral">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-navy mb-2">
                동아리 소개 <span className="text-coral">*</span>
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all resize-none"
              />
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
                {submitting ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
