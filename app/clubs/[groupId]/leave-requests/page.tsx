'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { UserMinus, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { groupApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function LeaveRequestsPage() {
  const params = useParams();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequests();
  }, [params.groupId]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await groupApi.getLeaveRequests(Number(params.groupId));
      if (response.success && Array.isArray(response.data)) {
        setRequests(response.data);
      }
    } catch (err) {
      setError('탈퇴 신청 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    const note = prompt('승인 사유를 입력하세요 (선택사항):');
    try {
      const response = await groupApi.approveLeaveRequest(
        Number(params.groupId),
        requestId,
        note || undefined
      );
      if (response.success) {
        alert('탈퇴 신청이 승인되었습니다.');
        loadRequests();
      } else {
        alert(response.error?.message || '승인에 실패했습니다.');
      }
    } catch (err: any) {
      alert(err.message || '승인에 실패했습니다.');
    }
  };

  const handleReject = async (requestId: number) => {
    const note = prompt('거절 사유를 입력하세요:');
    if (!note) return;

    try {
      const response = await groupApi.rejectLeaveRequest(
        Number(params.groupId),
        requestId,
        note
      );
      if (response.success) {
        alert('탈퇴 신청이 거절되었습니다.');
        loadRequests();
      } else {
        alert(response.error?.message || '거절에 실패했습니다.');
      }
    } catch (err: any) {
      alert(err.message || '거절에 실패했습니다.');
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl text-navy mb-2">
            탈퇴 신청 관리
          </h1>
          <p className="text-navy/60">총 {requests.length}개의 신청</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="space-y-4">
          {requests.map((request, index) => (
            <motion.div
              key={request.requestId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-navy/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-coral rounded-full flex items-center justify-center">
                    <UserMinus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-navy mb-1">
                      {request.user.name}
                    </h3>
                    <p className="text-sm text-navy/60 mb-3">
                      {request.user.email}
                    </p>
                    <div className="bg-sand/30 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-navy mb-1">탈퇴 사유:</p>
                      <p className="text-navy/70">{request.reason || '없음'}</p>
                    </div>
                    <p className="text-xs text-navy/50">
                      신청일: {new Date(request.requestedAt).toLocaleDateString()}
                    </p>

                    {request.status !== 'PENDING' && (
                      <div className="mt-3 pt-3 border-t border-navy/10">
                        <p className="text-sm font-medium text-navy mb-1">
                          처리 결과: <span className={request.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}>
                            {request.status === 'APPROVED' ? '승인' : '거절'}
                          </span>
                        </p>
                        {request.reviewNote && (
                          <p className="text-sm text-navy/70">의견: {request.reviewNote}</p>
                        )}
                        <p className="text-xs text-navy/50">
                          처리일: {new Date(request.reviewedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium text-center ${
                      request.status === 'APPROVED'
                        ? 'bg-green-100 text-green-700'
                        : request.status === 'REJECTED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-sand text-navy'
                    }`}
                  >
                    {request.status === 'APPROVED' && '승인됨'}
                    {request.status === 'REJECTED' && '거절됨'}
                    {request.status === 'PENDING' && '대기중'}
                  </span>

                  {request.status === 'PENDING' && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleReject(request.requestId)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        title="거절"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleApprove(request.requestId)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                        title="승인"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {requests.length === 0 && !loading && (
          <div className="text-center py-20 text-navy/60">
            탈퇴 신청이 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
