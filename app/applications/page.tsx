'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { userApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import AuthGuard from '@/components/AuthGuard';

interface Application {
  applicationId: number;
  recruitmentId: number;
  recruitmentTitle: string;
  groupId: number;
  groupName: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  motivation: string;
  appliedAt: string;
  decidedAt?: string;
  reviewNote?: string;
}

const statusFilters = [
  { value: '', label: '전체' },
  { value: 'SUBMITTED', label: '제출완료' },
  { value: 'UNDER_REVIEW', label: '심사중' },
  { value: 'ACCEPTED', label: '합격' },
  { value: 'REJECTED', label: '불합격' },
];

function ApplicationsContent() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userApi.getMyApplications(statusFilter || undefined);
      if (response.success && response.data) {
        const data = Array.isArray(response.data) ? response.data : [];
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch (err) {
      setError('지원 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'UNDER_REVIEW':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'CANCELLED':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      SUBMITTED: 'bg-blue-100 text-blue-700',
      UNDER_REVIEW: 'bg-yellow-100 text-yellow-700',
      ACCEPTED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-gray-100 text-gray-500',
    };
    const labels: Record<string, string> = {
      SUBMITTED: '제출완료',
      UNDER_REVIEW: '심사중',
      ACCEPTED: '합격',
      REJECTED: '불합격',
      CANCELLED: '취소됨',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) return <Loading />;

  return (
    <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">내 지원 내역</h1>
          <p className="text-sm text-gray-500 mt-1">
            총 {applications.length}개의 지원서
          </p>
        </div>

        {/* Error */}
        {error && <ErrorMessage message={error} />}

        {/* Status Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app, index) => (
              <motion.div
                key={app.applicationId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link href={`/applications/${app.applicationId}`}>
                  <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(app.status)}
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {app.recruitmentTitle}
                          </h3>
                          <p className="text-sm text-gray-500">{app.groupName}</p>
                        </div>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    {app.motivation && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {app.motivation}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>
                        지원일: {new Date(app.appliedAt).toLocaleDateString('ko-KR')}
                      </span>
                      {app.decidedAt && (
                        <span>
                          결정일: {new Date(app.decidedAt).toLocaleDateString('ko-KR')}
                        </span>
                      )}
                    </div>

                    {app.reviewNote && app.status !== 'SUBMITTED' && app.status !== 'UNDER_REVIEW' && (
                      <div className={`mt-3 p-3 rounded-lg text-sm ${
                        app.status === 'ACCEPTED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        <span className="font-medium">심사 의견: </span>
                        {app.reviewNote}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">
              지원 내역이 없습니다
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              동아리 모집공고에 지원해보세요
            </p>
            <Link
              href="/recruitments"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              모집공고 보기
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ApplicationsPage() {
  return (
    <AuthGuard>
      <ApplicationsContent />
    </AuthGuard>
  );
}
