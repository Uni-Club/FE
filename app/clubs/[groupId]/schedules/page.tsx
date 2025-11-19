'use client';

import { useParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock schedules - 백엔드 API 구현 시 교체 예정
const mockSchedules = [
  {
    scheduleId: 1,
    title: '정기 모임',
    description: '1월 정기 모임입니다',
    startAt: '2025-01-15T19:00:00',
    endAt: '2025-01-15T21:00:00',
    location: '학생회관 3층',
    attendees: 25,
  },
  {
    scheduleId: 2,
    title: '스터디 세션',
    description: 'React 19 새기능 학습',
    startAt: '2025-01-20T14:00:00',
    endAt: '2025-01-20T16:00:00',
    location: '도서관 세미나실',
    attendees: 15,
  },
  {
    scheduleId: 3,
    title: '워크샵',
    description: '겨울 워크샵',
    startAt: '2025-01-28T10:00:00',
    endAt: '2025-01-28T18:00:00',
    location: '수원',
    attendees: 30,
  },
];

export default function SchedulesPage() {
  const params = useParams();
  const groupId = params.groupId as string;

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-display font-bold text-5xl sm:text-6xl mb-4 text-neutral-900">
              일정
            </h1>
            <p className="text-xl text-neutral-600">
              동아리 일정을 확인하세요
            </p>
          </div>
          <button className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 hover:shadow-primary transition-all flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            일정 추가
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSchedules.map((schedule, index) => (
            <motion.div
              key={schedule.scheduleId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 hover:shadow-soft-lg transition-all duration-300 border border-neutral-200 hover:border-sky-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-sky-500" />
                </div>
                <span className="px-3 py-1 bg-sky-50 text-sky-600 text-xs rounded-full font-semibold">
                  {new Date(schedule.startAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">
                {schedule.title}
              </h3>
              <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                {schedule.description}
              </p>

              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(schedule.startAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} -
                    {new Date(schedule.endAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{schedule.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{schedule.attendees}명 참석 예정</span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-sky-50 text-sky-600 rounded-lg font-medium hover:bg-sky-100 transition-all">
                참석 신청
              </button>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {mockSchedules.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
            <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">
              예정된 일정이 없습니다
            </h3>
            <p className="text-neutral-600 mb-6">
              첫 일정을 만들어보세요
            </p>
            <button className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-all">
              일정 추가
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
