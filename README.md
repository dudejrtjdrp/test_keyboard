# ⌨️ 키보드 동시입력 테스트

여러 키를 동시에 눌러 키보드와 마우스를 테스트할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능

- **동시 키 입력 테스트**: 여러 키를 동시에 눌러 최대 몇 개까지 인식되는지 확인
- **키보드 시각화**: 실시간으로 눌린 키를 키보드 UI에 표시 (영어 + 한글 표시)
- **키 입력 트레일**: 키를 뗀 후에도 흔적이 남아 입력 패턴 확인 가능
- **마우스 버튼 테스트**: 좌클릭, 휠클릭, 우클릭 테스트
- **반응속도 게임**: 1000개 이상의 단어 풀에서 랜덤으로 5개 선택하여 반응속도 측정
- **통계 기록**: 현재 누른 키 수, 최대 기록, 총 누른 횟수 추적
- **다국어 지원**: 한국어/English 전환
- **OS 키보드 레이아웃**: Windows/Mac 키보드 레이아웃 전환
- **상세 로그**: 키 입력/해제 시간, 유지 시간, 순서 기록

## 🚀 빠른 시작

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

## 🛠 기술 스택

- **TypeScript** - 타입 안정성
- **Vite** - 빠른 개발 환경 및 빌드
- **Vanilla JS** - 프레임워크 없는 순수 JavaScript
- **CSS3** - 애니메이션 및 Glass Morphism 디자인
- **Google AdSense** - 광고 수익화

## 📦 프로젝트 구조

```
testkeyboard/
├── src/
│   ├── app.ts          # 메인 애플리케이션 로직
│   ├── styles.css      # 스타일시트
│   └── words.ts        # 반응속도 게임용 단어 풀 (1000+ 단어)
├── index.html          # HTML 진입점
├── package.json        # 프로젝트 설정
├── tsconfig.json       # TypeScript 설정
├── vercel.json         # Vercel 배포 설정
└── .gitignore          # Git 제외 파일 목록
```

## 🎮 사용 방법

### 1. 키보드 동시입력 테스트
- 키보드의 여러 키를 동시에 눌러보세요
- 화면의 키보드 UI에서 실시간으로 확인 가능
- 최대 기록이 자동으로 저장됩니다

### 2. 반응속도 테스트 게임
- "⚡ 반응속도 테스트" 버튼 클릭
- 준비 메시지 후 랜덤 딜레이(0.5-2초)로 단어 표시
- 빠르게 단어를 입력하고 Enter 키로 제출
- 5개 단어 완료 후 평균/최고/최저 반응시간 확인

### 3. 마우스 버튼 테스트
- 마우스 좌클릭, 휠클릭, 우클릭을 눌러보세요
- 각 버튼이 정상 작동하는지 확인 가능

### 4. OS 전환
- Windows/Mac 키보드 레이아웃 전환
- 키 라벨이 OS에 맞게 변경됩니다

## 💰 광고 수익화 (AdSense)

광고 수익화를 위해 Google AdSense가 통합되어 있습니다.
자세한 설정 방법은 [ADSENSE_SETUP.md](ADSENSE_SETUP.md) 파일을 참고하세요.

### AdSense 설정 요약
1. Google AdSense 계정 생성
2. `index.html`에서 Publisher ID와 Ad Slot ID 교체
3. 실제 도메인에 배포 후 사이트 승인 대기

## 🌐 배포 (Vercel)

### 자동 배포
이 프로젝트는 Vercel에 최적화되어 있습니다.

```bash
# Vercel CLI 로그인
vercel login

# 배포
vercel
```

또는 GitHub 연동 후 자동 배포:
1. Vercel 대시보드에서 "Import Project"
2. GitHub 저장소 선택
3. 자동으로 빌드 및 배포

### 배포 URL
배포 후 `https://your-project.vercel.app` 형태의 URL이 제공됩니다.

## 🔒 보안

- `.gitignore`에 민감한 파일들이 포함되어 있습니다
- 환경 변수는 `.env` 파일에 저장 (Git 제외)
- AdSense ID는 공개되어도 안전하지만, 원한다면 Vercel 환경 변수로 관리 가능

## 📊 브라우저 지원

- Chrome (권장)
- Firefox
- Safari
- Edge

## 📝 라이선스

MIT License

## 👨‍💻 개발자

GitHub: [@dudejrtjdrp](https://github.com/dudejrtjdrp)

## 🤝 기여

이슈 및 풀 리퀘스트는 언제나 환영합니다!

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있다면 이슈를 열어주세요.
