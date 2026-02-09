import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-5xl font-bold text-indigo-500">404</span>
        </div>
        <h1 className="font-bold text-3xl text-slate-900 mb-4">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          URL을 다시 확인해주세요.
        </p>
        <Button asChild>
          <Link href="/">
            홈으로 돌아가기
          </Link>
        </Button>
      </div>
    </main>
  );
}
