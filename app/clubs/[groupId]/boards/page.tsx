'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MessageSquare, Pin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { boardApi } from '@/lib/api';

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
  const groupId = params.groupId as string;

  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto text-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="font-display font-bold text-5xl sm:text-6xl mb-4 text-neutral-900">
            게시판
          </h1>
          <p className="text-xl text-neutral-600">
            동아리 멤버들과 소통하세요
          </p>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
            <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">
              아직 게시판이 없습니다
            </h3>
            <p className="text-neutral-600">
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
              >
                <Link href={`/clubs/${groupId}/boards/${board.boardId}`}>
                  <div className="group bg-white rounded-2xl p-6 hover:shadow-soft-lg transition-all duration-300 border border-neutral-200 hover:border-sky-200 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{boardIcons[board.boardType] || boardIcons.DEFAULT}</div>
                      <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-sky-400 group-hover:to-sky-600 group-hover:scale-110 transition-all">
                        <MessageSquare className="w-5 h-5 text-sky-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-2xl text-neutral-900 mb-2 group-hover:text-sky-500 transition-colors">
                      {board.name}
                    </h3>
                    <p className="text-neutral-600 mb-4 text-sm">
                      {board.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-neutral-500 pt-4 border-t border-neutral-200">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{board.postCount}개의 글</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl p-8 text-center border border-sky-100">
          <Pin className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">
            멤버 전용 공간입니다
          </h3>
          <p className="text-neutral-600">
            동아리 멤버만 게시판을 이용할 수 있습니다
          </p>
        </div>
      </div>
    </main>
  );
}
