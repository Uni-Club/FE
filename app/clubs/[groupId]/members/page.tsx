'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Users, Trash2, UserPlus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { groupApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useConfirm } from '@/components/ui/confirm-dialog';

function ClubMembersContent() {
  const params = useParams();
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const confirm = useConfirm();

  // Add member modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUserId, setAddUserId] = useState('');
  const [addRole, setAddRole] = useState('부원');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  useEffect(() => {
    loadMembers();
  }, [params.groupId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await groupApi.getMembers(Number(params.groupId));
      if (response.success && Array.isArray(response.data)) {
        setMembers(response.data);

        // Check if current user is admin
        if (user) {
          const currentMember = response.data.find(
            (m: any) => m.user?.userId === user.userId
          );
          if (
            currentMember &&
            (currentMember.role === '회장' ||
              currentMember.role === '부회장' ||
              currentMember.role === 'ADMIN' ||
              currentMember.role === 'LEADER')
          ) {
            setIsAdmin(true);
          }
        }
      }
    } catch (err) {
      setError('멤버 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: number, name: string) => {
    const ok = await confirm({
      title: '멤버 퇴출',
      description: `${name} 님을 동아리에서 퇴출하시겠습니까?`,
      variant: 'destructive',
      confirmText: '퇴출',
    });
    if (!ok) return;

    try {
      const response = await groupApi.removeMember(Number(params.groupId), userId);
      if (response.success) {
        toast({ title: '멤버가 퇴출되었습니다', variant: 'success' });
        loadMembers();
      } else {
        toast({ title: response.error?.message || '퇴출에 실패했습니다', variant: 'error' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '퇴출에 실패했습니다.';
      toast({ title: message, variant: 'error' });
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUserId.trim()) return;

    try {
      setAdding(true);
      setAddError('');
      setAddSuccess('');

      const userId = Number(addUserId);
      if (isNaN(userId)) {
        setAddError('유효한 사용자 ID를 입력해주세요.');
        return;
      }

      const response = await groupApi.addMember(Number(params.groupId), userId, addRole);
      if (response.success) {
        setAddSuccess('멤버가 추가되었습니다.');
        toast({ title: '멤버가 추가되었습니다', variant: 'success' });
        setAddUserId('');
        setAddRole('부원');
        loadMembers();
        // Close modal after short delay
        setTimeout(() => {
          setShowAddModal(false);
          setAddSuccess('');
        }, 1500);
      } else {
        setAddError(response.error?.message || '멤버 추가에 실패했습니다.');
        toast({ title: response.error?.message || '멤버 추가에 실패했습니다', variant: 'error' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '멤버 추가에 실패했습니다.';
      setAddError(message);
      toast({ title: message, variant: 'error' });
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-4xl text-slate-900 mb-2">
              멤버 관리
            </h1>
            <p className="text-slate-500">총 {members.length}명의 멤버</p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => {
                setShowAddModal(true);
                setAddError('');
                setAddSuccess('');
              }}
            >
              <UserPlus className="w-5 h-5" />
              멤버 추가
            </Button>
          )}
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <motion.div
              key={member.memberId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{member.user.name}</h3>
                    <p className="text-sm text-slate-500">{member.role}</p>
                  </div>
                </div>
                {isAdmin && member.role !== '회장' && (
                  <button
                    onClick={() => handleRemoveMember(member.user.userId, member.user.name)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="퇴출"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-2 text-sm text-slate-500">
                <p>학번: {member.user.studentId || '-'}</p>
                <p>가입일: {new Date(member.joinedAt).toLocaleDateString()}</p>
                {member.isFinanceAdmin && (
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full font-medium">
                    재정 관리자
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {members.length === 0 && !loading && (
          <div className="text-center py-20 text-slate-500 bg-white rounded-lg border border-slate-200">
            멤버가 없습니다.
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowAddModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl z-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">멤버 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {addError}
              </div>
            )}

            {addSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                {addSuccess}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  사용자 ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addUserId}
                  onChange={(e) => setAddUserId(e.target.value)}
                  placeholder="추가할 사용자의 ID를 입력하세요"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">
                  추가할 사용자의 시스템 ID 번호를 입력해주세요.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  역할
                </label>
                <select
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white"
                >
                  <option value="부원">부원</option>
                  <option value="부회장">부회장</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={adding}
                  className="flex-1"
                >
                  {adding ? '추가 중...' : '추가하기'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </main>
  );
}

export default function ClubMembersPage() {
  return (
    <AuthGuard>
      <ClubMembersContent />
    </AuthGuard>
  );
}
