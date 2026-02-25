'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  MessageSquare, Pin, Loader2, PlusCircle, Trash2, X,
  Megaphone, HelpCircle, ChevronRight, PenSquare, User, ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { boardApi, postApi, clubApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useConfirm } from '@/components/ui/confirm-dialog';

interface Board {
  boardId: number;
  name: string;
  boardType: string;
  postCount: number;
}

interface PostInfo {
  postId: number;
  boardId: number;
  title: string;
  authorName: string;
  content: string;
  isNotice: boolean;
  isPinned: boolean;
  createdAt: string;
}

const boardTypeIcon: Record<string, React.ReactNode> = {
  NOTICE: <Megaphone className="w-4 h-4" />,
  FREE: <MessageSquare className="w-4 h-4" />,
  QNA: <HelpCircle className="w-4 h-4" />,
};

export default function BoardsPage() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const confirm = useConfirm();
  const clubId = params.clubId as string;

  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clubName, setClubName] = useState('');

  // Create board modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    boardType: 'FREE',
    visibility: 'CLUB_ONLY' as 'PUBLIC' | 'CLUB_ONLY',
  });
  const [createError, setCreateError] = useState<string | null>(null);

  // Load boards & check admin
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // Fetch boards and club info in parallel
        const [boardsRes, clubRes] = await Promise.all([
          boardApi.getByClub(Number(clubId)),
          clubApi.getById(Number(clubId)),
        ]);

        if (boardsRes.success && boardsRes.data) {
          const boardList = boardsRes.data as Board[];
          setBoards(boardList);
          if (boardList.length > 0) {
            setActiveBoard(boardList[0]);
          }
        } else {
          setError(boardsRes.error?.message || '게시판을 불러올 수 없습니다.');
        }

        if (clubRes.success && clubRes.data) {
          setClubName((clubRes.data as any).clubName || '');
        }

        // Check admin
        if (user) {
          const membersRes = await clubApi.getMembers(Number(clubId));
          if (membersRes.success && Array.isArray(membersRes.data)) {
            const me = membersRes.data.find((m: any) => m.userId === user.userId);
            if (me && ['회장', '부회장', '관리자', 'LEADER', 'VICE_LEADER', 'MANAGER'].includes(me.role)) {
              setIsAdmin(true);
            }
          }
        }
      } catch {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [clubId, user]);

  // Load posts when active board changes
  useEffect(() => {
    if (!activeBoard) return;

    const loadPosts = async () => {
      setPostsLoading(true);
      try {
        const res = await postApi.getByBoard(activeBoard.boardId);
        if (res.success && res.data) {
          const data = res.data as any;
          setPosts(Array.isArray(data) ? data : data.content || []);
        }
      } catch {}
      setPostsLoading(false);
    };

    loadPosts();
  }, [activeBoard]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;

    try {
      setCreating(true);
      setCreateError(null);
      const response = await boardApi.create(Number(clubId), {
        name: createForm.name,
        boardType: createForm.boardType,
        visibility: createForm.visibility,
      });
      if (response.success) {
        const refreshRes = await boardApi.getByClub(Number(clubId));
        if (refreshRes.success && refreshRes.data) {
          const boardList = refreshRes.data as Board[];
          setBoards(boardList);
          // Switch to newly created board
          const newBoard = boardList[boardList.length - 1];
          if (newBoard) setActiveBoard(newBoard);
        }
        setShowCreateModal(false);
        setCreateForm({ name: '', boardType: 'FREE', visibility: 'CLUB_ONLY' });
        toast({ title: '게시판이 생성되었습니다.', variant: 'success' });
      } else {
        setCreateError(response.error?.message || '게시판 생성에 실패했습니다.');
      }
    } catch {
      setCreateError('게시판 생성 중 오류가 발생했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBoard = async (board: Board) => {
    const ok = await confirm({
      title: `"${board.name}" 게시판을 삭제하시겠습니까?`,
      description: '게시판의 모든 게시글이 삭제됩니다.',
      variant: 'destructive',
      confirmText: '삭제',
    });
    if (!ok) return;

    try {
      const response = await boardApi.delete(Number(clubId), board.boardId);
      if (response.success) {
        const remaining = boards.filter((b) => b.boardId !== board.boardId);
        setBoards(remaining);
        if (activeBoard?.boardId === board.boardId) {
          setActiveBoard(remaining[0] || null);
        }
        toast({ title: '게시판이 삭제되었습니다.', variant: 'success' });
      } else {
        toast({ title: response.error?.message || '삭제에 실패했습니다.', variant: 'error' });
      }
    } catch {
      toast({ title: '삭제 중 오류가 발생했습니다.', variant: 'error' });
    }
  };

  if (loading) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/clubs/${clubId}`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {clubName || '동아리'} 홈
          </Link>
          <h1 className="font-bold text-2xl text-slate-900">커뮤니티</h1>
        </div>

        {/* Board Tabs */}
        <div className="flex items-center gap-1 bg-white rounded-2xl border border-slate-200 p-1.5 mb-6 overflow-x-auto">
          {boards.map((board) => (
            <button
              key={board.boardId}
              onClick={() => setActiveBoard(board)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeBoard?.boardId === board.boardId
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {boardTypeIcon[board.boardType] || <MessageSquare className="w-4 h-4" />}
              {board.name}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeBoard?.boardId === board.boardId ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {board.postCount}
              </span>
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              추가
            </button>
          )}
        </div>

        {/* Active Board Content */}
        {activeBoard ? (
          <motion.div
            key={activeBoard.boardId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            {/* Board header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-slate-900">{activeBoard.name}</h2>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteBoard(activeBoard)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                    title="게시판 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Link href={`/clubs/${clubId}/boards/${activeBoard.boardId}/posts/new`}>
                <Button size="sm" className="gap-1.5 text-xs">
                  <PenSquare className="w-3.5 h-3.5" />
                  글쓰기
                </Button>
              </Link>
            </div>

            {/* Posts */}
            {postsLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
              </div>
            ) : posts.length === 0 ? (
              <div className="py-16 text-center">
                <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 mb-3">아직 작성된 글이 없습니다</p>
                <Link href={`/clubs/${clubId}/boards/${activeBoard.boardId}/posts/new`}>
                  <Button size="sm" variant="secondary" className="gap-1.5">
                    <PenSquare className="w-3.5 h-3.5" />
                    첫 글을 작성해보세요
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <Link
                    key={post.postId}
                    href={`/clubs/${clubId}/boards/${activeBoard.boardId}/posts/${post.postId}`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {post.isPinned && (
                          <span className="flex items-center gap-0.5 text-indigo-600 text-xs font-medium">
                            <Pin className="w-3 h-3" /> 고정
                          </span>
                        )}
                        {post.isNotice && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded font-medium">
                            공지
                          </span>
                        )}
                        <h3 className="text-sm font-medium text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.authorName}
                        </span>
                        <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-slate-900 mb-1">게시판이 없습니다</h3>
            <p className="text-sm text-slate-500">
              {isAdmin ? '게시판을 추가해 주세요.' : '관리자가 게시판을 생성하면 여기에 표시됩니다.'}
            </p>
          </div>
        )}
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
                      visibility: e.target.value as 'PUBLIC' | 'CLUB_ONLY',
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 text-sm bg-white"
                >
                  <option value="CLUB_ONLY">멤버만</option>
                  <option value="PUBLIC">전체 공개</option>
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
                <Button type="submit" disabled={creating} className="flex-1">
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
