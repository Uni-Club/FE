'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft, User, LogOut } from 'lucide-react';

interface SiteHeaderProps {
  showBack?: boolean;
  backHref?: string;
  className?: string;
}

export default function SiteHeader({ showBack = false, backHref, className }: SiteHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className={`bg-white border-b border-gray-200 ${className || ''}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="UNICLUB 로고" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-bold text-gray-900">UNICLUB</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/member" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user.name}님</span>
                </Link>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost">
                  <Link href="/login">로그인</Link>
                </Button>
                <Button asChild className="bg-indigo-600 text-white hover:bg-indigo-700">
                  <Link href="/signup">회원가입</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


