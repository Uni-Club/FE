import Hero from '@/components/Hero';
import Features from '@/components/Features';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-navy relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-coral/20 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display font-bold text-5xl sm:text-6xl text-white mb-6">
            지금 바로<br />시작해보세요
          </h2>
          <p className="text-xl text-cream/80 mb-12 max-w-2xl mx-auto">
            무료로 가입하고 캠퍼스의 모든 동아리를 탐색하세요.<br />
            새로운 친구들과 함께 특별한 경험을 만들어보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-coral text-white rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              무료로 시작하기
            </a>
            <a
              href="/clubs"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
            >
              동아리 둘러보기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
