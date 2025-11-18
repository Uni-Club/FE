'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { userApi } from '@/lib/api';
import ErrorMessage from '@/components/ErrorMessage';

export default function PasswordChangePage() {
  const router = useRouter();
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
        alert('비밀번호가 변경되었습니다.');
        router.push('/profile');
      } else {
        setError(response.error?.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-medium"
        >
          <h1 className="font-display font-bold text-3xl text-navy mb-8">
            비밀번호 변경
          </h1>

          {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-bold text-navy mb-2">
                현재 비밀번호 <span className="text-coral">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-navy mb-2">
                새 비밀번호 <span className="text-coral">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
              />
              <p className="text-sm text-navy/60 mt-2">
                8자 이상, 영문+숫자+특수문자 조합
              </p>
            </div>

            <div>
              <label className="block font-bold text-navy mb-2">
                새 비밀번호 확인 <span className="text-coral">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
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
                {submitting ? '변경 중...' : '변경하기'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
