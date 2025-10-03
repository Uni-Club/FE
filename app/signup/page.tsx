'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CreditCard,
  School,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    studentId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: 기본정보, 2: 추가정보
  const router = useRouter();
  const { signup, user } = useAuth();

  useEffect(() => {
    // 이미 로그인한 경우 검색 페이지로 리다이렉트
    if (user) {
      router.push('/search');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
      setError('모든 필수 항목을 입력해주세요.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
        studentId: formData.studentId || undefined,
        schoolId: 1,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12">
      {/* 로고 */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="UNICLUB 로고" width={32} height={32} className="rounded-lg" />
          <span className="text-xl font-bold text-gray-900">UNICLUB</span>
        </Link>
      </div>

      {/* 회원가입 카드 */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            UNICLUB 시작하기
          </h1>
          <p className="text-gray-600">
            계정을 만들고 동아리 활동을 시작하세요
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-xl">
          {/* 진행 단계 표시 */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <div className={`w-20 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                2
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700">이름 *</Label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="pl-10 h-11 border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700">이메일 *</Label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="pl-10 h-11 border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700">비밀번호 *</Label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="8자 이상"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="pl-10 h-11 border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700">비밀번호 확인 *</Label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="비밀번호 재입력"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="pl-10 h-11 border-gray-300"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full h-11 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
                >
                  다음
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="phone" className="text-gray-700">전화번호</Label>
                  <div className="mt-1 relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="010-1234-5678"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      className="pl-10 h-11 border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="studentId" className="text-gray-700">학번</Label>
                  <div className="mt-1 relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="studentId"
                      name="studentId"
                      type="text"
                      placeholder="12241234"
                      value={formData.studentId}
                      onChange={handleChange}
                      disabled={loading}
                      className="pl-10 h-11 border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700">학교</Label>
                  <div className="mt-1 relative">
                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      value="대학교"
                      disabled
                      className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">* UNICLUB은 대학생 전용 플랫폼입니다</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    이전
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-11 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
                  >
                    {loading ? '가입 중...' : '가입하기'}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}