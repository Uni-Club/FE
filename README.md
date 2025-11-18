# UNICLUB Frontend

대학 동아리 통합 관리 플랫폼 UNICLUB의 프론트엔드 애플리케이션입니다.

## 🎨 Design Concept

**"Campus Energy"** - 따뜻한 산호색과 네이비의 조화, 현대적이고 활기찬 디자인

### Color Palette
- **Primary (Coral)**: #FF6B6B - 활력과 열정
- **Secondary (Navy)**: #1A1D3A - 안정감과 전문성
- **Accent (Cyan)**: #00D9FF - 강조와 하이라이트
- **Background (Cream)**: #FFF8F0 - 따뜻하고 부드러운 배경

### Typography
- **Display Font**: Outfit - 기하학적이고 친근한 헤딩용 폰트
- **Body Font**: Manrope - 가독성 높은 본문용 폰트

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x 이상
- npm

### Installation

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── auth/              # 인증 페이지 (로그인, 회원가입)
│   ├── clubs/             # 동아리 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   └── globals.css        # 글로벌 스타일
├── components/            # 재사용 가능한 컴포넌트
└── lib/                   # 유틸리티 및 타입
```

## 📄 Pages

- `/` - 랜딩 페이지 (Hero, Features, CTA)
- `/clubs` - 동아리 탐색 및 검색
- `/clubs/[groupId]` - 동아리 상세 페이지
- `/auth/login` - 로그인
- `/auth/signup` - 회원가입

## 🔌 API Configuration

환경 변수 설정 (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## 📝 License

MIT License
