'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  Users, MapPin, Calendar, MessageSquare, ArrowRight,
  Trash2, Settings, FileText, UserPlus, LogOut, Edit,
  Plus, ChevronRight, ClipboardList, Megaphone, Pin,
  User, PenSquare, Bell, HelpCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useClub } from '@/hooks/useClubs';
import { useAuth } from '@/contexts/AuthContext';
import { clubApi, boardApi, postApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useConfirm } from '@/components/ui/confirm-dialog';

interface BoardInfo {
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

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const raw = params?.clubId;
  const clubId = Array.isArray(raw) ? raw[0] : raw; // ✅ 안전 처리
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const confirm = useConfirm();

  const { data: club, isLoading, error, isFetching } = useClub(clubId ?? '');

  const [memberInfo, setMemberInfo] = useState<{
    isMember: boolean;
    isLeader: boolean;
    isAdmin: boolean;
    role: string | null;
  }>({ isMember: false, isLeader: false, isAdmin: false, role: null });

  const [boards, setBoards] = useState<BoardInfo[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<number | null>(null);
  const [boardPosts, setBoardPosts] = useState<Record<number, PostInfo[]>>({});
  const [postsLoading, setPostsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);

  const activeBoard = boards.find((b) => b.boardId === activeBoardId);
  const activePosts = activeBoardId ? (boardPosts[activeBoardId] || []) : [];

  useEffect(() => {
    const loadData = async () => {
      if (!clubId) return;

      // Load boards
      try {
        const boardsResponse = await boardApi.getByClub(Number(clubId));
        if (boardsResponse.success && Array.isArray(boardsResponse.data)) {
          setBoards(boardsResponse.data);
        }
      } catch {}

      // Check membership
      if (user && isAuthenticated) {
        try {
          const response = await clubApi.getMembers(Number(clubId));
          if (response.success && Array.isArray(response.data)) {
            const currentMember = response.data.find(
              (m: any) => m.userId === user.userId
            );
            if (currentMember) {
              const role = currentMember.role;
              const isAdmin = ['회장', '부회장', '관리자', 'LEADER', 'VICE_LEADER', 'MANAGER'].includes(role);
              setMemberInfo({
                isMember: true,
                isLeader: role === '회장' || role === 'LEADER',
                isAdmin,
                role,
              });

              // Fetch pending applications count for admins
              if (isAdmin) {
                try {
                  const appsResponse = await clubApi.getApplications(Number(clubId), { status: 'SUBMITTED' });
                  if (appsResponse.success && appsResponse.data) {
                    const data = appsResponse.data as any;
                    const count = data.totalElements ?? (Array.isArray(data) ? data.length : (data.content?.length ?? 0));
                    setPendingApplicationsCount(count);
                  }
                } catch {}
              }
            }
          }
        } catch {}
      }
    };

    loadData();
  }, [clubId, user, isAuthenticated]);

  // Set default active board when boards load
  useEffect(() => {
    if (boards.length > 0 && activeBoardId === null) {
      setActiveBoardId(boards[0].boardId);
    }
  }, [boards]);

  // Load posts for active board
  useEffect(() => {
    const loadPosts = async () => {
      if (!memberInfo.isMember || !activeBoardId) return;
      if (boardPosts[activeBoardId]) return;

      setPostsLoading(true);
      try {
        const res = await postApi.getByBoard(activeBoardId);
        if (res.success && res.data) {
          const posts = Array.isArray(res.data) ? res.data : (res.data as any).content || [];
          setBoardPosts(prev => ({ ...prev, [activeBoardId]: posts }));
        }
      } catch {}
      setPostsLoading(false);
    };

    loadPosts();
  }, [activeBoardId, memberInfo.isMember]);

  const handleApply = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    router.push(`/clubs/${clubId}/recruitments`);
  };

