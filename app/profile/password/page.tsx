'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { userApi } from '@/lib/api';
import ErrorMessage from '@/components/ErrorMessage';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

function PasswordChangeContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const response = await userApi.changePassword(
        formData.currentPassword,
        formData.newPassword
      );

      if (response.success) {
        toast({ title: '비밀번호가 변경되었습니다.', variant: 'success' });
        router.push('/profile');
      } else {
        setError(response.error?.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '비밀번호 변경에 실패했습니다.';
      setError(message);
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
            비밀번호 변경
          </h1>

          {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-bold text-slate-900 mb-2">
                현재 비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-2">
                새 비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <p className="text-sm text-slate-500 mt-2">
                8자 이상, 영문+숫자+특수문자 조합
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-2">
                새 비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                className="flex-1 py-4 h-auto font-bold"
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 h-auto font-bold"
              >
                {submitting ? '변경 중...' : '변경하기'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}

export default function PasswordChangePage() {
  return (
    <AuthGuard>
      <PasswordChangeContent />
    </AuthGuard>
  );
}
