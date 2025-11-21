'use client';

import Link from 'next/link';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-primary">
              <span className="text-white font-display font-bold text-xl">U</span>
            </div>
            <span className="font-display font-bold text-2xl text-neutral-900">
              UNI<span className="text-gradient">CLUB</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/clubs" className="text-neutral-700 hover:text-sky-500 transition-colors font-medium">
              동아리 탐색
            </Link>
            <Link href="/recruitments" className="text-neutral-700 hover:text-sky-500 transition-colors font-medium">
              모집공고
            </Link>
            <Link href="/about" className="text-neutral-700 hover:text-sky-500 transition-colors font-medium">
              소개
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-neutral-700 hover:text-sky-500 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-neutral-700 hover:text-sky-500 transition-colors font-medium"
                >
                  <User className="w-5 h-5" />
                  <span>{user?.name}님</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-neutral-700 hover:text-sky-500 transition-colors font-medium"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2.5 bg-sky-500 text-white rounded-2xl font-semibold hover:bg-sky-600 hover:shadow-primary transform hover:scale-105 transition-all"
                >
                  시작하기
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-sky-500 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/clubs"
              className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              동아리 탐색
            </Link>
            <Link
              href="/recruitments"
              className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              모집공고
            </Link>
            <Link
              href="/about"
              className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              소개
            </Link>

            <div className="pt-4 border-t border-neutral-200 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>내 프로필</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>로그아웃</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors font-medium text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-4 py-3 bg-sky-500 text-white rounded-2xl font-semibold text-center hover:bg-sky-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    시작하기
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