  const handleDeleteClub = async () => {
    const ok = await confirm({
      title: '동아리 삭제',
      description: '정말 삭제하시겠습니까? 모든 데이터가 영구적으로 삭제됩니다.',
      variant: 'destructive',
      confirmText: '삭제',
    });
    if (!ok) return;

    try {
      setDeleting(true);
      const response = await clubApi.delete(Number(clubId));
      if (response.success) {
        toast({ title: '동아리가 삭제되었습니다', variant: 'success' });
        router.push('/clubs');
      } else {
        toast({ title: response.error?.message || '삭제에 실패했습니다', variant: 'error' });
      }
    } catch {
      toast({ title: '삭제 중 오류가 발생했습니다', variant: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  // clubId 자체가 아직 없으면 로딩 처리 (NotFound 금지)
  if (!clubId) return <Loading />;
  
  // 요청 중이면 로딩
  if (isLoading || isFetching) return <Loading />;

  // 요청 실패(혹은 진짜 없음)만 NotFound
  if (error || !club) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          {error && <ErrorMessage message={(error as Error).message} />}
          <h1 className="font-bold text-4xl mb-4 text-slate-900">동아리를 찾을 수 없습니다</h1>
          <Link href="/clubs" className="text-indigo-600 hover:text-indigo-700 hover:underline">
            동아리 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 rounded-3xl p-8 sm:p-12 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              {club.category && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                  {club.category}
                </span>
              )}
              <span className="text-white/90 flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4" />
                {club.schoolName}
              </span>
            </div>

            <h1 className="font-bold text-4xl sm:text-5xl text-white mb-3">
              {club.clubName}
            </h1>

            <p className="text-lg text-white/90 mb-6 max-w-3xl leading-relaxed">
              {club.description}
            </p>

            <div className="flex flex-wrap gap-6 mb-6 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> 멤버 {club.memberCount || 0}명
              </span>
              <span className="flex items-center gap-1.5">
                <Megaphone className="w-4 h-4" /> 모집 {club.activeRecruitmentCount || 0}건
              </span>
              <span className="flex items-center gap-1.5">
                동아리장: {club.leaderName || '미정'}
              </span>
            </div>

            {!memberInfo.isMember && (club.activeRecruitmentCount ?? 0) > 0 && (
              <button
                onClick={handleApply}
                className="px-8 py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
              >
                가입 신청하기
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {!memberInfo.isMember && (club.activeRecruitmentCount ?? 0) === 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/80 text-sm">
                현재 모집중인 공고가 없습니다
              </div>
            )}

            {memberInfo.isMember && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                <Users className="w-4 h-4" />
                {memberInfo.role} 멤버
              </div>
            )}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Community - Members Only */}
            {memberInfo.isMember && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Tabs */}
                <div className="flex items-center gap-1 bg-white rounded-t-2xl border border-b-0 border-slate-200 p-1.5">
                  {boards.map((board) => (
                    <button
                      key={board.boardId}
                      onClick={() => setActiveBoardId(board.boardId)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeBoardId === board.boardId
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {board.boardType === 'NOTICE' ? (
                        <Megaphone className="w-4 h-4" />
                      ) : board.boardType === 'QNA' ? (
                        <HelpCircle className="w-4 h-4" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                      {board.name}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeBoardId === board.boardId ? 'bg-white/20' : 'bg-slate-100'
                      }`}>
                        {board.postCount}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Posts List */}
                <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 overflow-hidden">
                  {/* Write button */}
                  {activeBoardId && (
                    <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {activeBoard?.name || '게시판'}
                      </span>
                      <Link href={`/clubs/${clubId}/boards/${activeBoardId}/posts/new`}>
                        <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
                          <PenSquare className="w-3.5 h-3.5" />
                          글쓰기
                        </Button>
                      </Link>
                    </div>
                  )}

                  {postsLoading ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      불러오는 중...
                    </div>
                  ) : !activeBoardId ? (
                    <div className="py-12 text-center">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 mb-1">
                        게시판이 아직 없습니다
                      </p>
                      {memberInfo.isAdmin && (
                        <Link
                          href={`/clubs/${clubId}/boards`}
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          게시판 관리에서 생성하기
                        </Link>
                      )}
                    </div>
                  ) : activePosts.length === 0 ? (
                    <div className="py-12 text-center">
                      <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">작성된 글이 없습니다</p>
                      <Link
                        href={`/clubs/${clubId}/boards/${activeBoardId}/posts/new`}
                        className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                      >
                        <PenSquare className="w-3.5 h-3.5" />
                        첫 글을 작성해보세요
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {activePosts.slice(0, 5).map((post) => (
                        <Link
                          key={post.postId}
                          href={`/clubs/${clubId}/boards/${activeBoardId}/posts/${post.postId}`}
                          className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors club"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
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
                              <h4 className="text-sm font-medium text-slate-900 truncate club-hover:text-indigo-600 transition-colors">
                                {post.title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {post.authorName}
                              </span>
                              <span>
                                {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 club-hover:text-indigo-400 flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* View all link */}
                  <div className="px-5 py-3 border-t border-slate-100 text-center">
                    <Link
                      href={`/clubs/${clubId}/boards`}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1"
                    >
                      전체 글 보기
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Pending Applications Alert - Admin/Leader only */}
            {memberInfo.isAdmin && pendingApplicationsCount > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-amber-900 mb-0.5">
                      새로운 가입 신청 {pendingApplicationsCount}건
                    </h3>
                    <p className="text-sm text-amber-700">
                      확인되지 않은 가입 신청이 있습니다. 검토해 주세요.
                    </p>
                  </div>
                  <Link
                    href={`/clubs/${clubId}/applications`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all flex-shrink-0 text-sm"
                  >
                    확인하기
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.section>
            )}

            {/* Active Recruitments - non-members only */}
            {!memberInfo.isMember && (club.activeRecruitmentCount ?? 0) > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg text-slate-900">진행 중인 모집</h2>
                </div>
                <Link
                  href={`/clubs/${clubId}/recruitments`}
                  className="block border border-slate-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">모집 중</span>
                      </div>
                      <h3 className="font-semibold text-slate-900">
                        {club.activeRecruitmentCount}건의 모집공고가 진행중입니다
                      </h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </Link>
              </motion.section>
            )}

            {/* About */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-slate-200"
            >
              <h2 className="font-bold text-lg mb-3 text-slate-900">동아리 소개</h2>
              <p className="text-slate-600 leading-relaxed mb-4">{club.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">동아리장</span>
                  <span className="font-medium text-slate-900">{club.leaderName || '미정'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">소속</span>
                  <span className="font-medium text-slate-900">{club.schoolName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">멤버 수</span>
                  <span className="font-medium text-slate-900">{club.memberCount}명</span>
                </div>
                {club.createdAt && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">개설일</span>
                    <span className="font-medium text-slate-900">
                      {new Date(club.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Admin Quick Actions - Leader/Admin only */}
            {memberInfo.isAdmin && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-5 border border-indigo-200"
              >
                <h3 className="font-bold text-sm text-indigo-600 mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  관리
                </h3>
                <div className="space-y-1">
                  <Link
                    href={`/clubs/${clubId}/recruitments/new`}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    모집공고 작성
                  </Link>
                  <Link
                    href={`/clubs/${clubId}/members`}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    멤버 관리
                  </Link>
                  <Link
                    href={`/clubs/${clubId}/applications`}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                  >
                    <ClipboardList className="w-4 h-4" />
                    가입 신청 관리
                  </Link>
                  <Link
                    href={`/clubs/${clubId}/leave-requests`}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    탈퇴 신청 관리
                  </Link>
                  <Link
                    href={`/clubs/${clubId}/boards`}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    게시판 관리
                  </Link>
                  <Link
                    href={`/clubs/${clubId}/edit`}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    동아리 정보 수정
                  </Link>
                </div>
              </motion.section>
            )}

            {/* Member Quick Links - non-admin members */}
            {memberInfo.isMember && !memberInfo.isAdmin && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-5 border border-slate-200"
              >
                <h3 className="font-bold text-sm text-slate-900 mb-3">바로가기</h3>
                <div className="space-y-1">
                  <Link
                    href={`/clubs/${clubId}/schedules`}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    일정
                  </Link>
                  <Link
                    href={`/clubs/${clubId}/boards`}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    게시판
                  </Link>
                </div>
              </motion.section>
            )}

            {/* Schedule shortcut for admin */}
            {memberInfo.isAdmin && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl p-5 border border-slate-200"
              >
                <Link
                  href={`/clubs/${clubId}/schedules`}
                  className="flex items-center gap-3 text-sm text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-semibold">일정 관리</div>
                    <div className="text-xs text-slate-500">동아리 일정 확인 및 관리</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                </Link>
              </motion.section>
            )}

            {/* Join CTA for non-members - only when recruiting */}
            {!memberInfo.isMember && (club.activeRecruitmentCount ?? 0) > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-indigo-600 to-violet-500 rounded-2xl p-6 text-white"
              >
                <h3 className="font-bold text-lg mb-2">이 동아리에 가입하세요</h3>
                <p className="text-white/80 text-sm mb-4">
                  현재 {club.activeRecruitmentCount}건의 모집이 진행 중입니다.
                </p>
                <button
                  onClick={handleApply}
                  className="w-full px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  모집공고 보기
                </button>
              </motion.section>
            )}

            {/* No recruitment notice for non-members */}
            {!memberInfo.isMember && (club.activeRecruitmentCount ?? 0) === 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 text-center"
              >
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h3 className="font-semibold text-slate-900 mb-1">모집 공고 없음</h3>
                <p className="text-sm text-slate-500">
                  현재 진행중인 모집공고가 없습니다.
                </p>
              </motion.section>
            )}

            {/* Delete Club - Leader only */}
            {memberInfo.isLeader && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-5 border border-red-200"
              >
                <h3 className="font-bold text-sm text-slate-900 mb-2">위험 구역</h3>
                <p className="text-xs text-slate-500 mb-3">
                  동아리 삭제 시 모든 데이터가 영구적으로 삭제됩니다.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteClub}
                  disabled={deleting}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? '삭제 중...' : '동아리 삭제'}
                </Button>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
