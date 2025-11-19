import Hero from '@/components/Hero';
import Features from '@/components/Features';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />

      {/* CTA Section - Umami style with sky blue gradient */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-500 relative overflow-hidden">
        {/* Decorative elements - floating orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-delayed" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display font-bold text-5xl sm:text-6xl text-white mb-6">
            지금 바로<br />시작해보세요
          </h2>
          <p className="text-xl text-sky-50 mb-12 max-w-2xl mx-auto leading-relaxed">
            무료로 가입하고 캠퍼스의 모든 동아리를 탐색하세요.<br />
            새로운 친구들과 함께 특별한 경험을 만들어보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-sky-600 rounded-2xl font-bold text-lg hover:shadow-soft-xl hover:scale-105 transition-all"
            >
              무료로 시작하기
            </a>
            <a
              href="/clubs"
              className="inline-flex items-center justify-center px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
            >
              동아리 둘러보기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
