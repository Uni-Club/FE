'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { groupApi } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

function EditClubContent() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    groupName: '',
    description: '',
  });
  const { toast } = useToast();

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
        toast({ title: '동아리 정보가 수정되었습니다!', variant: 'success' });
        router.push(`/clubs/${params.groupId}`);
      } else {
        setError(response.error?.message || '수정에 실패했습니다.');
        toast({ title: response.error?.message || '수정에 실패했습니다', variant: 'error' });
      }
    } catch (err: any) {
      setError(err.message || '수정에 실패했습니다.');
      toast({ title: '수정 실패', description: err.message, variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-slate-50 px-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">동아리 정보 수정</h1>
          <p className="text-slate-500 text-sm mt-1">동아리 기본 정보를 수정합니다</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 동아리 이름 */}
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-slate-700 mb-1.5">
                동아리 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="groupName"
                required
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            {/* 동아리 소개 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                동아리 소개 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm resize-none"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? '저장 중...' : '저장하기'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function EditClubPage() {
  return (
    <AuthGuard>
      <EditClubContent />
    </AuthGuard>
  );
}
