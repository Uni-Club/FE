'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FileText, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { applicationApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      const response = await applicationApi.getById(Number(id));
      if (response) {
        setApplication(response);
      }
    } catch (err) {
      console.error('Failed to load application:', err);
      setError('지원서를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !application) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto text-center">
          {error && <ErrorMessage message={error} />}
          <h1 className="font-display font-bold text-4xl mb-4 text-neutral-900">지원서를 찾을 수 없습니다</h1>
        </div>
      </main>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-600';
      case 'REJECTED':
        return 'bg-red-100 text-red-600';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return '합격';
      case 'REJECTED':
        return '불합격';
      case 'PENDING':
        return '검토 중';
      default:
        return status;
    }
  };

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 border border-neutral-200"
        >
          {/* Header */}
          <div className="pb-6 border-b border-neutral-200 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-neutral-900">
                지원서 상세
              </h1>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                {getStatusText(application.status)}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{application.applicant?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(application.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
          </div>

          {/* Recruitment Info */}
          <div className="mb-6">
            <h2 className="font-bold text-xl text-neutral-900 mb-4">모집 공고</h2>
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-bold text-lg text-neutral-900 mb-2">
                {application.recruitment?.title}
              </h3>
              <p className="text-sm text-neutral-600">
                {application.recruitment?.group?.groupName}
              </p>
            </div>
          </div>

          {/* Motivation */}
          <div className="mb-6">
            <h2 className="font-bold text-xl text-neutral-900 mb-4">지원 동기</h2>
            <div className="bg-neutral-50 rounded-xl p-4">
              <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {application.motivation || '작성된 지원 동기가 없습니다.'}
              </p>
            </div>
          </div>

          {/* Custom Answers */}
          {application.answers && application.answers.length > 0 && (
            <div className="mb-6">
              <h2 className="font-bold text-xl text-neutral-900 mb-4">추가 질문 답변</h2>
              <div className="space-y-4">
                {application.answers.map((answer: any, index: number) => (
                  <div key={index} className="bg-neutral-50 rounded-xl p-4">
                    <h3 className="font-semibold text-neutral-900 mb-2">
                      {answer.fieldName}
                    </h3>
                    <p className="text-neutral-700">{answer.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review */}
          {application.reviewNote && (
            <div className="mb-6">
              <h2 className="font-bold text-xl text-neutral-900 mb-4">심사 결과</h2>
              <div className={`rounded-xl p-4 ${application.status === 'ACCEPTED' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                <p className="text-neutral-700 whitespace-pre-wrap">
                  {application.reviewNote}
                </p>
                {application.reviewer && (
                  <p className="text-sm text-neutral-600 mt-2">
                    심사자: {application.reviewer.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {application.status === 'PENDING' && (
            <div className="flex gap-4 pt-6 border-t border-neutral-200">
              <button className="flex-1 px-6 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 hover:shadow-primary transition-all flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                합격
              </button>
              <button className="flex-1 px-6 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5" />
                불합격
              </button>
            </div>
          )}

          {/* Applicant Actions */}
          {(application.status === 'SUBMITTED' || application.status === 'PENDING') && (
            <div className="mt-4 pt-6 border-t border-neutral-200">
              <button
                onClick={async () => {
                  if (confirm('정말로 지원을 취소하시겠습니까?')) {
                    try {
                      await applicationApi.cancel(application.applicationId);
                      alert('지원이 취소되었습니다.');
                      window.location.href = '/profile';
                    } catch (e) {
                      alert('지원 취소에 실패했습니다.');
                    }
                  }
                }}
                className="w-full px-6 py-4 bg-neutral-100 text-neutral-600 rounded-xl font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                지원 취소
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
