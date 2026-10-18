# 바이너리 자산운용 리포트 사이트

`reports/*.md`와 `journal/02_trade_journal.md`를 읽어 정적 웹사이트를 만든다 (Astro).
리포트를 커밋하면 Cloudflare Pages가 자동으로 다시 빌드·배포한다.

## 페이지
| 주소 | 내용 | 데이터 |
|---|---|---|
| `/` | 홈: 회사 판단, 시장 수치, 시나리오, 일정, 관찰 목록, 최근 리포트 | 최신 일요 준비·토요 복기의 데이터 블록 |
| `/reports/` | 보관함: 종류 탭, 검색, 주제 칩 | 모든 리포트 |
| `/reports/<파일명>/` | 리포트 상세: 목차 + 본문 | 리포트 본문 |
| `/mistakes/` | 실수 코드, 언급 횟수, 매매 규칙, 실패노트, 매매일지 원문 | journal + 리포트 본문 |
| `/about/` | 회사 소개, 원칙, 면책 고지 | 고정 |

새 리포트 맨 앞에는 데이터 블록이 있어야 한다 → `docs/03_weekly_report_template.md` "웹사이트용 데이터 블록".
데이터 블록 형식이 틀리면 빌드가 실패하고 이전 버전이 그대로 남는다(Cloudflare 대시보드의 배포 로그에서 원인 확인).

## 내 컴퓨터에서 미리 보기
```bash
cd site
npm install
npm run dev      # http://localhost:4321
```

---

## Cloudflare Pages 설정 (처음 한 번)

### 1. 가입
1. https://dash.cloudflare.com/sign-up 에서 이메일로 가입한다 (무료).
2. 받은 메일의 인증 링크를 누른다.

### 2. 저장소 연결
1. 대시보드 왼쪽 **Workers & Pages** → **Create** → **Pages** 탭 → **Connect to Git**.
2. **GitHub** 선택 → GitHub 로그인 → 앱 설치 화면에서 **Only select repositories** → `binary-capital`만 고른다.
3. 저장소 목록에서 `binary-capital` → **Begin setup**.
4. 아래처럼 입력한다.

| 항목 | 값 |
|---|---|
| Project name | `binary-capital` (주소가 `binary-capital.pages.dev`가 됨. 이미 쓰이면 다른 이름) |
| Production branch | `main` |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory (Advanced) | `site` |
| Environment variable | `NODE_VERSION` = `22` |

5. **Save and Deploy**. 1~2분 뒤 주소가 나온다.

### 3. 나만 보게 잠그기 (Cloudflare Access)
버튼 하나로 켜지는 기본 잠금은 **미리보기 주소만** 잠근다. 본 주소까지 잠그려면 아래 순서를 끝까지 따른다.
1. Workers & Pages → `binary-capital` 프로젝트 → **Settings** → **Enable access policy**.
   - 처음이면 Zero Trust 팀 이름(예: `binarycapital`)과 **Free** 요금제를 고르라고 한다. 결제 수단을 물을 수 있지만 무료 요금제는 청구되지 않는다.
2. 만들어진 정책 옆 **Manage** → Access **Applications** 목록에서 이 프로젝트 선택 → **Configure**.
3. **Public hostname**의 **Subdomain** 칸에 있는 `*`를 지우고 **Save**. (이름 중복 오류가 나면 Application name을 `binary-capital-prod`처럼 바꾼다.) 이제 이 정책이 본 주소를 잠근다.
4. 같은 화면의 **Policies**에서 규칙을 `Include` · `Emails` · `bit2001.lee@gmail.com` 하나만 남긴다.
5. 프로젝트로 돌아가 **Settings** → **General** → **Enable access policy**를 한 번 더 눌러 미리보기용 정책도 만든다. 새 정책도 4번처럼 이메일을 맞춘다.
6. Zero Trust → Access → Applications에 정책이 2개(본 주소용, `*.binary-capital.pages.dev` 미리보기용) 있는지 확인한다.
7. 확인: 시크릿 창에서 `https://binary-capital.pages.dev` 접속 → 이메일 입력 화면이 나오면 성공. 이메일로 온 6자리 코드를 넣으면 열린다.

참고: https://developers.cloudflare.com/pages/platform/known-issues/ ("Enable Access on your *.pages.dev domain")

### 4. 이후 운영
- 리포트를 `main`에 커밋하면 자동 배포된다. 할 일 없음.
- 공개 전환: 3번의 Access 정책을 삭제하면 누구나 볼 수 있다. 동시에 `src/layouts/Base.astro`의 `noindex` 줄을 지우고 "비공개 운영 중" 표시를 바꾼다.
