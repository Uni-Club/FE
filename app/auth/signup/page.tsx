'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Phone, School, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    studentId: '',
    schoolId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API 연동 로직 추가
    console.log('Signup:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <h1 className="font-display font-bold text-6xl mb-6 leading-tight">
            지금 가입하고<br />
            <span className="text-gradient">특별한 경험</span>을<br />
            시작하세요
          </h1>

          <p className="text-xl text-navy/70 mb-12 leading-relaxed">
            UNICLUB과 함께 당신의 캠퍼스 라이프를 더욱 풍성하게 만들어보세요.
          </p>

          <div className="space-y-6">
            {[
              '500개 이상의 동아리 무료 탐색',
              '실시간 모집공고 알림',
              '체계적인 동아리 활동 관리',
              '다양한 학생들과의 네트워킹',
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-gradient-coral rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg text-navy font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Signup Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-medium">
            <h2 className="font-display font-bold text-4xl mb-2">회원가입</h2>
            <p className="text-navy/60 mb-8">
              이미 계정이 있으신가요?{' '}
              <Link href="/auth/login" className="text-coral hover:underline font-medium">
                로그인
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-navy mb-2">
                  이름
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="홍길동"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-sand/30 rounded-xl border border-transparent focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all font-medium text-navy placeholder:text-navy/40"
                  />
                </div>
              </div>

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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@university.ac.kr"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-sand/30 rounded-xl border border-transparent focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all font-medium text-navy placeholder:text-navy/40"
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="8자 이상 (영문, 숫자, 특수문자)"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-sand/30 rounded-xl border border-transparent focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all font-medium text-navy placeholder:text-navy/40"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-navy mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-sand/30 rounded-xl border border-transparent focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all font-medium text-navy placeholder:text-navy/40"
                  />
                </div>
              </div>

              {/* Phone (Optional) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-navy mb-2">
                  전화번호 <span className="text-navy/40">(선택)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="010-1234-5678"
                    className="w-full pl-12 pr-4 py-3.5 bg-sand/30 rounded-xl border border-transparent focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all font-medium text-navy placeholder:text-navy/40"
                  />
                </div>
              </div>

              {/* School */}
              <div>
                <label htmlFor="schoolId" className="block text-sm font-medium text-navy mb-2">
                  학교 <span className="text-navy/40">(선택)</span>
                </label>
                <div className="relative">
                  <School className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
                  <select
                    id="schoolId"
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-sand/30 rounded-xl border border-transparent focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all font-medium text-navy"
                  >
                    <option value="">학교를 선택하세요</option>
                    <option value="1">인하대학교</option>
                    <option value="2">서울대학교</option>
                    <option value="3">연세대학교</option>
                    <option value="4">고려대학교</option>
                  </select>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-5 h-5 rounded border-navy/20 text-coral focus:ring-coral/20"
                  />
                  <span className="text-sm text-navy/70 group-hover:text-navy transition-colors">
                    <span className="font-medium text-coral">(필수)</span> 이용약관 및 개인정보처리방침에
                    동의합니다
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 rounded border-navy/20 text-coral focus:ring-coral/20"
                  />
                  <span className="text-sm text-navy/70 group-hover:text-navy transition-colors">
                    <span className="font-medium text-navy/50">(선택)</span> 마케팅 정보 수신에 동의합니다
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-coral text-white rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 group"
              >
                가입하기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
