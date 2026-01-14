import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            아직 회원이 아니신가요?
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            지금 가입하고 우리 학교 동아리 정보를 확인하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              회원가입
            </Link>
            <Link
              href="/clubs"
              className="px-6 py-2.5 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              둘러보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
