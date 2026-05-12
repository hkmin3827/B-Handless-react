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
├── App.tsx                 루트 컴포넌트 (서버 오프라인 감지 + 레이아웃)
├── index.css               전역 스타일 (매트 파스텔 유틸리티 클래스)
├── components/
│   ├── OrbBackground.tsx   배경 장식 오브 (고정 위치)
│   ├── HeroGraphic.tsx     히어로 섹션 그래픽
│   ├── Sidebar.tsx         접이식 사이드바 (64px ↔ 200px)
│   ├── Toggle.tsx          커스텀 토글 스위치
│   ├── ItemCard.tsx        시작 항목 카드 (배지 · 토글 · 실행 · 삭제)
│   └── ItemModal.tsx       항목 추가 / 수정 모달
└── pages/
    ├── Home.tsx            시작 항목 목록 (활성 / 비활성 분리)
    ├── CategoryPage.tsx    카테고리별 항목 목록 (web / app / exe)
    └── Settings.tsx        포트 · 로그 · 시작 등록 설정
```

---

## 디자인 시스템

메인 컬러 `#6F9FF2` (블루) · `#B864D4` (퍼플)을 기반으로 한 매트 파스텔 UI입니다.  
배경은 `#F5F7FF` 화이트, 카드는 순백 배경 + 다층 그림자로 입체감을 표현합니다.  
backdrop-filter 없이 `box-shadow`만으로 깊이를 만드는 그래픽 디자인 스타일입니다.

```css
/* 주요 유틸리티 클래스 (index.css) */
.glass          /* 매트 흰 카드 (3단 그림자) */
.glass-sm       /* 가벼운 보조 카드 */
.btn-primary    /* 블루→퍼플 그라디언트 버튼 */
.btn-ghost      /* 파스텔 블루 보조 버튼 */
.btn-danger     /* 연한 레드 삭제 버튼 */
.toggle-track   /* 커스텀 토글 트랙 */
.input-glass    /* 파스텔 베이스 인풋 */
.select-glass   /* 파스텔 베이스 셀렉트 */
.modal-overlay  /* 모달 배경 오버레이 */
```

자세한 내용은 `docs/DESIGN.md` 를 참고하세요.

---

## 서버 오프라인 감지

`App.tsx` 마운트 시 `/api/items` 로 헬스체크를 수행합니다.  
서버가 응답하지 않으면 화면 위에 오버레이를 표시합니다.

```
┌─────────────────────────────────┐
│  🔌 서버가 꺼져 있어요           │
│  B-Handless 서버가 실행 중이     │
│  아닙니다                        │
│                                 │
│  [ 🚀 B-Handless 서버 시작하기 ] │  ← bhandless:// 프로토콜 링크
│  [ 🔄 재연결 시도               ] │
└─────────────────────────────────┘
```

"서버 시작하기" 버튼은 `bhandless://` URL 프로토콜을 통해 `B-Handless.exe`를 실행합니다.  
서버 시작 후 "재연결 시도"를 누르면 페이지가 새로고침됩니다.

---

## 모바일 접근 차단

서버(`api/server.py`)에서 `user_agents` 라이브러리로 User-Agent를 파싱해  
`ua.is_mobile or ua.is_tablet` 이 참이면 `/mobile` 안내 페이지로 리다이렉트합니다.

- 정적 에셋(`.js`, `.css`, `.png` 등)은 차단에서 제외
- 키워드 매칭이 아닌 UA 파싱 기반이므로 오탐 위험이 낮음

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
api.startup.register()         // POST   /api/startup/register
api.startup.unregister()       // POST   /api/startup/unregister
api.browsers.list()            // GET    /api/browsers
api.apps.search(q)             // GET    /api/apps/search?q=
```

---

## PWA 설치

빌드 후 Chrome / Edge 주소창 우측의 **설치** 아이콘을 클릭하면  
브라우저 크롬 없이 독립 앱처럼 실행됩니다 (`display: standalone`).

PWA 아이콘 파일(`icon-192.png`, `icon-512.png`)은 `public/` 폴더에 위치합니다.

---

## 참고

- 백엔드: `server/README.md`
- 서비스 흐름: `server/SERVICE_FLOW.md`
- 디자인 가이드: `docs/DESIGN.md`
