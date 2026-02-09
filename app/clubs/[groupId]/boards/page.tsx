'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MessageSquare, Pin, Loader2, PlusCircle, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { boardApi, groupApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useConfirm } from '@/components/ui/confirm-dialog';

interface Board {
  boardId: number;
  name: string;
  description: string;
  postCount: number;
  boardType: string;
}

const boardIcons: Record<string, string> = {
  NOTICE: '📢',
  FREE: '💬',
  QNA: '❓',
  GALLERY: '🖼️',
  DEFAULT: '📋',
};

export default function BoardsPage() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const confirm = useConfirm();
  const groupId = params.groupId as string;

  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Create board modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    boardType: 'FREE',
    visibility: 'GROUP_ONLY' as 'PUBLIC' | 'GROUP_ONLY',
  });
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true);
        const response = await boardApi.getByGroup(Number(groupId));
        if (response.success && response.data) {
          setBoards(response.data);
        } else {
          setError(response.error?.message || '게시판을 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('게시판을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [groupId]);

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      try {
        const response = await groupApi.getMembers(Number(groupId));
        if (response.success && Array.isArray(response.data)) {
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
      } catch (err) {
        // Silent fail for admin check
      }
    };

    checkAdmin();
  }, [groupId, user]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;

    try {
      setCreating(true);
      setCreateError(null);
      const response = await boardApi.create(Number(groupId), {
        name: createForm.name,
        boardType: createForm.boardType,
        visibility: createForm.visibility,
      });
      if (response.success) {
        // Refresh boards list
        const refreshResponse = await boardApi.getByGroup(Number(groupId));
        if (refreshResponse.success && refreshResponse.data) {
          setBoards(refreshResponse.data);
        }
        setShowCreateModal(false);
        setCreateForm({ name: '', boardType: 'FREE', visibility: 'GROUP_ONLY' });
      } else {
        setCreateError(response.error?.message || '게시판 생성에 실패했습니다.');
      }
    } catch (err) {
      setCreateError('게시판 생성 중 오류가 발생했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBoard = async (boardId: number, boardName: string) => {
    const ok = await confirm({
      title: `"${boardName}" 게시판을 삭제하시겠습니까?`,
      description: '게시판의 모든 게시글이 삭제됩니다.',
      variant: 'destructive',
      confirmText: '삭제',
    });
    if (!ok) return;

    try {
      const response = await boardApi.delete(Number(groupId), boardId);
      if (response.success) {
        setBoards(boards.filter((b) => b.boardId !== boardId));
        toast({ title: '게시판이 삭제되었습니다.', variant: 'success' });
      } else {
        toast({ title: response.error?.message || '게시판 삭제에 실패했습니다.', variant: 'error' });
      }
    } catch (err) {
      toast({ title: '게시판 삭제 중 오류가 발생했습니다.', variant: 'error' });
    }
  };

  if (loading) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto text-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-slate-900">
              게시판
            </h1>
            <p className="text-xl text-slate-600">
              동아리 멤버들과 소통하세요
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowCreateModal(true)} className="gap-2">
              <PlusCircle className="w-5 h-5" />
              게시판 만들기
            </Button>
          )}
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
              아직 게시판이 없습니다
            </h3>
            <p className="text-slate-600">
              관리자가 게시판을 생성하면 여기에 표시됩니다
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board, index) => (
              <motion.div
                key={board.boardId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative"
              >
                <Link href={`/clubs/${groupId}/boards/${board.boardId}`}>
                  <div className="group bg-white rounded-2xl p-6 hover:shadow-soft-lg transition-all duration-300 border border-slate-200 hover:border-indigo-200 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{boardIcons[board.boardType] || boardIcons.DEFAULT}</div>
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-violet-500 group-hover:scale-110 transition-all">
                        <MessageSquare className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-2xl text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {board.name}
                    </h3>
                    <p className="text-slate-600 mb-4 text-sm">
                      {board.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{board.postCount}개의 글</span>
                      </div>
                    </div>
                  </div>
                </Link>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteBoard(board.boardId, board.name);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 hover:opacity-100 focus:opacity-100 z-10 border border-slate-200"
                    title="게시판 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-8 text-center border border-indigo-100">
          <Pin className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
            멤버 전용 공간입니다
          </h3>
          <p className="text-slate-600">
            동아리 멤버만 게시판을 이용할 수 있습니다
          </p>
        </div>
      </div>

      {/* Create Board Modal */}
      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl z-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">게시판 만들기</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  게시판 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="게시판 이름을 입력하세요"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  게시판 유형
                </label>
                <select
                  value={createForm.boardType}
                  onChange={(e) => setCreateForm({ ...createForm, boardType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 text-sm bg-white"
                >
                  <option value="NOTICE">공지사항</option>
                  <option value="FREE">자유게시판</option>
                  <option value="QNA">질문/답변</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  공개 범위
                </label>
                <select
                  value={createForm.visibility}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      visibility: e.target.value as 'PUBLIC' | 'GROUP_ONLY',
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 text-sm bg-white"
                >
                  <option value="GROUP_ONLY">멤버만 (GROUP_ONLY)</option>
                  <option value="PUBLIC">전체 공개 (PUBLIC)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="flex-1"
                >
                  {creating ? '생성 중...' : '만들기'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </main>
  );
}
