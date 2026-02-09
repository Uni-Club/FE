'use client';

import { useParams } from 'next/navigation';
import { Calendar, Clock, PlusCircle, Edit2, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ScheduleModal from '@/components/ScheduleModal';
import { scheduleApi } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useConfirm } from '@/components/ui/confirm-dialog';

interface Schedule {
  scheduleId: number;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
}

function SchedulesContent() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { toast } = useToast();
  const confirm = useConfirm();

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
      const response = await scheduleApi.create(Number(groupId), data);
      if (response.success) {
        toast({ title: '일정이 생성되었습니다', variant: 'success' });
        await fetchSchedules();
        setIsModalOpen(false);
      } else {
        toast({ title: response.error?.message || '일정 생성에 실패했습니다', variant: 'error' });
      }
    } catch (err) {
      toast({ title: '일정 생성 중 오류가 발생했습니다', variant: 'error' });
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingSchedule) return;
    try {
      const response = await scheduleApi.update(Number(groupId), editingSchedule.scheduleId, data);
      if (response.success) {
        toast({ title: '일정이 수정되었습니다', variant: 'success' });
        await fetchSchedules();
        setIsModalOpen(false);
        setEditingSchedule(null);
      } else {
        toast({ title: response.error?.message || '일정 수정에 실패했습니다', variant: 'error' });
      }
    } catch (err) {
      toast({ title: '일정 수정 중 오류가 발생했습니다', variant: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm({
      title: '일정 삭제',
      description: '일정을 삭제하시겠습니까?',
      variant: 'destructive',
      confirmText: '삭제',
    });
    if (!ok) return;

    try {
      const response = await scheduleApi.delete(Number(groupId), id);
      if (response.success) {
        toast({ title: '일정이 삭제되었습니다', variant: 'success' });
        await fetchSchedules();
      } else {
        toast({ title: response.error?.message || '삭제에 실패했습니다', variant: 'error' });
      }
    } catch (err) {
      toast({ title: '삭제 중 오류가 발생했습니다', variant: 'error' });
    }
  };

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto text-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-slate-900">
              일정
            </h1>
            <p className="text-xl text-slate-600">
              동아리 일정을 확인하세요
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingSchedule(null);
              setIsModalOpen(true);
            }}
          >
            <PlusCircle className="w-5 h-5" />
            일정 추가
          </Button>
        </div>

        {schedules.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
              예정된 일정이 없습니다
            </h3>
            <p className="text-slate-600 mb-6">
              첫 일정을 만들어보세요
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              일정 추가
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((schedule, index) => (
              <motion.div
                key={schedule.scheduleId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 hover:shadow-soft-lg transition-all duration-300 border border-slate-200 hover:border-indigo-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-semibold">
                      {new Date(schedule.startAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(schedule)}
                        className="p-1 text-slate-400 hover:text-indigo-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.scheduleId)}
                        className="p-1 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                  {schedule.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {schedule.description}
                </p>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(schedule.startAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {' ~ '}
                      {new Date(schedule.endAt).toLocaleString('ko-KR', {
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

export default function SchedulesPage() {
  return (
    <AuthGuard>
      <SchedulesContent />
    </AuthGuard>
  );
}
