'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, School, Edit, Lock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { userApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';

function ProfileContent() {
  const [user, setUser] = useState<any>(null);
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'clubs'>('info');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [userResponse, groupsResponse] = await Promise.all([
        userApi.getMe(),
        userApi.getMyGroups(),
      ]);

      if (userResponse.success) setUser(userResponse.data);
      if (groupsResponse.success) setMyGroups(Array.isArray(groupsResponse.data) ? groupsResponse.data : []);
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
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-bold text-4xl text-slate-900 mb-2">
            마이페이지
          </h1>
          <p className="text-slate-500">내 정보와 활동을 관리하세요</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 font-bold transition-colors border-b-2 ${
              activeTab === 'info'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            내 정보
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-6 py-3 font-bold transition-colors border-b-2 ${
              activeTab === 'clubs'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            내 동아리 ({myGroups.length})
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
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex justify-between items-start mb-8">
                <h2 className="font-bold text-2xl text-slate-900">개인 정보</h2>
                <Button variant="secondary" asChild>
                  <Link href="/profile/edit">
                    <Edit className="w-4 h-4" />
                    수정
                  </Link>
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">이름</p>
                    <p className="font-bold text-slate-900">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">이메일</p>
                    <p className="font-bold text-slate-900">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">전화번호</p>
                      <p className="font-bold text-slate-900">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.school && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <School className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">학교</p>
                      <p className="font-bold text-slate-900">{user.school.schoolName}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <Link
                  href="/profile/password"
                  className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
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
                  <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all border border-slate-200">
                    <h3 className="font-bold text-xl text-slate-900 mb-2">{group.groupName}</h3>
                    <p className="text-sm text-slate-500 mb-4">{group.role}</p>
                    <div className="text-xs text-slate-400">
                      가입일: {new Date(group.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
              {myGroups.length === 0 && (
                <div className="col-span-2 text-center py-12 text-slate-500">
                  가입한 동아리가 없습니다.
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
