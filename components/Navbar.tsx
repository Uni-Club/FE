'use client';

import Link from 'next/link';
import { Menu, X, User, LogOut, Bell } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-bold text-lg text-gray-900">UNICLUB</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/clubs" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">
              동아리
            </Link>
            <Link href="/recruitments" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">
              모집공고
            </Link>
            {isAuthenticated && (
              <Link href="/applications" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">
                내 지원현황
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button className="p-2 text-gray-500 hover:text-blue-500 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-500 transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  가입하기
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/clubs"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
              onClick={() => setIsOpen(false)}
            >
              동아리
            </Link>
            <Link
              href="/recruitments"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
              onClick={() => setIsOpen(false)}
            >
              모집공고
            </Link>
            {isAuthenticated && (
              <Link
                href="/applications"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                onClick={() => setIsOpen(false)}
              >
                내 지원현황
              </Link>
            )}

            <div className="pt-2 mt-2 border-t border-gray-100">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
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
                    className="flex-1 px-3 py-2 text-center text-gray-700 border border-gray-200 rounded-lg text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex-1 px-3 py-2 text-center bg-blue-500 text-white rounded-lg text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    가입하기
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
