import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">U</span>
              </div>
              <span className="font-bold text-white">UNICLUB</span>
            </div>
            <p className="text-sm text-gray-400">
              대학 동아리 플랫폼
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium text-white text-sm mb-3">서비스</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/clubs" className="text-sm hover:text-white transition-colors">
                  동아리
                </Link>
              </li>
              <li>
                <Link href="/recruitments" className="text-sm hover:text-white transition-colors">
                  모집공고
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-medium text-white text-sm mb-3">고객지원</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium text-white text-sm mb-3">약관</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-xs">
          <p>&copy; 2025 UNICLUB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
