'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import { postApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
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
        const response = await postApi.getById(Number(boardId), Number(postId));
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
      const response = await postApi.update(Number(boardId), Number(postId), { title, content });
      if (response.success) {
        toast({ title: '게시글이 수정되었습니다!', variant: 'success' });
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
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href={`/clubs/${groupId}/boards/${boardId}/posts/${postId}`} className="text-indigo-600 hover:underline mb-2 inline-block">
            ← 돌아가기
          </Link>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mb-2 text-slate-900">
            게시글 수정
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
              disabled={saving}
              className="flex-1 h-auto py-4 gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? '저장 중...' : '수정 완료'}
            </Button>
            <Link href={`/clubs/${groupId}/boards/${boardId}/posts/${postId}`} className="flex-1">
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
