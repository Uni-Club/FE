'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { postApi } from '@/lib/api';

export default function NewPostPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const boardId = params.boardId as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await postApi.create(Number(boardId), { title, content });
      if (response.success) {
        alert('게시글이 작성되었습니다!');
        router.push(`/clubs/${groupId}/boards/${boardId}`);
      } else {
        setError(response.error?.message || '게시글 작성에 실패했습니다.');
      }
    } catch (err) {
      setError('게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={`/clubs/${groupId}/boards/${boardId}`} className="text-sky-500 hover:underline mb-2 inline-block">
            ← 목록으로
          </Link>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-2 text-neutral-900">
            게시글 작성
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
              disabled={loading}
              className="flex-1 px-6 py-4 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? '작성 중...' : '작성 완료'}
            </button>
            <Link href={`/clubs/${groupId}/boards/${boardId}`} className="flex-1">
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
