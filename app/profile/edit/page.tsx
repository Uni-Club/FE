'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, GraduationCap, ChevronDown } from 'lucide-react';
import { userApi, schoolApi } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

function ProfileEditContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    studentId: '',
    schoolId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, schoolsRes] = await Promise.all([
        userApi.getMe(),
        schoolApi.search(),
      ]);

      if (profileRes.success && profileRes.data) {
        const userData: any = profileRes.data;
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          studentId: userData.studentId || '',
          schoolId: userData.schoolId?.toString() || '',
        });
      }

      if (schoolsRes.data) {
        const data: any = schoolsRes.data;
        setSchools(data.content || []);
      }
    } catch (err) {
      setError('프로필을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const response = await userApi.updateMe({
        name: formData.name,
        phone: formData.phone || undefined,
        studentId: formData.studentId || undefined,
        schoolId: formData.schoolId ? Number(formData.schoolId) : undefined,
      });
      if (response.success) {
        alert('프로필이 수정되었습니다.');
        router.push('/profile');
      } else {
        setError(response.error?.message || '수정에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-14 flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-14 pb-12 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">프로필 수정</h1>
          <p className="text-gray-500 text-sm mt-1">회원 정보를 수정합니다</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이름 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                이름 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                전화번호 <span className="text-gray-400 text-xs">(선택)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-1234-5678"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* 학번 */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1.5">
                학번 <span className="text-gray-400 text-xs">(선택)</span>
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="20231234"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* 학교 */}
            <div>
              <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-1.5">
                학교 <span className="text-gray-400 text-xs">(선택)</span>
              </label>
              <div className="relative">
                <select
                  id="schoolId"
                  value={formData.schoolId}
                  onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                  className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm appearance-none bg-white"
                >
                  <option value="">학교 선택</option>
                  {schools.map((school) => (
                    <option key={school.schoolId} value={school.schoolId}>
                      {school.schoolName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ProfileEditPage() {
  return (
    <AuthGuard>
      <ProfileEditContent />
    </AuthGuard>
  );
}
