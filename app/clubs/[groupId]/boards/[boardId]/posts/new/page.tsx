'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { postApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function NewPostPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
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
        toast({ title: '게시글이 작성되었습니다!', variant: 'success' });
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
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href={`/clubs/${groupId}/boards/${boardId}`} className="text-indigo-600 hover:underline mb-2 inline-block">
            ← 목록으로
          </Link>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mb-2 text-slate-900">
            게시글 작성
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-900 mb-2">
                제목 *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="게시글 제목을 입력하세요"
                required
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-900 mb-2">
                내용 *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                required
                rows={15}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-auto py-4 gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? '작성 중...' : '작성 완료'}
            </Button>
            <Link href={`/clubs/${groupId}/boards/${boardId}`} className="flex-1">
              <Button
                type="button"
                variant="secondary"
                className="w-full h-auto py-4 gap-2"
              >
                <X className="w-5 h-5" />
                취소
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
