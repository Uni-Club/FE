import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />

      {/* CTA Section - 간결하게 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-blue-100 mb-8">
            무료로 가입하고 우리 학교 동아리를 탐색하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="px-6 py-3 bg-white text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/clubs"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              동아리 둘러보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
