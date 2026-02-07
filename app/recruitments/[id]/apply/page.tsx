'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { recruitmentApi } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

function ApplyContent() {
  const params = useParams();
  const router = useRouter();
  const [recruitment, setRecruitment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [motivation, setMotivation] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRecruitment();
  }, [params.id]);

  const loadRecruitment = async () => {
    try {
      setLoading(true);
      const response = await recruitmentApi.getById(Number(params.id));
      if (response.success && response.data) {
        setRecruitment(response.data);
      } else {
        setError('모집공고를 불러오는데 실패했습니다.');
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

      // Backend expects Map<String, Object>, not array
      const response = await recruitmentApi.apply(Number(params.id), {
        motivation,
        answers,  // answers is already Record<string, string>
      });

      if (response.success) {
        alert('지원서가 제출되었습니다!');
        router.push('/profile');
      } else {
        setError(response.error?.message || '지원에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '지원에 실패했습니다.');
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

  if (error && !recruitment) {
    return (
      <main className="min-h-screen pt-14 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            돌아가기
          </button>
        </div>
      </main>
    );
  }

  if (!recruitment) return null;

  return (
    <main className="min-h-screen pt-14 pb-12 bg-gray-50 px-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">지원서 작성</h1>
          <p className="text-gray-500 text-sm mt-1">{recruitment.title}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 지원 동기 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                지원 동기 <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                rows={5}
                placeholder="지원 동기를 작성해주세요"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none"
              />
            </div>

            {/* Custom Fields */}
            {recruitment.customFields?.map((field: any, index: number) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {field.fieldName}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                {field.fieldType === 'textarea' ? (
                  <textarea
                    required={field.required}
                    value={answers[field.fieldName] || ''}
                    onChange={(e) => setAnswers({ ...answers, [field.fieldName]: e.target.value })}
                    rows={4}
                    placeholder={field.placeholder || ''}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none"
                  />
                ) : field.fieldType === 'select' ? (
                  <select
                    required={field.required}
                    value={answers[field.fieldName] || ''}
                    onChange={(e) => setAnswers({ ...answers, [field.fieldName]: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="">선택하세요</option>
                    {field.options?.map((option: string, i: number) => (
                      <option key={i} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field.fieldType === 'number' ? (
                  <input
                    type="number"
                    required={field.required}
                    value={answers[field.fieldName] || ''}
                    onChange={(e) => setAnswers({ ...answers, [field.fieldName]: e.target.value })}
                    placeholder={field.placeholder || ''}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  />
                ) : (
                  <input
                    type="text"
                    required={field.required}
                    value={answers[field.fieldName] || ''}
                    onChange={(e) => setAnswers({ ...answers, [field.fieldName]: e.target.value })}
                    placeholder={field.placeholder || ''}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  />
                )}
              </div>
            ))}

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
                {submitting ? '제출 중...' : '제출하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ApplyPage() {
  return (
    <AuthGuard>
      <ApplyContent />
    </AuthGuard>
  );
}
