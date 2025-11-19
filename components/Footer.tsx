import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center shadow-primary">
                <span className="text-white font-display font-bold text-xl">U</span>
              </div>
              <span className="font-display font-bold text-2xl">
                UNI<span className="text-sky-400">CLUB</span>
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              대학 생활의 시작,<br />
              동아리에서 찾는 나의 열정
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">바로가기</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/clubs" className="text-neutral-400 hover:text-sky-400 transition-colors">
                  동아리 탐색
                </Link>
              </li>
              <li>
                <Link href="/recruitments" className="text-neutral-400 hover:text-sky-400 transition-colors">
                  모집공고
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-sky-400 transition-colors">
                  서비스 소개
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">지원</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-neutral-400 hover:text-sky-400 transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-sky-400 transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-400 hover:text-sky-400 transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-400 hover:text-sky-400 transition-colors">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">소셜</h3>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-sky-500 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-sky-500 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-sky-500 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@uniclub.com"
                className="w-10 h-10 bg-neutral-800 hover:bg-sky-500 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          <p>&copy; 2025 UNICLUB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
