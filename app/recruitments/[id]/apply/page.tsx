'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { recruitmentApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function ApplyPage() {
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
      const answerArray = Object.entries(answers).map(([fieldName, value]) => ({
        fieldName,
        value,
      }));

      const response = await recruitmentApi.apply(Number(params.id), {
        motivation,
        answers: answerArray,
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

  if (loading) return <Loading />;
  if (error) return <div className="pt-28 px-4"><ErrorMessage message={error} /></div>;
  if (!recruitment) return null;

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-medium"
        >
          <h1 className="font-display font-bold text-3xl text-navy mb-2">
            지원서 작성
          </h1>
          <p className="text-navy/60 mb-8">{recruitment.title}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 지원 동기 */}
            <div>
              <label className="block font-bold text-navy mb-2">
                지원 동기 <span className="text-coral">*</span>
              </label>
              <textarea
                required
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                rows={5}
                placeholder="지원 동기를 작성해주세요"
                className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all resize-none"
              />
            </div>

            {/* Custom Fields */}
            {recruitment.customFields?.map((field: any, index: number) => (
              <div key={index}>
                <label className="block font-bold text-navy mb-2">
                  {field.fieldName}
                  {field.required && <span className="text-coral"> *</span>}
                </label>
                {field.fieldType === 'textarea' ? (
                  <textarea
                    required={field.required}
                    value={answers[field.fieldName] || ''}
                    onChange={(e) => setAnswers({ ...answers, [field.fieldName]: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all resize-none"
                  />
                ) : field.fieldType === 'select' ? (
                  <select
                    required={field.required}
                    value={answers[field.fieldName] || ''}
                    onChange={(e) => setAnswers({ ...answers, [field.fieldName]: e.target.value })}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
                  >
                    <option value="">선택하세요</option>
                    {field.options?.map((option: string, i: number) => (
                      <option key={i} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required={field.required}
                    value={answers[field.fieldName] || ''}
                    onChange={(e) => setAnswers({ ...answers, [field.fieldName]: e.target.value })}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
                  />
                )}
              </div>
            ))}

            {/* Submit Button */}
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
                {submitting ? '제출 중...' : '제출하기'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
