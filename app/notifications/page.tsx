'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { notificationApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

interface Notification {
  notificationId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedUrl?: string;
  createdAt: string;
}

function NotificationsContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.getAll();
      if (response.success && response.data) {
        const data = Array.isArray(response.data) ? response.data : [];
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      setError('알림을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await notificationApi.markAsRead(notification.notificationId);
        setNotifications((prev) =>
          prev.map((n) =>
            n.notificationId === notification.notificationId ? { ...n, isRead: true } : n
          )
        );
      }
      if (notification.relatedUrl) {
        router.push(notification.relatedUrl);
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      toast({ title: '알림 읽음 처리에 실패했습니다.', variant: 'error' });
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-4xl text-slate-900 mb-2">알림</h1>
            <p className="text-slate-500">
              {unreadCount > 0
                ? `읽지 않은 알림 ${unreadCount}개`
                : '모든 알림을 확인했습니다'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="w-4 h-4" />
              모두 읽음
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-xl text-slate-900 mb-2">
              알림이 없습니다
            </h3>
            <p className="text-slate-500">
              새로운 알림이 오면 여기에 표시됩니다
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.notificationId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                onClick={() => handleMarkAsRead(notification)}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  notification.isRead
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-indigo-50 border-indigo-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      notification.isRead ? 'bg-slate-100' : 'bg-indigo-100'
                    }`}
                  >
                    <Bell
                      className={`w-5 h-5 ${
                        notification.isRead ? 'text-slate-400' : 'text-indigo-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-medium text-sm ${
                          notification.isRead ? 'text-slate-700' : 'text-slate-900 font-bold'
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <NotificationsContent />
    </AuthGuard>
  );
}
