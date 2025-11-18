'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FileText, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { groupApi, applicationApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function ClubApplicationsPage() {
  const params = useParams();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [reviewNote, setReviewNote] = useState('');

  useEffect(() => {
    loadApplications();
  }, [params.groupId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await groupApi.getApplications(Number(params.groupId));
      if (response.success && response.data) {
        setApplications(response.data.content || []);
      }
    } catch (err) {
      setError('지원서 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (applicationId: number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const response = await applicationApi.review(applicationId, status, reviewNote);
      if (response.success) {
        alert(status === 'ACCEPTED' ? '합격 처리되었습니다.' : '불합격 처리되었습니다.');
        setSelectedApp(null);
        setReviewNote('');
        loadApplications();
      } else {
        alert(response.error?.message || '심사에 실패했습니다.');
      }
    } catch (err: any) {
      alert(err.message || '심사에 실패했습니다.');
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl text-navy mb-2">
            지원서 관리
          </h1>
          <p className="text-navy/60">총 {applications.length}개의 지원서</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 지원서 목록 */}
          <div className="space-y-4">
            {applications.map((app, index) => (
              <motion.div
                key={app.applicationId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedApp(app)}
                className={`bg-white rounded-2xl p-6 cursor-pointer transition-all border-2 ${
                  selectedApp?.applicationId === app.applicationId
                    ? 'border-coral shadow-medium'
                    : 'border-navy/5 hover:border-coral/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-navy">{app.applicant.name}</h3>
                    <p className="text-sm text-navy/60">{app.applicant.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      app.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-700'
                        : app.status === 'REJECTED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-sand text-navy'
                    }`}
                  >
                    {app.status === 'ACCEPTED' && '합격'}
                    {app.status === 'REJECTED' && '불합격'}
                    {app.status === 'UNDER_REVIEW' && '심사중'}
                    {app.status === 'SUBMITTED' && '제출완료'}
                  </span>
                </div>
                <p className="text-sm text-navy/60">
                  {app.recruitment?.title}
                </p>
                <p className="text-xs text-navy/50 mt-2">
                  지원일: {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 상세 정보 */}
          {selectedApp && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-8 shadow-medium sticky top-28"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-coral rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-navy">
                    {selectedApp.applicant.name}
                  </h2>
                  <p className="text-sm text-navy/60">{selectedApp.applicant.studentId}</p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="font-bold text-navy mb-2">지원 동기</h3>
                  <p className="text-navy/70 whitespace-pre-wrap">
                    {selectedApp.motivation || '없음'}
                  </p>
                </div>

                {selectedApp.answers && selectedApp.answers.length > 0 && (
                  <div>
                    <h3 className="font-bold text-navy mb-3">답변</h3>
                    <div className="space-y-4">
                      {selectedApp.answers.map((answer: any, i: number) => (
                        <div key={i} className="bg-sand/30 rounded-lg p-4">
                          <p className="font-medium text-navy mb-1">{answer.fieldName}</p>
                          <p className="text-navy/70">{answer.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedApp.status === 'SUBMITTED' || selectedApp.status === 'UNDER_REVIEW' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-navy mb-2">심사 의견</label>
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      rows={3}
                      placeholder="심사 의견을 입력하세요 (선택사항)"
                      className="w-full px-4 py-3 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview(selectedApp.applicationId, 'REJECTED')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all"
                    >
                      <X className="w-5 h-5" />
                      불합격
                    </button>
                    <button
                      onClick={() => handleReview(selectedApp.applicationId, 'ACCEPTED')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all"
                    >
                      <Check className="w-5 h-5" />
                      합격
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-navy/60">
                  이미 심사가 완료된 지원서입니다.
                </div>
              )}
            </motion.div>
          )}

          {!selectedApp && applications.length > 0 && (
            <div className="flex items-center justify-center text-navy/40">
              지원서를 선택하세요
            </div>
          )}
        </div>

        {applications.length === 0 && !loading && (
          <div className="text-center py-20 text-navy/60">
            접수된 지원서가 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
