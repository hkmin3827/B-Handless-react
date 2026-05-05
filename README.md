# B-Handless — 대시보드

> Windows 시작 프로그램 관리 앱의 React 프론트엔드입니다.  
> FastAPI 백엔드(`server/`)와 함께 동작하며, PWA로 설치해 앱처럼 사용할 수 있습니다.

---

## 기술 스택

| 항목 | 버전 |
|---|---|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| Tailwind CSS | v4 |
| TanStack Query | v5 |
| vite-plugin-pwa | 1.2 |

---

## 실행 방법

### 개발 서버

```bash
npm install
npm run dev
```

`http://localhost:3000` 에서 확인.  
API 요청은 `/api/*` 경로로 `http://127.0.0.1:8000` 에 자동 프록시됩니다.  
백엔드도 함께 실행해야 데이터가 표시됩니다.

```bash
# server/ 디렉터리에서
python main.py --serve
```

### 프로덕션 빌드

```bash
npm run build
```

결과물은 `dist/` 에 생성됩니다.  
루트의 `build.bat` 을 실행하면 빌드 → Python 서버 통합 → PyInstaller 패키징까지 한 번에 처리됩니다.

---

## 프로젝트 구조

```
src/
├── api.ts                  API 클라이언트 (fetch wrapper, 타입 정의)
├── App.tsx                 루트 컴포넌트 (QueryClientProvider + 레이아웃)
├── index.css               전역 스타일 (글래스모피즘 유틸리티 클래스)
├── components/
│   ├── OrbBackground.tsx   배경 장식 오브 (고정 위치)
│   ├── Sidebar.tsx         접이식 사이드바 (64px ↔ 200px)
│   ├── Toggle.tsx          커스텀 토글 스위치
│   ├── ItemCard.tsx        시작 항목 카드 (배지 · 토글 · 실행 · 삭제)
│   └── ItemModal.tsx       항목 추가 / 수정 모달
└── pages/
    ├── Home.tsx            시작 항목 목록 (활성 / 비활성 분리)
    └── Settings.tsx        포트 · 로그 · 시작 등록 설정
```

---

## 디자인 시스템

메인 컬러 `#6F9FF2` (블루) · `#B864D4` (퍼플)을 기반으로 한 글래스모피즘 UI입니다.

```css
/* 주요 유틸리티 클래스 (index.css) */
.glass          /* 반투명 카드 패널 */
.glass-sm       /* 더 가벼운 유리 패널 */
.btn-primary    /* 블루 액션 버튼 */
.btn-ghost      /* 투명 보조 버튼 */
.btn-danger     /* 빨간 삭제 버튼 */
.toggle-track   /* 커스텀 토글 트랙 */
.input-glass    /* 유리 스타일 인풋 */
.select-glass   /* 유리 스타일 셀렉트 */
.modal-overlay  /* 모달 배경 오버레이 */
```

자세한 내용은 `docs/DESIGN.md` 를 참고하세요.

---

## API 연동

`src/api.ts` 에서 모든 API 요청을 관리합니다.

```ts
api.items.list()               // GET    /api/items
api.items.add(body)            // POST   /api/items
api.items.update(id, body)     // PATCH  /api/items/:id
api.items.delete(id)           // DELETE /api/items/:id
api.items.toggle(id)           // POST   /api/items/:id/toggle
api.items.run(id)              // POST   /api/items/:id/run
api.settings.get()             // GET    /api/settings
api.settings.update(body)      // PATCH  /api/settings
api.browsers.list()            // GET    /api/browsers
```

---

## PWA 설치

빌드 후 Chrome / Edge 주소창 우측의 **설치** 아이콘을 클릭하면  
브라우저 크롬 없이 독립 앱처럼 실행됩니다 (`display: standalone`).

---

## 참고

- 백엔드: `server/README.md`
- 디자인 가이드: `docs/DESIGN.md`
- 전체 구조: `docs/B-Handless_프로젝트구조.docx`
