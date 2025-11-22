'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import { postApi } from '@/lib/api';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const boardId = params.boardId as string;
  const postId = params.postId as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postApi.getById(Number(postId));
        if (response.success && response.data) {
          const post = response.data as any;
          setTitle(post.title);
          setContent(post.content);
        } else {
          setError('게시글을 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await postApi.update(Number(postId), { title, content });
      if (response.success) {
        alert('게시글이 수정되었습니다!');
        router.push(`/clubs/${groupId}/boards/${boardId}/posts/${postId}`);
      } else {
        setError(response.error?.message || '게시글 수정에 실패했습니다.');
      }
    } catch (err) {
      setError('게시글 수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
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

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={`/clubs/${groupId}/boards/${boardId}/posts/${postId}`} className="text-sky-500 hover:underline mb-2 inline-block">
            ← 돌아가기
          </Link>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-2 text-neutral-900">
            게시글 수정
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-neutral-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-900 mb-2">
                제목 *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="게시글 제목을 입력하세요"
                required
                className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-neutral-900 mb-2">
                내용 *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                required
                rows={15}
                className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-4 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 hover:shadow-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? '저장 중...' : '수정 완료'}
            </button>
            <Link href={`/clubs/${groupId}/boards/${boardId}/posts/${postId}`} className="flex-1">
              <button
                type="button"
                className="w-full px-6 py-4 bg-neutral-200 text-neutral-900 rounded-xl font-bold hover:bg-neutral-300 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                취소
              </button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
