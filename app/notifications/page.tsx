'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { notificationApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';

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
      alert('알림 읽음 처리에 실패했습니다.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-4xl text-gray-900 mb-2">알림</h1>
            <p className="text-gray-500">
              {unreadCount > 0
                ? `읽지 않은 알림 ${unreadCount}개`
                : '모든 알림을 확인했습니다'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
            >
              <CheckCheck className="w-4 h-4" />
              모두 읽음
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-xl text-gray-900 mb-2">
              알림이 없습니다
            </h3>
            <p className="text-gray-500">
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
                    ? 'bg-white border-gray-200 hover:border-gray-300'
                    : 'bg-blue-50 border-blue-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      notification.isRead ? 'bg-gray-100' : 'bg-blue-100'
                    }`}
                  >
                    <Bell
                      className={`w-5 h-5 ${
                        notification.isRead ? 'text-gray-400' : 'text-blue-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-medium text-sm ${
                          notification.isRead ? 'text-gray-700' : 'text-gray-900 font-bold'
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
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
