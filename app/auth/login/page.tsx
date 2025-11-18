'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API 연동 로직 추가
    console.log('Login:', { email, password });
  };

  return (
    <main className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-coral/10 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-coral" />
            <span className="text-sm font-medium text-coral">UNICLUB에 오신 것을 환영합니다</span>
          </div>

          <h1 className="font-display font-bold text-6xl mb-6 leading-tight">
            나의 열정을<br />
            <span className="text-gradient">동아리</span>에서<br />
            시작하세요
          </h1>

          <p className="text-xl text-navy/70 mb-8 leading-relaxed">
            대학 생활의 모든 순간을 더 특별하게 만들어줄<br />
            동아리 활동이 여러분을 기다리고 있습니다.
          </p>

          <div className="flex items-center gap-8">
            <div>
              <div className="font-display font-bold text-3xl text-navy">500+</div>
              <div className="text-sm text-navy/60">등록된 동아리</div>
            </div>
            <div className="w-px h-12 bg-navy/10" />
            <div>
              <div className="font-display font-bold text-3xl text-navy">2,000+</div>
              <div className="text-sm text-navy/60">활동 중인 학생</div>
            </div>
          </div>
        </motion.div>

        {/* Right: Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-medium">
            <h2 className="font-display font-bold text-4xl mb-2">로그인</h2>
            <p className="text-navy/60 mb-8">
              아직 계정이 없으신가요?{' '}
              <Link href="/auth/signup" className="text-coral hover:underline font-medium">
                회원가입
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
                  이메일
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.ac.kr"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-sand/30 rounded-xl border border-transparent focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all font-medium text-navy placeholder:text-navy/40"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-navy mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-sand/30 rounded-xl border border-transparent focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all font-medium text-navy placeholder:text-navy/40"
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-navy/20 text-coral focus:ring-coral/20"
                  />
                  <span className="text-sm text-navy/70">로그인 상태 유지</span>
                </label>
                <Link href="/auth/forgot" className="text-sm text-coral hover:underline">
                  비밀번호 찾기
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-coral text-white rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 group"
              >
                로그인
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-navy/10" />
              <span className="text-sm text-navy/40">또는</span>
              <div className="flex-1 h-px bg-navy/10" />
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-white border-2 border-navy/10 rounded-xl font-medium text-navy hover:border-coral transition-all flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google로 계속하기
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
