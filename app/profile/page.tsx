'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, School, Edit, Lock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { userApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'clubs' | 'applications'>('info');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [userResponse, groupsResponse, applicationsResponse] = await Promise.all([
        userApi.getMe(),
        userApi.getMyGroups(),
        userApi.getMyApplications(),
      ]);

      if (userResponse.success) setUser(userResponse.data);
      if (groupsResponse.success) setMyGroups(Array.isArray(groupsResponse.data) ? groupsResponse.data : []);
      if (applicationsResponse.success) setMyApplications(Array.isArray(applicationsResponse.data) ? applicationsResponse.data : []);
    } catch (err) {
      setError('프로필을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="pt-28 px-4"><ErrorMessage message={error} /></div>;
  if (!user) return null;

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl text-navy mb-2">
            마이페이지
          </h1>
          <p className="text-navy/60">내 정보와 활동을 관리하세요</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-navy/10">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 font-bold transition-colors border-b-2 ${
              activeTab === 'info'
                ? 'border-coral text-coral'
                : 'border-transparent text-navy/60 hover:text-navy'
            }`}
          >
            내 정보
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-6 py-3 font-bold transition-colors border-b-2 ${
              activeTab === 'clubs'
                ? 'border-coral text-coral'
                : 'border-transparent text-navy/60 hover:text-navy'
            }`}
          >
            내 동아리 ({myGroups.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 font-bold transition-colors border-b-2 ${
              activeTab === 'applications'
                ? 'border-coral text-coral'
                : 'border-transparent text-navy/60 hover:text-navy'
            }`}
          >
            지원 내역 ({myApplications.length})
          </button>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'info' && (
            <div className="bg-white rounded-2xl p-8 shadow-medium">
              <div className="flex justify-between items-start mb-8">
                <h2 className="font-display font-bold text-2xl text-navy">개인 정보</h2>
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-2 px-4 py-2 bg-sand text-navy font-medium rounded-lg hover:bg-sand/80 transition-all"
                >
                  <Edit className="w-4 h-4" />
                  수정
                </Link>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-coral rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-navy/60">이름</p>
                    <p className="font-bold text-navy">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sand rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-navy" />
                  </div>
                  <div>
                    <p className="text-sm text-navy/60">이메일</p>
                    <p className="font-bold text-navy">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sand rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <p className="text-sm text-navy/60">전화번호</p>
                      <p className="font-bold text-navy">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.school && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sand rounded-full flex items-center justify-center">
                      <School className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <p className="text-sm text-navy/60">학교</p>
                      <p className="font-bold text-navy">{user.school.schoolName}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-navy/10">
                <Link
                  href="/profile/password"
                  className="flex items-center gap-2 text-navy/70 hover:text-coral transition-colors"
                >
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">비밀번호 변경</span>
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'clubs' && (
            <div className="grid md:grid-cols-2 gap-6">
              {myGroups.map((group: any) => (
                <Link key={group.groupId} href={`/clubs/${group.groupId}`}>
                  <div className="bg-white rounded-2xl p-6 hover:shadow-medium transition-all border border-navy/5">
                    <h3 className="font-bold text-xl text-navy mb-2">{group.groupName}</h3>
                    <p className="text-sm text-navy/60 mb-4">{group.role}</p>
                    <div className="text-xs text-navy/50">
                      가입일: {new Date(group.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
              {myGroups.length === 0 && (
                <div className="col-span-2 text-center py-12 text-navy/60">
                  가입한 동아리가 없습니다.
                </div>
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-4">
              {myApplications.map((application: any) => (
                <div
                  key={application.applicationId}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-navy/5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-navy mb-1">
                        {application.recruitment?.title}
                      </h3>
                      <p className="text-sm text-navy/60 mb-3">
                        {application.recruitment?.group?.groupName}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        application.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-700'
                          : application.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-sand text-navy'
                      }`}
                    >
                      {application.status === 'ACCEPTED' && '합격'}
                      {application.status === 'REJECTED' && '불합격'}
                      {application.status === 'UNDER_REVIEW' && '심사중'}
                      {application.status === 'SUBMITTED' && '제출완료'}
                    </span>
                  </div>
                  <div className="text-xs text-navy/50">
                    지원일: {new Date(application.appliedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {myApplications.length === 0 && (
                <div className="text-center py-12 text-navy/60">
                  지원 내역이 없습니다.
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
