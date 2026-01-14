'use client';

import Image from 'next/image';

const screenshots = [
  {
    id: 'search',
    title: '동아리 검색',
    description: '학교, 카테고리별로 원하는 동아리를 쉽게 찾아보세요',
    image: '/screenshots/search.png', // 나중에 실제 스크린샷으로 교체
  },
  {
    id: 'apply',
    title: '간편 지원',
    description: '마음에 드는 동아리에 바로 지원서를 제출하세요',
    image: '/screenshots/apply.png',
  },
  {
    id: 'manage',
    title: '동아리 관리',
    description: '일정, 게시판, 멤버를 한 곳에서 관리하세요',
    image: '/screenshots/manage.png',
  },
];

export default function Features() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            이렇게 사용해요
          </h2>
          <p className="text-gray-500">
            UNICLUB으로 동아리 활동을 더 편하게
          </p>
        </div>

        {/* 스크린샷 리스트 */}
        <div className="space-y-16">
          {screenshots.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-8 md:gap-12`}
            >
              {/* 스크린샷 이미지 */}
              <div className="flex-1 w-full">
                <div className="relative aspect-[16/10] bg-gray-200 rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                  {/* 실제 이미지가 없을 때 플레이스홀더 */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📱</span>
                      </div>
                      <p className="text-sm">스크린샷 준비중</p>
                    </div>
                  </div>
                  {/*
                    실제 이미지 사용 시 아래 주석 해제:
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  */}
                </div>
              </div>

              {/* 텍스트 설명 */}
              <div className="flex-1 text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full mb-3">
                  {`0${index + 1}`}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
