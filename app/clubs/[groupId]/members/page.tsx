'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Users, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { groupApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function ClubMembersPage() {
  const params = useParams();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMembers();
  }, [params.groupId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await groupApi.getMembers(Number(params.groupId));
      if (response.success && Array.isArray(response.data)) {
        setMembers(response.data);
      }
    } catch (err) {
      setError('멤버 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: number, name: string) => {
    if (!confirm(`${name} 님을 동아리에서 퇴출하시겠습니까?`)) return;

    try {
      const response = await groupApi.removeMember(Number(params.groupId), userId);
      if (response.success) {
        alert('멤버가 퇴출되었습니다.');
        loadMembers();
      } else {
        alert(response.error?.message || '퇴출에 실패했습니다.');
      }
    } catch (err: any) {
      alert(err.message || '퇴출에 실패했습니다.');
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl text-navy mb-2">
            멤버 관리
          </h1>
          <p className="text-navy/60">총 {members.length}명의 멤버</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <motion.div
              key={member.memberId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-navy/5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-coral rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-navy">{member.user.name}</h3>
                    <p className="text-sm text-navy/60">{member.role}</p>
                  </div>
                </div>
                {member.role !== '회장' && (
                  <button
                    onClick={() => handleRemoveMember(member.user.userId, member.user.name)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="퇴출"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-2 text-sm text-navy/60">
                <p>학번: {member.user.studentId || '-'}</p>
                <p>가입일: {new Date(member.joinedAt).toLocaleDateString()}</p>
                {member.isFinanceAdmin && (
                  <span className="inline-block px-3 py-1 bg-coral/10 text-coral text-xs rounded-full font-medium">
                    재정 관리자
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {members.length === 0 && !loading && (
          <div className="text-center py-20 text-navy/60">
            멤버가 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
