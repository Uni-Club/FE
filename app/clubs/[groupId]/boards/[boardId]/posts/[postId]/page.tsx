'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { User, Calendar, Eye, Edit, Trash } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock post - 백엔드 API 구현 시 교체 예정
const mockPost = {
  postId: 1,
  title: '[필독] 2025년 1월 정기 모임 안내',
  content: `안녕하세요, 동아리 회장입니다.

1월 정기 모임 안내드립니다.

📅 일시: 2025년 1월 15일 (수) 오후 7시
📍 장소: 학생회관 3층 세미나실
📌 준비물: 노트북, 필기도구

이번 모임에서는 다음과 같은 내용을 다룰 예정입니다:

1. 2024년 활동 결산
2. 2025년 활동 계획 공유
3. 신입 부원 소개
4. 단체 사진 촬영

참석이 어려우신 분들은 미리 알려주시기 바랍니다.
많은 참여 부탁드립니다!`,
  author: {
    userId: 1,
    name: '홍길동',
    role: '회장',
  },
  createdAt: '2025-01-10T14:30:00',
  updatedAt: '2025-01-10T14:30:00',
  views: 234,
  isPinned: true,
  isNotice: true,
};

export default function PostDetailPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const boardId = params.boardId as string;
  const postId = params.postId as string;

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      // TODO: 백엔드 API 연동
      alert('게시글이 삭제되었습니다.');
    }
  };

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
          {/* Post Header */}
          <div className="pb-6 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2 mb-4">
              {mockPost.isPinned && (
                <span className="px-3 py-1 bg-sky-100 text-sky-600 text-sm rounded-md font-semibold">
                  고정
                </span>
              )}
              {mockPost.isNotice && (
                <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-md font-semibold">
                  공지
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-neutral-900">
              {mockPost.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{mockPost.author.name}</span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-xs text-neutral-500">{mockPost.author.role}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(mockPost.createdAt).toLocaleString('ko-KR')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{mockPost.views}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="prose max-w-none">
            <div className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
              {mockPost.content}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-neutral-200">
            <Link href={`/clubs/${groupId}/boards/${boardId}/posts/${postId}/edit`}>
              <button className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg font-medium hover:bg-neutral-200 transition-all flex items-center gap-2">
                <Edit className="w-4 h-4" />
                수정
              </button>
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-all flex items-center gap-2"
            >
              <Trash className="w-4 h-4" />
              삭제
            </button>
          </div>
        </motion.div>

        {/* Navigation */}
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
