'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { MessageSquare, User, Calendar, Eye, Pin, PlusCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock posts - 백엔드 API 구현 시 교체 예정
const mockPosts = [
  {
    postId: 1,
    title: '[필독] 2025년 1월 정기 모임 안내',
    content: '1월 정기 모임은 15일 오후 7시에 진행됩니다.',
    author: { name: '홍길동' },
    createdAt: '2025-01-10T14:30:00',
    views: 234,
    isPinned: true,
    isNotice: true,
  },
  {
    postId: 2,
    title: '신입 부원 환영합니다!',
    content: '새로 들어오신 분들 환영해요~',
    author: { name: '김철수' },
    createdAt: '2025-01-12T10:20:00',
    views: 156,
    isPinned: false,
    isNotice: false,
  },
  {
    postId: 3,
    title: '이번 주 스터디 주제 공유',
    content: 'React 19의 새로운 기능들에 대해 알아봅시다',
    author: { name: '이영희' },
    createdAt: '2025-01-14T16:45:00',
    views: 89,
    isPinned: false,
    isNotice: false,
  },
];

export default function BoardDetailPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const boardId = params.boardId as string;
  const [searchQuery, setSearchQuery] = useState('');

  const boardInfo = {
    name: '공지사항',
    description: '동아리 공지사항을 확인하세요',
  };

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/clubs/${groupId}/boards`} className="text-sky-500 hover:underline mb-2 inline-block">
            ← 게시판 목록
          </Link>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-2 text-neutral-900">
            {boardInfo.name}
          </h1>
          <p className="text-lg text-neutral-600">{boardInfo.description}</p>
        </div>

        {/* Search and Actions */}
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

        {/* Posts List */}
        <div className="space-y-3">
          {mockPosts.map((post, index) => (
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

        {/* Empty State */}
        {mockPosts.length === 0 && (
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
