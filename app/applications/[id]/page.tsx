'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, User, Calendar, Clock, CheckCircle, XCircle, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { applicationApi } from '@/lib/api';
import Loading from '@/components/Loading';
import AuthGuard from '@/components/AuthGuard';

interface ApplicationDetail {
  applicationId: number;
  recruitmentId: number;
  recruitmentTitle: string;
  groupId: number;
  groupName: string;
  applicantId: number;
  applicantName: string;
  applicantEmail: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  motivation: string;
  answers: Record<string, unknown>;
  reviewerName?: string;
  reviewNote?: string;
  appliedAt: string;
  decidedAt?: string;
}

function ApplicationDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await applicationApi.getById(Number(id));
      if (response.success && response.data) {
        setApplication(response.data as ApplicationDetail);
      } else {
        setError(response.error?.message || '지원서를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('지원서를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!application) return;
    if (!confirm('정말로 지원을 취소하시겠습니까?')) return;

    try {
      setCancelling(true);
      const response = await applicationApi.cancel(application.applicationId);
      if (response.success) {
        alert('지원이 취소되었습니다.');
        router.push('/applications');
      } else {
        alert(response.error?.message || '지원 취소에 실패했습니다.');
      }
    } catch (err) {
      alert('지원 취소에 실패했습니다.');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
      SUBMITTED: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        label: '제출완료',
        icon: <FileText className="w-4 h-4" />,
      },
      UNDER_REVIEW: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        label: '심사중',
        icon: <Clock className="w-4 h-4" />,
      },
      ACCEPTED: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: '합격',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      REJECTED: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        label: '불합격',
        icon: <XCircle className="w-4 h-4" />,
      },
      CANCELLED: {
        bg: 'bg-gray-100',
        text: 'text-gray-500',
        label: '취소됨',
        icon: <XCircle className="w-4 h-4" />,
      },
    };
    const c = config[status] || config.SUBMITTED;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${c.bg} ${c.text}`}>
        {c.icon}
        {c.label}
      </span>
    );
  };

  if (loading) return <Loading />;

  if (error || !application) {
    return (
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            지원서를 찾을 수 없습니다
          </h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            지원 내역으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const canCancel = application.status === 'SUBMITTED' || application.status === 'UNDER_REVIEW';

  return (
    <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href="/applications"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          지원 내역으로 돌아가기
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {application.recruitmentTitle}
                </h1>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Building2 className="w-4 h-4" />
                  <Link
                    href={`/clubs/${application.groupId}`}
                    className="hover:text-blue-500 hover:underline"
                  >
                    {application.groupName}
                  </Link>
                </div>
              </div>
              {getStatusBadge(application.status)}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>지원일: {new Date(application.appliedAt).toLocaleDateString('ko-KR')}</span>
              </div>
              {application.decidedAt && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>결정일: {new Date(application.decidedAt).toLocaleDateString('ko-KR')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Motivation */}
            <div>
              <h2 className="font-bold text-gray-900 mb-3">지원 동기</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {application.motivation || '작성된 지원 동기가 없습니다.'}
                </p>
              </div>
            </div>

            {/* Answers */}
            {application.answers && Object.keys(application.answers).length > 0 && (
              <div>
                <h2 className="font-bold text-gray-900 mb-3">추가 질문 답변</h2>
                <div className="space-y-3">
                  {Object.entries(application.answers).map(([key, value], index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-1.5 text-sm">{key}</h3>
                      <p className="text-gray-700">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Note */}
            {application.reviewNote && (
              <div>
                <h2 className="font-bold text-gray-900 mb-3">심사 의견</h2>
                <div className={`rounded-lg p-4 ${
                  application.status === 'ACCEPTED'
                    ? 'bg-green-50 border border-green-100'
                    : application.status === 'REJECTED'
                    ? 'bg-red-50 border border-red-100'
                    : 'bg-gray-50'
                }`}>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {application.reviewNote}
                  </p>
                  {application.reviewerName && (
                    <p className="text-sm text-gray-500 mt-2">
                      - {application.reviewerName}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {canCancel && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                {cancelling ? '취소 중...' : '지원 취소'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default function ApplicationDetailPage() {
  return (
    <AuthGuard>
      <ApplicationDetailContent />
    </AuthGuard>
  );
}
