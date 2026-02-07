'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User, Calendar, Eye, Edit, Trash, Loader2, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { postApi, commentApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Post {
  postId: number;
  title: string;
  content: string;
  author: {
    userId: number;
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  views: number;
  isPinned: boolean;
  isNotice: boolean;
}

interface Comment {
  commentId: number;
  content: string;
  author: {
    userId: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const groupId = params.groupId as string;
  const boardId = params.boardId as string;
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Comment editing state
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [savingComment, setSavingComment] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postApi.getById(Number(boardId), Number(postId));
        if (response.success && response.data) {
          setPost(response.data as Post);
        } else {
          setError(response.error?.message || '게시글을 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await commentApi.getByPost(Number(boardId), Number(postId));
        if (response.success && response.data) {
          setComments(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const refreshComments = async () => {
    try {
      const response = await commentApi.getByPost(Number(boardId), Number(postId));
      if (response.success && response.data) {
        setComments(response.data);
      }
    } catch (err) {
      console.error('Failed to refresh comments:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await commentApi.create(Number(boardId), Number(postId), { content: commentContent });
      if (response.success) {
        setCommentContent('');
        await refreshComments();
      } else {
        alert(response.error?.message || '댓글 작성에 실패했습니다.');
      }
    } catch (err) {
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const response = await commentApi.delete(Number(boardId), Number(postId), commentId);
      if (response.success) {
        await refreshComments();
      } else {
        alert(response.error?.message || '댓글 삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCommentEditStart = (comment: Comment) => {
    setEditingCommentId(comment.commentId);
    setEditingCommentContent(comment.content);
  };

  const handleCommentEditCancel = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleCommentEditSave = async (commentId: number) => {
    if (!editingCommentContent.trim()) return;

    try {
      setSavingComment(true);
      const response = await commentApi.update(Number(boardId), Number(postId), commentId, {
        content: editingCommentContent,
      });
      if (response.success) {
        setEditingCommentId(null);
        setEditingCommentContent('');
        await refreshComments();
      } else {
        alert(response.error?.message || '댓글 수정에 실패했습니다.');
      }
    } catch (err) {
      alert('댓글 수정 중 오류가 발생했습니다.');
    } finally {
      setSavingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      setDeleting(true);
      const response = await postApi.delete(Number(boardId), Number(postId));
      if (response.success) {
        alert('게시글이 삭제되었습니다.');
        router.push(`/clubs/${groupId}/boards/${boardId}`);
      } else {
        alert(response.error?.message || '삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-red-500">{error || '게시글을 찾을 수 없습니다.'}</p>
          <Link href={`/clubs/${groupId}/boards/${boardId}`} className="text-sky-500 hover:underline mt-4 inline-block">
            ← 목록으로
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href={`/clubs/${groupId}/boards/${boardId}`} className="text-sky-500 hover:underline">
            ← 목록으로
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 border border-neutral-200 mb-6"
        >
          <div className="pb-6 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2 mb-4">
              {post.isPinned && (
                <span className="px-3 py-1 bg-sky-100 text-sky-600 text-sm rounded-md font-semibold">
                  고정
                </span>
              )}
              {post.isNotice && (
                <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-md font-semibold">
                  공지
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-neutral-900">
              {post.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{post.author.name}</span>
                  {post.author.role && (
                    <>
                      <span className="text-neutral-400">·</span>
                      <span className="text-xs text-neutral-500">{post.author.role}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.createdAt).toLocaleString('ko-KR')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {user && post.author && user.userId === post.author.userId && (
            <div className="flex gap-3 mt-8 pt-6 border-t border-neutral-200">
              <Link href={`/clubs/${groupId}/boards/${boardId}/posts/${postId}/edit`}>
                <button className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg font-medium hover:bg-neutral-200 transition-all flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  수정
                </button>
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Trash className="w-4 h-4" />
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          )}
        </motion.div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-2xl p-8 border border-neutral-200 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-neutral-700" />
            <h2 className="font-bold text-xl text-neutral-900">
              댓글 <span className="text-sky-500">{comments.length}</span>
            </h2>
          </div>

          {/* 댓글 작성 폼 */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요"
              rows={3}
              className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={submittingComment || !commentContent.trim()}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submittingComment ? '작성 중...' : '댓글 작성'}
              </button>
            </div>
          </form>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-neutral-500 py-8">첫 댓글을 작성해보세요!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.commentId} className="p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-neutral-500" />
                      <span className="font-medium text-neutral-900">{comment.author.name}</span>
                      <span className="text-sm text-neutral-500">
                        {new Date(comment.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    {user && comment.author && user.userId === comment.author.userId && editingCommentId !== comment.commentId && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCommentEditStart(comment)}
                          className="text-sm text-neutral-500 hover:text-sky-600"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleCommentDelete(comment.commentId)}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.commentId ? (
                    <div className="mt-2">
                      <textarea
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all resize-none"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={handleCommentEditCancel}
                          className="px-4 py-1.5 text-sm bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleCommentEditSave(comment.commentId)}
                          disabled={savingComment || !editingCommentContent.trim()}
                          className="px-4 py-1.5 text-sm bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {savingComment ? '저장 중...' : '저장'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-neutral-700 whitespace-pre-wrap">{comment.content}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-neutral-200">
          <div className="flex items-center justify-between">
            <Link href={`/clubs/${groupId}/boards/${boardId}`}>
              <button className="px-4 py-2 text-neutral-700 hover:text-sky-500 font-medium transition-colors">
                ← 이전 글
              </button>
            </Link>
            <Link href={`/clubs/${groupId}/boards/${boardId}`}>
              <button className="px-4 py-2 text-neutral-700 hover:text-sky-500 font-medium transition-colors">
                다음 글 →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
