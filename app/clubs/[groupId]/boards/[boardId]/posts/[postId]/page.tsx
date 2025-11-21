'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User, Calendar, Eye, Edit, Trash, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { postApi } from '@/lib/api';

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

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const boardId = params.boardId as string;
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postApi.getById(Number(groupId), Number(boardId), Number(postId));
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
  }, [groupId, boardId, postId]);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      setDeleting(true);
      const response = await postApi.delete(Number(groupId), Number(boardId), Number(postId));
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
        </motion.div>

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
