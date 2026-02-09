'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FileText, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { groupApi, applicationApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import AuthGuard from '@/components/AuthGuard';
import { useToast } from '@/components/ui/toast';

function ClubApplicationsContent() {
  const params = useParams();
  const { toast } = useToast();
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
        const data = response.data;
        setApplications(Array.isArray(data) ? data : (data as any).content || []);
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
        toast({
          title: status === 'ACCEPTED' ? '합격 처리되었습니다.' : '불합격 처리되었습니다.',
          variant: 'success',
        });
        setSelectedApp(null);
        setReviewNote('');
        loadApplications();
      } else {
        toast({ title: response.error?.message || '심사에 실패했습니다.', variant: 'error' });
      }
    } catch (err: any) {
      toast({ title: err.message || '심사에 실패했습니다.', variant: 'error' });
    }
  };

  // answers can be Map<String, Object> (object) from backend
  const renderAnswers = (answers: any) => {
    if (!answers) return null;
    const entries = typeof answers === 'object' && !Array.isArray(answers)
      ? Object.entries(answers)
      : Array.isArray(answers)
        ? answers.map((a: any) => [a.fieldName || a.question || `질문`, a.value || a.answer || ''])
        : [];
    if (entries.length === 0) return null;
    return (
      <div>
        <h3 className="font-bold text-slate-800 mb-3">답변</h3>
        <div className="space-y-4">
          {(entries as [string, any][]).map(([key, value], i) => (
            <div key={i} className="bg-slate-100 rounded-lg p-4">
              <p className="font-medium text-slate-800 mb-1">{key}</p>
              <p className="text-slate-600">{String(value)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <Loading />;

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-bold text-4xl text-slate-800 mb-2">
            지원서 관리
          </h1>
          <p className="text-slate-500">총 {applications.length}개의 지원서</p>
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
                    ? 'border-indigo-500 shadow-md'
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">
                      {app.applicantName || app.applicant?.name || '지원자'}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {app.applicantEmail || app.applicant?.email || ''}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      app.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-700'
                        : app.status === 'REJECTED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {app.status === 'ACCEPTED' && '합격'}
                    {app.status === 'REJECTED' && '불합격'}
                    {app.status === 'UNDER_REVIEW' && '심사중'}
                    {app.status === 'SUBMITTED' && '제출완료'}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {app.recruitmentTitle || app.recruitment?.title || ''}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  지원일: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '-'}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 상세 정보 */}
          {selectedApp && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-8 shadow-md sticky top-28"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-2xl text-slate-800">
                    {selectedApp.applicantName || selectedApp.applicant?.name || '지원자'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {selectedApp.applicantEmail || selectedApp.applicant?.email || ''}
                  </p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">지원 동기</h3>
                  <p className="text-slate-600 whitespace-pre-wrap">
                    {selectedApp.motivation || '없음'}
                  </p>
                </div>

                {renderAnswers(selectedApp.answers)}
              </div>

              {selectedApp.status === 'SUBMITTED' || selectedApp.status === 'UNDER_REVIEW' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-2">심사 의견</label>
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      rows={3}
                      placeholder="심사 의견을 입력하세요 (선택사항)"
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
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
                <div className="text-center py-4 text-slate-500">
                  이미 심사가 완료된 지원서입니다.
                </div>
              )}
            </motion.div>
          )}

          {!selectedApp && applications.length > 0 && (
            <div className="flex items-center justify-center text-slate-400">
              지원서를 선택하세요
            </div>
          )}
        </div>

        {applications.length === 0 && !loading && (
          <div className="text-center py-20 text-slate-500">
            접수된 지원서가 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}

export default function ClubApplicationsPage() {
  return (
    <AuthGuard>
      <ClubApplicationsContent />
    </AuthGuard>
  );
}
