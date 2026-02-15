# Google AdSense 설정 가이드

이 프로젝트에 Google AdSense 광고가 추가되어 있습니다. 실제로 수익화하기 위해서는 아래 단계를 따라주세요.

## 1. Google AdSense 계정 생성

1. [Google AdSense](https://www.google.com/adsense) 접속
2. Google 계정으로 로그인
3. 웹사이트 URL 등록 (배포 후 실제 도메인 필요)
4. 계정 승인 대기 (보통 1-2일 소요)

## 2. 광고 코드 교체

### 승인 후 받게 될 정보:
- **Publisher ID**: `ca-pub-XXXXXXXXXXXXXXXX` 형태
- **Ad Slot ID**: 각 광고 단위별 고유 번호

### 교체할 위치:

#### index.html 파일에서:

1. **Head 섹션의 Publisher ID** (7번째 줄)
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
```
→ `ca-pub-XXXXXXXXXXXXXXXX`를 본인의 Publisher ID로 교체

2. **상단 광고** (data-ad-client와 data-ad-slot)
```html
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
data-ad-slot="1234567890"
```

3. **중간 광고** (controls 아래)
```html
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
data-ad-slot="0987654321"
```

4. **하단 광고** (key-history 아래)
```html
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
data-ad-slot="1122334455"
```

## 3. 광고 단위 생성 방법

1. AdSense 대시보드 → **광고** → **광고 단위 기준** 선택
2. **디스플레이 광고** 선택
3. 광고 이름 입력 (예: "키보드테스트-상단", "키보드테스트-중간")
4. 광고 크기: **반응형** 선택 (권장)
5. **만들기** 클릭
6. 생성된 코드에서 `data-ad-slot="숫자"` 부분 복사
7. index.html의 해당 위치에 붙여넣기

## 4. 현재 광고 배치

- **상단 배너**: 헤더 바로 위 (첫 방문자 눈에 잘 띔)
- **중간 광고**: 게임 컨트롤 버튼 아래 (자연스러운 콘텐츠 중간)
- **하단 광고**: 입력 기록 아래 (스크롤 끝 지점)

## 5. 수익 최적화 팁

### 권장사항:
- ✅ 반응형 광고 사용 (모바일/데스크톱 자동 최적화)
- ✅ 자동 광고 활성화 고려 (AdSense가 자동으로 최적 위치 선택)
- ✅ 페이지 로딩 속도 유지
- ✅ 광고와 콘텐츠 균형 유지

### 주의사항:
- ❌ 광고 클릭 유도 금지 ("광고를 클릭해주세요" 등)
- ❌ 자신의 광고 클릭 금지
- ❌ 광고 코드 임의 수정 금지
- ❌ 부적절한 콘텐츠와 함께 게재 금지

## 6. 배포 전 확인사항

1. ✅ Publisher ID 교체 완료
2. ✅ 모든 Ad Slot ID 교체 완료
3. ✅ 웹사이트를 실제 도메인에 배포
4. ✅ AdSense에서 사이트 승인 완료
5. ✅ 광고가 정상적으로 표시되는지 확인

## 7. 테스트 방법

배포 후 24-48시간 내에 광고가 표시되기 시작합니다.

### 확인 방법:
1. 실제 배포된 사이트 접속
2. 개발자 도구 (F12) → Console 탭 확인
3. AdSense 관련 오류 메시지 확인
4. 광고 공간에 광고 또는 빈 공간 표시 확인

## 8. 예상 수익

트래픽에 따라 다르지만 일반적으로:
- **1,000 방문자**: $1-5
- **10,000 방문자**: $10-50
- **100,000 방문자**: $100-500

※ 실제 수익은 트래픽, 클릭률(CTR), 광고 품질 등에 따라 크게 달라집니다.

## 9. 문제 해결

### 광고가 표시되지 않는 경우:
1. Publisher ID가 정확한지 확인
2. 사이트가 AdSense 정책을 준수하는지 확인
3. 브라우저 광고 차단기 비활성화
4. 24-48시간 대기 (새 사이트는 시간 필요)

### 계정 승인이 안 되는 경우:
- 충분한 콘텐츠 필요 (최소 20-30개 페이지 권장)
- 도메인 소유권 확인 필요
- 트래픽이 너무 적으면 거절될 수 있음

## 10. 추가 정보

- [Google AdSense 고객센터](https://support.google.com/adsense)
- [AdSense 정책](https://support.google.com/adsense/answer/48182)
- [광고 배치 가이드](https://support.google.com/adsense/answer/1354736)

---

**참고**: 이 프로젝트는 광고 통합이 준비되어 있지만, 실제 수익화를 위해서는 위 단계를 모두 완료해야 합니다.
