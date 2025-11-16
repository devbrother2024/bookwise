# BookWise - Technical Specification

## Source Tree Structure

```
/doc
/public
  └─ icons/
app/                              # Next.js 16 App Router (layouts, pages, loading, route files per segment)
  ├─ page.tsx                     # 메인 콘텐츠 카드 리스트
  └─ [slug]/page.tsx              # 상세 콘텐츠 + 외부 결제 버튼
  └─ globals.css                  # 글로벌 스타일 (Next.js 권장 위치, layout.tsx에서 import)
components/
  ├─ ContentCard.tsx
  ├─ Filters.tsx
  └─ ContentDetail.tsx
hooks/
  ├─ useContentList.ts
  ├─ useFilters.ts
  └─ usePaymentRedirect.ts
lib/
  ├─ contentClient.ts             # 외부 관리자 API 클라이언트
  └─ types.ts
styles/
  └─ globals.css
utils/
  └─ formatCurrency.ts
next.config.ts                     # Next.js configuration (App Router, ISR, env)
tsconfig.json                      # TypeScript compiler options
components.json                   # `shadcn/ui` 컴포넌트 설정 manifest
```

---

## Technical Approach

- Next.js 16 App Router를 활용해 `app/page.tsx`와 `app/[slug]/page.tsx`를 Server Component로 구성하고, `fetch`의 `next: { revalidate: 60 }` 옵션을 사용해 외부 관리자 API 데이터를 ISR 형태로 수집한다.
- 상세 페이지는 slug 기반으로 Server Component 안에서 데이터 fetch 후 external payment URL만 노출하며, 클라이언트 전용 `ContentCard`/`Filters`는 `'use client'` 선언을 유지해 최소한의 상호작용만 처리한다.
- 카드/필터 UI는 클라이언트에서 query params로 상태를 유지하고, 서버 측 데이터는 raw list 그대로 전달해 단순화한다.
- 외부 결제 버튼은 Lemonsqueezy JS SDK (`window.Lemonsqueezy.checkout`)로 결제창을 띄우며, 실패 시에는 간단한 오류 메시지를 보여준다. 추가로 “이메일 안내 예정” 텍스트만 노출한다.
- 외부 결제 리턴/피드백은 Next.js 16의 API Route(예: `app/api/events/payment-callback/route.ts`)에서 webhook을 받아 간단한 로그만 남긴 뒤 204 응답을 반환하며, 상태 업데이트는 UI에는 반영하지 않는다.

---

## Implementation Stack

- Next.js (TypeScript 기반 App Router)
- React + Tailwind CSS (또는 CSS Modules)
- `shadcn/ui` 컴포넌트 라이브러리 (Card, Button 등 Radix 기반 컴포넌트)
- Vercel 배포 (Edge functions 불필요)
- REST 기반 외부 관리자 API (예: `GET /contents`, `GET /contents/{slug}`)
- (선택적) SWR 또는 React Query for client cache
- `node-fetch` 또는 내장 `fetch` + `msw` for mocks in dev
- (로그) Vercel Logs 또는 `console` 기반 기록

---

## Technical Details

- `contentClient.ts`는 외부 관리자 API에서 콘텐츠 데이터를 가져오는 클라이언트를 제공한다.
- 메인 페이지는 서버 측에서 콘텐츠 목록을 받아 카드 형태로 표시하며, 클라이언트에서 필터 UI를 구성한다.
- 필터 기능은 클라이언트 측에서 구현하고, URL query params를 사용해 상태를 공유한다.
- 상세 페이지는 콘텐츠 정보를 표시하고, 결제 버튼은 Lemonsqueezy JS SDK (`window.Lemonsqueezy.checkout`)를 호출해 결제창을 띄운다.
- 데이터 재검증은 ISR을 통해 주기적으로 최신화한다.

---

## Development Setup

- `git clone ... && pnpm install`
- `pnpm run dev` → `http://localhost:3000`
- `npm run lint`, `npm run test`
- Mock 데이터가 필요하면 `scripts/mock-content.ts` 실행 또는 `msw`로 `/api/content` intercept
- 파일 기반 라우팅에 따라 `app/[slug]/page.tsx` 구성

---

## Implementation Guide

1. **컨텐츠 fetch**: `contentClient.getContents()`를 구현하고 `app/page.tsx`에서 `const contents = await getContents()`로 받아 `ContentCard` 리스트로 렌더링.
2. **필터/검색**: `Filters` 컴포넌트는 카테고리/지역/상태 필터 버튼을 제공하며 `router.replace`로 query params 업데이트.
3. **카드 UI**: `ContentCard`는 제목/카테고리/가격/상태만 보여주고 카드 클릭 시 `[slug]` 라우트로 이동, 카드 내 결제 버튼은 바로 external payment URL을 연다.
4. **상세 페이지**: `app/[slug]/page.tsx`에서 `const content = await getContentBySlug(slug)` → `<ContentDetail content={content} />` → 결제 버튼(`router.push(content.paymentUrl)`).
5. **간단한 상태 안내**: 가격/환율/세금은 `formatCurrency` helper로 보여주고, 결제 리턴은 `useEffect(() => logPaymentStatus())`로 서버 API에 기록만 함.
6. **외부 결제 webhook**: `/api/events/payment-callback.ts`로 POST 요청을 받고, `console.log` 또는 로깅 서비스로 상태만 남김.

---

## Testing Approach

- **컴포넌트 테스트**: React Testing Library로 `ContentCard`, `Filters`, `ContentDetail` 렌더링/interaction 확인.
- **Integration**: ISR/SSR 없이 `msw` mock server로 `getContents` response를 고정하고 `app/page.tsx` snapshot.
- **Manual flow**: `npm run dev` 후 `cards → detail → 결제 버튼(remote)`을 수동 확인.
- **Error handling**: 외부 API 실패 시 `error` 영역/`Retry` 링크(단순) 제공 여부 테스트.
- **E2E (추후)**: Playwright/Cypress로 “상품 목록 → 상세 → 결제 열기” 시나리오 추가 계획.

---

## Deployment Strategy

- **Platform**: Vercel (main 브랜치 push 시 자동 빌드)
- **Env vars**: `NEXT_PUBLIC_CONTENT_API`, `NEXT_PUBLIC_PAYMENT_BASE`, `NEXT_PUBLIC_REGION` 등록
- **Cache**: ISR 설정(`revalidate: 60`) + Vercel의 빌드 캐시가 메인 페이지 응답을 60초 간 캐싱
- **Monitoring**: Vercel Logs & Sentry (optional)으로 fetch 실패/결제 콜백 상태 체크
- **Rollback**: 문제가 발생하면 이전 배포(History)로 revert
- **CDN**: Vercel Edge CDN으로 정적 페이지 배포, `Cache-Control`로 1분 TTL 유지
