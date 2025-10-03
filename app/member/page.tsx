'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { userAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User,
  Mail,
  Phone,
  CreditCard,
  School,
  Lock,
  Save,
  LogOut,
  Settings,
  Shield,
  Edit3,
  Check,
  X,
  ArrowLeft
} from 'lucide-react';

interface UserProfile {
  userId: number;
  email: string;
  name: string;
  phone?: string;
  studentId?: string;
  schoolId: number;
  schoolName: string;
  createdAt: string;
}

export default function MemberPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    studentId: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const data = await userAPI.getMe();
      setProfile(data);
      setFormData({
        name: data.name,
        phone: data.phone || '',
        studentId: data.studentId || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('프로필을 불러오는데 실패했습니다.');
    }
  };

  const handleUpdateProfile = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await userAPI.updateMe({
        name: formData.name,
        phone: formData.phone || undefined,
        studentId: formData.studentId || undefined,
      });
      setSuccess('프로필이 성공적으로 업데이트되었습니다.');
      setEditMode(false);
      loadProfile();
    } catch (err: any) {
      setError(err.response?.data?.error || '프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await userAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setSuccess('비밀번호가 성공적으로 변경되었습니다.');
      setPasswordMode(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || '비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/search')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">U</span>
                </div>
                <span className="text-xl font-bold text-gray-900">UNICLUB</span>
              </Link>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 프로필 헤더 */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.name}
                  </h1>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Shield className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* 알림 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <X className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-800">{success}</span>
            </div>
          )}

          {/* 프로필 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">프로필 정보</h2>
              {!editMode && (
                <Button
                  onClick={() => setEditMode(true)}
                  variant="outline"
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  수정
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-gray-600 text-sm">이름</Label>
                {editMode ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-2 border-gray-300"
                  />
                ) : (
                  <div className="mt-2 flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{profile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-600 text-sm">이메일</Label>
                <div className="mt-2 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.email}</span>
                </div>
              </div>

              <div>
                <Label className="text-gray-600 text-sm">전화번호</Label>
                {editMode ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="010-1234-5678"
                    className="mt-2 border-gray-300"
                  />
                ) : (
                  <div className="mt-2 flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">
                      {profile.phone || '등록되지 않음'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-600 text-sm">학번</Label>
                {editMode ? (
                  <Input
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    placeholder="12241234"
                    className="mt-2 border-gray-300"
                  />
                ) : (
                  <div className="mt-2 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">
                      {profile.studentId || '등록되지 않음'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-600 text-sm">학교</Label>
                <div className="mt-2 flex items-center gap-3">
                  <School className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">대학교</span>
                </div>
              </div>

              {editMode && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                  <Button
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        name: profile.name,
                        phone: profile.phone || '',
                        studentId: profile.studentId || '',
                      });
                    }}
                    variant="outline"
                    className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    취소
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* 비밀번호 변경 */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">비밀번호 변경</h2>
              {!passwordMode && (
                <Button
                  onClick={() => setPasswordMode(true)}
                  variant="outline"
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  변경
                </Button>
              )}
            </div>

            {passwordMode ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-600 text-sm">현재 비밀번호</Label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="mt-2 border-gray-300"
                  />
                </div>

                <div>
                  <Label className="text-gray-600 text-sm">새 비밀번호</Label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="mt-2 border-gray-300"
                  />
                </div>

                <div>
                  <Label className="text-gray-600 text-sm">새 비밀번호 확인</Label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="mt-2 border-gray-300"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    변경하기
                  </Button>
                  <Button
                    onClick={() => {
                      setPasswordMode(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                    variant="outline"
                    className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                보안을 위해 주기적으로 비밀번호를 변경해주세요.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}