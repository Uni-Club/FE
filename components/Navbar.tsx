'use client';

import Link from 'next/link';
import { Menu, X, User, LogOut, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationApi } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!isAuthenticated) {
        setUnreadCount(0);
        return;
      }
      try {
        const response = await notificationApi.getUnreadCount();
        if (response.success && response.data) {
          const data = response.data as any;
          setUnreadCount(typeof data.count === 'number' ? data.count : (typeof data === 'number' ? data : 0));
        }
      } catch (err) {
        // Silent fail for notification count
      }
    };

    fetchUnreadCount();

    // Refresh unread count every 60 seconds
    if (isAuthenticated) {
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon.png" alt="UNICLUB" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-lg text-slate-900">UNICLUB</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/clubs" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
              동아리
            </Link>
            <Link href="/recruitments" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
              모집공고
            </Link>
            {isAuthenticated && (
              <Link href="/applications" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                내 지원현황
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/notifications" className="p-2 text-slate-500 hover:text-indigo-600 relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  로그인
                </Link>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">회원가입</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/clubs"
              className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-sm"
              onClick={() => setIsOpen(false)}
            >
              동아리
            </Link>
            <Link
              href="/recruitments"
              className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-sm"
              onClick={() => setIsOpen(false)}
            >
              모집공고
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/applications"
                  className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  내 지원현황
                </Link>
                <Link
                  href="/notifications"
                  className="flex items-center justify-between px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    알림
                  </span>
                  {unreadCount > 0 && (
                    <span className="min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            <div className="pt-2 mt-2 border-t border-slate-100">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>내 프로필</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>로그아웃</span>
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/auth/login"
                    className="flex-1 px-3 py-2 text-center text-slate-700 border border-slate-200 rounded-lg text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex-1 px-3 py-2 text-center bg-indigo-600 text-white rounded-lg text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
