'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MessageSquare, User, Calendar, Eye, Pin, PlusCircle, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { boardApi, postApi } from '@/lib/api';

interface Post {
  postId: number;
  title: string;
  content: string;
  author: { name: string };
  createdAt: string;
  views: number;
  isPinned: boolean;
  isNotice: boolean;
}

interface Board {
  boardId: number;
  name: string;
  description: string;
}

export default function BoardDetailPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const boardId = params.boardId as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [boardRes, postsRes] = await Promise.all([
          boardApi.getById(Number(groupId), Number(boardId)),
          postApi.getByBoard(Number(boardId), { keyword: searchQuery }),
        ]);

        if (boardRes.success && boardRes.data) {
          setBoard(boardRes.data as Board);
        }

        if (postsRes.success && postsRes.data) {
          setPosts(postsRes.data.content || []);
        }
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId, boardId, searchQuery]);

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
        <div className="mb-8">
          <Link href={`/clubs/${groupId}/boards`} className="text-sky-500 hover:underline mb-2 inline-block">
            ← 게시판 목록
          </Link>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-2 text-neutral-900">
            {board?.name || '게시판'}
          </h1>
          <p className="text-lg text-neutral-600">{board?.description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="게시글 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-neutral-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>
          <Link href={`/clubs/${groupId}/boards/${boardId}/posts/new`}>
            <button className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 hover:shadow-primary transition-all flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              글쓰기
            </button>
          </Link>
        </div>

        <div className="space-y-3">
          {posts.map((post, index) => (
            <motion.div
              key={post.postId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/clubs/${groupId}/boards/${boardId}/posts/${post.postId}`}>
                <div className={`group bg-white rounded-xl p-5 hover:shadow-soft-lg transition-all duration-300 border ${
                  post.isPinned ? 'border-sky-200 bg-sky-50/50' : 'border-neutral-200'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.isPinned && (
                          <span className="px-2 py-1 bg-sky-100 text-sky-600 text-xs rounded-md font-semibold flex items-center gap-1">
                            <Pin className="w-3 h-3" />
                            고정
                          </span>
                        )}
                        {post.isNotice && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-md font-semibold">
                            공지
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-neutral-900 group-hover:text-sky-500 transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-neutral-600 line-clamp-1 mb-3">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
            <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">
              아직 작성된 글이 없습니다
            </h3>
            <p className="text-neutral-600 mb-6">
              첫 게시글을 작성해보세요
            </p>
            <Link href={`/clubs/${groupId}/boards/${boardId}/posts/new`}>
              <button className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-all">
                글쓰기
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
