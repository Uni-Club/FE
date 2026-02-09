'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { groupApi, schoolApi } from '@/lib/api';
import ErrorMessage from '@/components/ErrorMessage';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

function NewClubContent() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    groupName: '',
    description: '',
    schoolId: 0,
    isUnion: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const response = await schoolApi.search();
      if (response.success && response.data) {
        const data = response.data;
        setSchools(Array.isArray(data) ? data : (data as any).content || []);
      }
    } catch (err) {
      console.error('Failed to load schools');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const response = await groupApi.create(formData);
      if (response.success) {
        toast({ title: '동아리가 생성되었습니다!', variant: 'success' });
        const data: any = response.data;
        router.push(`/clubs/${data.groupId}`);
      } else {
        setError(response.error?.message || '동아리 생성에 실패했습니다.');
        toast({ title: response.error?.message || '동아리 생성에 실패했습니다', variant: 'error' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '동아리 생성에 실패했습니다.';
      setError(message);
      toast({ title: '동아리 생성 실패', description: message, variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
        >
          <h1 className="font-bold text-3xl text-slate-900 mb-8">
            새 동아리 만들기
          </h1>

          {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-bold text-slate-900 mb-2">
                동아리 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                placeholder="동아리 이름을 입력하세요"
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-2">
                동아리 소개 <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                placeholder="동아리에 대해 소개해주세요"
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-2">
                학교 선택
              </label>
              <select
                value={formData.schoolId}
                onChange={(e) => setFormData({ ...formData, schoolId: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value={0}>학교 선택 안함 (연합 동아리)</option>
                {schools.map((school) => (
                  <option key={school.schoolId} value={school.schoolId}>
                    {school.schoolName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isUnion"
                checked={formData.isUnion}
                onChange={(e) => setFormData({ ...formData, isUnion: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded border-slate-200 focus:ring-indigo-500"
              />
              <label htmlFor="isUnion" className="font-medium text-slate-700">
                연합 동아리입니다
              </label>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                className="flex-1 py-4"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4"
              >
                {submitting ? '생성 중...' : '동아리 만들기'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}

export default function NewClubPage() {
  return (
    <AuthGuard>
      <NewClubContent />
    </AuthGuard>
  );
}
