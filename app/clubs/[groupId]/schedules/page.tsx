'use client';

import { useParams } from 'next/navigation';
import { Calendar, Clock, PlusCircle, Edit2, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ScheduleModal from '@/components/ScheduleModal';
import { scheduleApi } from '@/lib/api';

interface Schedule {
  scheduleId: number;
  title: string;
  description: string;
  date: string;
}

export default function SchedulesPage() {
  const params = useParams();
  const groupId = params.groupId as string;

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await scheduleApi.getByGroup(Number(groupId));
      if (response.success && response.data) {
        setSchedules(response.data);
      } else {
        setError(response.error?.message || '일정을 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('일정을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [groupId]);

  const handleCreate = async (data: any) => {
    try {
      const response = await scheduleApi.create({ ...data, groupId: Number(groupId) });
      if (response.success) {
        await fetchSchedules();
        setIsModalOpen(false);
      } else {
        alert(response.error?.message || '일정 생성에 실패했습니다.');
      }
    } catch (err) {
      alert('일정 생성 중 오류가 발생했습니다.');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingSchedule) return;
    try {
      const response = await scheduleApi.update(editingSchedule.scheduleId, data);
      if (response.success) {
        await fetchSchedules();
        setIsModalOpen(false);
        setEditingSchedule(null);
      } else {
        alert(response.error?.message || '일정 수정에 실패했습니다.');
      }
    } catch (err) {
      alert('일정 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('일정을 삭제하시겠습니까?')) return;
    try {
      const response = await scheduleApi.delete(id);
      if (response.success) {
        await fetchSchedules();
      } else {
        alert(response.error?.message || '삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
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

  if (error) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-neutral-50">
        <div className="max-w-6xl mx-auto text-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      </main>
    );
  }

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
          <button
            onClick={() => {
              setEditingSchedule(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 hover:shadow-primary transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            일정 추가
          </button>
        </div>

        {schedules.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
            <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">
              예정된 일정이 없습니다
            </h3>
            <p className="text-neutral-600 mb-6">
              첫 일정을 만들어보세요
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-all"
            >
              일정 추가
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((schedule, index) => (
              <motion.div
                key={schedule.scheduleId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 hover:shadow-soft-lg transition-all duration-300 border border-neutral-200 hover:border-sky-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-sky-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-sky-50 text-sky-600 text-xs rounded-full font-semibold">
                      {new Date(schedule.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(schedule)}
                        className="p-1 text-neutral-400 hover:text-sky-500"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.scheduleId)}
                        className="p-1 text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
                      {new Date(schedule.date).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <ScheduleModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSchedule(null);
          }}
          onSubmit={editingSchedule ? handleUpdate : handleCreate}
          initialData={editingSchedule}
        />
      </div>
    </main>
  );
}
